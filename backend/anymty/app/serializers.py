from rest_framework import serializers

from .models import ChatRoom, Message


class MessageSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp', 'type', 'file_url', 'file']
        read_only_fields = ['id', 'sender', 'timestamp', 'file_url']

    def create(self, validated_data):
        file = validated_data.pop('file', None)
        message = Message.objects.create(**validated_data)
        if file:
            file_url = self.context['view'].upload_file_to_s3(file)
            if file_url:
                message.file_url = file_url
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