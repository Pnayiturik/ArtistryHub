from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

class User(AbstractUser):
    is_artist = models.BooleanField(default=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    website = models.URLField(max_length=200, blank=True)
    social_media = models.JSONField(default=dict, blank=True)

class Gallery(models.Model):
    GALLERY_TYPES = [
        ('PHOTO', 'Photography'),
        ('DIGITAL', 'Digital Art'),
        ('PAINTING', 'Painting'),
        ('SCULPTURE', 'Sculpture'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=GALLERY_TYPES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Galleries"

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"

class Artwork(models.Model):
    STATUS_CHOICES = [
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='artworks')
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='artworks')
    image = models.ImageField(upload_to='artworks/')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-progress')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True)
    views = models.PositiveIntegerField(default=0)
    ratings = models.ManyToManyField(
        User,
        through='ArtworkRating',
        related_name='rated_artworks'
    )
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.artist.username}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artwork')

    def __str__(self):
        return f"{self.user.username} likes {self.artwork.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.artwork.title}"

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True)
    max_participants = models.PositiveIntegerField(default=0)
    categories = models.JSONField(default=list)
    requirements = models.TextField(blank=True)
    participants = models.ManyToManyField(
        User, 
        related_name='joined_events',
        blank=True
    )
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def status(self):
        from django.utils import timezone
        now = timezone.now()
        
        if self.start_date > now:
            return 'Upcoming'
        elif self.start_date <= now and self.end_date >= now:
            return 'In Progress'
        else:
            return 'Completed'

class ArtworkRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    value = models.PositiveSmallIntegerField(
        choices=[(i, i) for i in range(1, 6)],  # 1-5 rating
        default=5
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artwork')
