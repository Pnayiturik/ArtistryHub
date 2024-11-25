from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User, Gallery, Artwork, Like, Comment, Event
from .serializers import (
    UserSerializer, GallerySerializer, ArtworkSerializer,
    CommentSerializer, LikeSerializer, EventSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.urls import re_path
from urllib.parse import unquote
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta

class RegisterView(generics.CreateAPIView):
    """Register a new user"""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        # Hash the password before saving
        password = serializer.validated_data.get('password')
        serializer.validated_data['password'] = make_password(password)
        return super().perform_create(serializer)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_value_regex = '[^/]+'  # Allow any character except forward slash

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def artists(self, request):
        """Get all artists"""
        artists = User.objects.filter(is_artist=True)
        serializer = UserSerializer(artists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def artworks(self, request, username=None):
        """Get all artworks for a specific artist"""
        user = self.get_object()  # This will use the decoded username
        artworks = Artwork.objects.filter(artist=user)
        serializer = ArtworkSerializer(artworks, many=True)
        return Response(serializer.data)

    def get_object(self):
        """
        Returns the object the view is displaying.
        Handles URL-encoded usernames.
        """
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        encoded_username = self.kwargs[lookup_url_kwarg]
        username = unquote(encoded_username)  # Decode the username
        
        try:
            obj = queryset.get(username=username)
            self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            raise Http404(f"No user found with username {username}")

class GalleryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for galleries
    """
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Create a new gallery with proper slug handling"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Handle potential slug conflicts
        base_name = request.data.get('name')
        slug = slugify(base_name)
        counter = 1
        while Gallery.objects.filter(slug=slug).exists():
            slug = f"{slugify(base_name)}-{counter}"
            counter += 1
        
        serializer.validated_data['slug'] = slug
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True)
    def artworks(self, request, slug=None):
        """List artworks in a gallery"""
        gallery = self.get_object()
        artworks = gallery.artworks.all()
        serializer = ArtworkSerializer(artworks, many=True)
        return Response(serializer.data)

class ArtworkViewSet(viewsets.ModelViewSet):
    """
    API endpoint for artworks
    """
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Create a new artwork with proper slug handling"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Handle potential slug conflicts
        base_title = request.data.get('title')
        slug = slugify(base_title)
        counter = 1
        while Artwork.objects.filter(slug=slug).exists():
            slug = f"{slugify(base_title)}-{counter}"
            counter += 1
        
        serializer.validated_data['slug'] = slug
        serializer.save(artist=request.user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        """Filter artworks based on query parameters"""
        queryset = super().get_queryset()
        
        # Get the 'filter' parameter from the URL
        filter_param = self.request.query_params.get('filter', None)
        
        if filter_param:
            if filter_param == 'my_artworks':
                # Filter artworks created by the current user
                queryset = queryset.filter(artist=self.request.user)
            elif filter_param == 'liked':
                # Filter artworks liked by the current user
                queryset = queryset.filter(likes__user=self.request.user)
            elif filter_param == 'saved':
                # If you have a save/bookmark feature
                queryset = queryset.filter(saved_by=self.request.user)
        
        return queryset

    @action(detail=True, methods=['post'])
    def like(self, request, slug=None):
        """Like or unlike an artwork"""
        artwork = self.get_object()
        like, created = Like.objects.get_or_create(
            user=request.user,
            artwork=artwork
        )
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})

    @action(detail=True)
    def comments(self, request, slug=None):
        """List comments on an artwork"""
        artwork = self.get_object()
        comments = artwork.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_artworks(self, request):
        artworks = self.queryset.filter(artist=request.user).order_by('-created_at')
        serializer = self.get_serializer(artworks, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter events based on query parameters"""
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        
        if status:
            # Convert status to date filtering logic
            from django.utils import timezone
            now = timezone.now()
            
            if status.lower() == 'upcoming':
                queryset = queryset.filter(start_date__gt=now)
            elif status.lower() == 'in progress':
                queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
            elif status.lower() == 'completed':
                queryset = queryset.filter(end_date__lt=now)
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new event with proper slug handling"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Handle potential slug conflicts
        base_title = request.data.get('title')
        slug = slugify(base_title)
        counter = 1
        while Event.objects.filter(slug=slug).exists():
            slug = f"{slugify(base_title)}-{counter}"
            counter += 1
        
        serializer.validated_data['slug'] = slug
        serializer.save(created_by=request.user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def join(self, request, slug=None):
        """Join or leave an event"""
        event = self.get_object()
        user = request.user
        
        if event.participants.filter(id=user.id).exists():
            # User is already joined, so remove them
            event.participants.remove(user)
            return Response({
                'status': 'left',
                'message': 'Successfully left the event',
                'participants_count': event.participants.count()
            })
        else:
            # Check if event is full
            if event.max_participants and event.participants.count() >= event.max_participants:
                return Response({
                    'status': 'error',
                    'message': 'Event is full'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add user to participants
            event.participants.add(user)
            return Response({
                'status': 'joined',
                'message': 'Successfully joined the event',
                'participants_count': event.participants.count()
            })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    stats = {
        'totalArtworks': Artwork.objects.filter(artist=user).count(),
        'eventsJoined': Event.objects.filter(participants=user).count(),
        'totalViews': 0,  # You'll need to add a views field to your Artwork model
        'averageRating': 0  # You'll need to add a rating system
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_activities(request):
    """Get recent activities for the current user"""
    user = request.user
    activities = []
    
    # Get recent artworks
    recent_artworks = Artwork.objects.filter(artist=user).order_by('-created_at')[:5]
    for artwork in recent_artworks:
        activities.append({
            'type': 'upload',
            'message': f'Uploaded artwork "{artwork.title}"',
            'created_at': artwork.created_at.isoformat()
        })
    
    # Get recent event participations
    recent_events = Event.objects.filter(participants=user).order_by('-created_at')[:5]
    for event in recent_events:
        activities.append({
            'type': 'event',
            'message': f'Joined event "{event.title}"',
            'created_at': event.created_at.isoformat()
        })
    
    # Sort activities by created_at
    activities.sort(key=lambda x: x['created_at'], reverse=True)
    return Response(activities[:10])

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_analytics(request):
    """Get analytics data for the current user"""
    user = request.user
    now = timezone.now()
    
    # Get last 6 months of data
    analytics_data = []
    for i in range(6):
        month_start = now - timedelta(days=30 * i)
        month_data = {
            'name': month_start.strftime('%B'),
            'artworks': Artwork.objects.filter(
                artist=user,
                created_at__year=month_start.year,
                created_at__month=month_start.month
            ).count(),
            'events': Event.objects.filter(
                participants=user,
                created_at__year=month_start.year,
                created_at__month=month_start.month
            ).count()
        }
        analytics_data.append(month_data)
    
    return Response(analytics_data)
