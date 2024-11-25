from rest_framework import serializers
from .models import User, Gallery, Artwork, Like, Comment, Event
import json

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 
                 'last_name', 'is_artist', 'name')
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'first_name': {'read_only': True},
            'last_name': {'read_only': True}
        }

    def create(self, validated_data):
        # Handle the name field if it exists
        name = validated_data.pop('name', '')
        if name:
            # Split name into first_name and last_name
            name_parts = name.split(' ', 1)
            validated_data['first_name'] = name_parts[0]
            validated_data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''

        # Create user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_artist=validated_data.get('is_artist', True)
        )
        return user

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['id', 'name', 'type', 'description', 'created_at', 'slug']
        read_only_fields = ['slug']

class ArtworkSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    gallery_name = serializers.CharField(source='gallery.name', read_only=True)
    gallery_type = serializers.CharField(source='gallery.get_type_display', read_only=True)
    comments = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data

    class Meta:
        model = Artwork
        fields = [
            'id', 'title', 'artist', 'artist_name', 'gallery', 'gallery_name',
            'gallery_type', 'image', 'description', 'status', 'created_at',
            'updated_at', 'slug', 'likes_count', 'is_liked', 'comments'
        ]
        read_only_fields = ['slug', 'artist']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'artwork', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'artwork', 'created_at']
        read_only_fields = ['user']

class EventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    status = serializers.CharField(read_only=True)
    participants_count = serializers.SerializerMethodField()
    is_joined = serializers.SerializerMethodField()
    participants = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'start_date', 
            'end_date', 'image', 'created_by', 'created_by_name', 
            'created_at', 'updated_at', 'slug', 'max_participants',
            'categories', 'requirements', 'status', 'participants_count',
            'is_joined', 'participants'
        ]
        read_only_fields = ['slug', 'created_by', 'status']

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(id=request.user.id).exists()
        return False

    def validate_categories(self, value):
        """
        Ensure categories is a valid JSON array
        """
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON format for categories")
        return value