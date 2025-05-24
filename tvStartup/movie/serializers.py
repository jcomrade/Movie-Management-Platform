from rest_framework import serializers
from .models import MovieItem, User

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] 

class MovieItemSerialzer(serializers.ModelSerializer):
    hls_url = serializers.SerializerMethodField()
    user = UserListSerializer(read_only=True)
    class Meta:
        model = MovieItem
        fields = '__all__'
        read_only_fields = ['user', 'status', 'thumbnail', 'hls_playlist', 'video_file', 'duration', 'created_at']
    
    def get_hls_url(self, obj):
        request = self.context.get('request')
        if obj.hls_playlist and request:
            return request.build_absolute_uri(obj.hls_playlist.url)
        return None

class PlayMovieSerializer(serializers.ModelSerializer):
    hls_url = serializers.SerializerMethodField()

    class Meta:
        model = MovieItem
        fields = '__all__'  # includes all original fields + hls_url

    def get_hls_url(self, obj):
        request = self.context.get('request')
        if obj.hls_playlist and request:
            return request.build_absolute_uri(obj.hls_playlist.url)
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
    
