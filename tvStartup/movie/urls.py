from django.urls import path
from . import views

urlpatterns = [
   path('movie/secure-video/<int:pk>/', views.SecureHLSView.as_view()),
   path('movie/', views.MovieListView.as_view()),
   path('movie/<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),
   path('register', views.RegisterUserView.as_view()),
   path('api/logout/', views.LogoutView.as_view(), name='logout'),
   path('api/me/', views.MeView.as_view(), name='me'),
   path('userList', views.UserListView.as_view()),
]
