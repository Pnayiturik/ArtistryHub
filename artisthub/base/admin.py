from django.contrib import admin
from .models import User, Gallery, Artwork, Comment, Like, Event
# Register your models here.
admin.site.register(User)
admin.site.register(Gallery)
admin.site.register(Artwork)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Event)
