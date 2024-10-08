import os
import uuid

import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ChatRoom, Message
from .serializers import (ChatRoomDetailSerializer, ChatRoomSerializer,
                          MessageSerializer)


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            return ChatRoom.objects.filter(Q(participants=user))
        return ChatRoom.objects.all()

    
    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        chat_room = self.get_object()  # Get the specific ChatRoom instance

        if request.method == 'GET':
            messages = chat_room.messages.order_by('timestamp')  # Ensure messages are ordered correctly
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = MessageSerializer(data=request.data, context={'request': request, 'view': self})
            if serializer.is_valid():
                serializer.save(chat_room=chat_room, sender=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def upload_file_to_s3(self, file):
        s3 = boto3.client('s3', 
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        try:
            file_extension = os.path.splitext(file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = f"{self.request.user.id}/{unique_filename}"
            
            s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, file_path)
            
            file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{file_path}"
            file_type = file.content_type
            return file_url, file_type
        except NoCredentialsError:
            return None, None



from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirmPassword')

        if password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
import logging

from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        logger.info(f"Login attempt for email: {email}")

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                'message': 'Login successful',
                'username': user.username,
                'user_id': user.id,  # Include the user ID
                'access': access_token,
                'refresh': str(refresh),
            })
        else:
            logger.warning(f"Login failed for email: {email}")
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt  # Exempt from CSRF validation if this view will be hit by an external cron job
def cron_view(request):
    # You can add additional logic here if needed
    return HttpResponse('Happy', content_type='text/plain')