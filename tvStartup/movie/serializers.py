from urllib.parse import urljoin
from django.conf import settings
from rest_framework import serializers
from .models import MovieItem, User

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] 

class MovieItemSerialzer(serializers.ModelSerializer):
    hls_url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    user = UserListSerializer(read_only=True)
    class Meta:
        model = MovieItem
        fields = '__all__'
        read_only_fields = ['user', 'status', 'thumbnail', 'hls_playlist', 'video_file', 'duration', 'created_at']
    
    def build_absolute_url(self, url):
        base_url = getattr(settings, "PUBLIC_BACKEND_URL", "http://localhost:8000")
        return urljoin(base_url, url)

    def get_hls_url(self, obj):
        if obj.hls_playlist:
            return self.build_absolute_url(obj.hls_playlist.url)
        return None

    def get_original_file(self, obj):
        if obj.original_file:
            return self.build_absolute_url(obj.original_file.url)
        return None

    def get_hls_playlist(self, obj):
        if obj.hls_playlist:
            return self.build_absolute_url(obj.hls_playlist.url)
        return None

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return self.build_absolute_url(obj.thumbnail.url)
        return None

class PlayMovieSerializer(serializers.ModelSerializer):
    hls_url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    class Meta:
        model = MovieItem
        fields = '__all__'
        read_only_fields = ['user', 'status', 'thumbnail', 'hls_playlist', 'video_file', 'duration', 'created_at']
    
    def build_absolute_url(self, url):
        base_url = getattr(settings, "PUBLIC_BACKEND_URL", "http://localhost:8000")
        return urljoin(base_url, url)

    def get_hls_url(self, obj):
        if obj.hls_playlist:
            return self.build_absolute_url(obj.hls_playlist.url)
        return None

    def get_original_file(self, obj):
        if obj.original_file:
            return self.build_absolute_url(obj.original_file.url)
        return None

    def get_hls_playlist(self, obj):
        if obj.hls_playlist:
            return self.build_absolute_url(obj.hls_playlist.url)
        return None

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return self.build_absolute_url(obj.thumbnail.url)
        return None
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
