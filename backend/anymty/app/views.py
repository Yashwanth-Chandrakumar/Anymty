from urllib import request

import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ChatRoom, Message
from .serializers import ChatSerializer, MessageSerializer


class ChatViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatSerializer

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        chat = self.get_object()

        if request.method == 'GET':
            messages = chat.messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            message_type = request.data.get('type', 'text')
            content = request.data.get('content', '')
            file = request.FILES.get('file')

            if message_type in ['image', 'file'] and file:
                file_url = self.upload_file_to_s3(file)
                if not file_url:
                    return Response({'error': 'Failed to upload file'}, status=400)
            else:
                file_url = None

            message = Message.objects.create(
                chat=chat,
                sender=request.user,
                content=content,
                type=message_type,
                file_url=file_url
            )
            serializer = MessageSerializer(message)
            return Response(serializer.data, status=201)

    def upload_file_to_s3(self, file):
        s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        try:
            file_name = f"{file.name}"
            s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, file_name)
            return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
        except NoCredentialsError:
            return None

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
                    
                'access': access_token,
                'refresh': str(refresh),
            })
        else:
            logger.warning(f"Login failed for email: {email}")
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)