import base64

from django.core.files.base import ContentFile
from rest_framework import serializers

from .models import ChatRoom, Message


class MessageSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=False)
    file_data = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp', 'type', 'file_url', 'file_type', 'file', 'file_data']
        read_only_fields = ['id', 'sender', 'timestamp', 'file_url', 'file_type']

    def create(self, validated_data):
        file = validated_data.pop('file', None)
        file_data = validated_data.pop('file_data', None)
        message = Message.objects.create(**validated_data)

        if file:
            file_url, file_type = self.context['view'].upload_file_to_s3(file)
            if file_url:
                message.file_url = file_url
                message.file_type = file_type
                message.type = 'image' if file_type.startswith('image/') else 'file'
                message.save()
        elif file_data:
            format, imgstr = file_data.split(';base64,')
            ext = format.split('/')[-1]
            file = ContentFile(base64.b64decode(imgstr), name=f'temp.{ext}')
            file_url, file_type = self.context['view'].upload_file_to_s3(file)
            if file_url:
                message.file_url = file_url
                message.file_type = file_type
                message.type = 'image'
                message.save()

        return message

    
class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'description', 'public', 'participants', 'admin', 'moderators', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'admin', 'participants']

    def create(self, validated_data):
        user = self.context['request'].user
        chat_room = ChatRoom.objects.create(admin=user, **validated_data)
        chat_room.participants.add(user)
        return chat_room

class ChatRoomDetailSerializer(ChatRoomSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta(ChatRoomSerializer.Meta):
        fields = ChatRoomSerializer.Meta.fields + ['messages']