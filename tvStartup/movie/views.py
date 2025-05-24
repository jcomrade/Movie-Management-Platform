from rest_framework import generics
from .tasks import process_video_task
from .models import MovieItem, User
from rest_framework.views import APIView
from .serializers import MovieItemSerialzer, RegisterUserSerializer, UserListSerializer, PlayMovieSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsOwnerOrReadOnly

# Create your views here.
class SecureHLSView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            movie = MovieItem.objects.get(pk=pk)
            serializer = PlayMovieSerializer(movie, context={'request': request})
            return Response(serializer.data)
        except MovieItem.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=205)
        except Exception as e:
            return Response(status=400)

class MovieListView(generics.ListCreateAPIView):
    queryset = MovieItem.objects.all()
    serializer_class = MovieItemSerialzer

    def perform_create(self, serializer):
        video = serializer.save(user=self.request.user)
        process_video_task.delay(video.id)
        
class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovieItem.objects.all()
    serializer_class = MovieItemSerialzer
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_update(self, serializer):
        video = serializer.save()
        video.status = 'pending'
        video.save()
        process_video_task.delay(video.id)

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = []

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    authentication_classes = []   # disable auth classes
    permission_classes = [AllowAny] 
    

