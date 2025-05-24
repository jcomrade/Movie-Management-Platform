from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    pass

# Create your models here.
class MovieItem(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    date_added = models.DateField()
    original_file = models.FileField(upload_to='videos/original/')
    hls_playlist = models.FileField(upload_to='videos/hls/', null=True, blank=True)
    video_file = models.FileField(upload_to='videos/')  
    status = models.CharField(max_length=20, default='pending')
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    duration = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
