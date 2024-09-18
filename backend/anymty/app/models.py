from django.contrib.auth.models import User
from django.db import models


class ChatRoom(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    participants = models.ManyToManyField(User, related_name='chat_rooms')  # All participants
    description = models.TextField(blank=True, null=True)  # Optional field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    public = models.BooleanField(default=False)  # Public or private chat room
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='admin_chat_rooms', null=True)  # Admin user
    moderators = models.ManyToManyField(User, related_name='moderator_chat_rooms', blank=True)  # Moderators

    def save(self, *args, **kwargs):
        # Check if the chat room is being created (i.e., no primary key yet)
        if not self.pk:
            # Save the instance first to create the primary key
            super().save(*args, **kwargs)
            # Add the admin as a participant
            if self.admin:
                self.participants.add(self.admin)
                self.save()  # Save again to commit changes to participants
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.name


from django.contrib.auth.models import User
from django.db import models


class Message(models.Model):
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
    )

    chat_room = models.ForeignKey('ChatRoom', on_delete=models.CASCADE, related_name='messages', null=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    content = models.TextField(blank=True, null=True)
    file_url = models.URLField(blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=5, choices=MESSAGE_TYPES, default='text')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username
