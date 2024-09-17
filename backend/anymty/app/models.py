from django.contrib.auth.models import User
from django.db import models


class ChatRoom(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    participants = models.ManyToManyField(User, related_name='chat_rooms')  # No need for null=True
    description = models.TextField(blank=True, null=True)  # Optional field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
    )

    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages', null=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    content = models.TextField(blank=True, null=True)  # Optional for non-text messages
    file_url = models.URLField(blank=True, null=True)  # Optional for file messages
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=5, choices=MESSAGE_TYPES, default='text')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"  # Display first 20 characters of the content


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username
