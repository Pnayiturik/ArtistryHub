# Generated by Django 5.0.1 on 2024-11-25 16:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_event_participants'),
    ]

    operations = [
        migrations.AddField(
            model_name='artwork',
            name='views',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.CreateModel(
            name='ArtworkRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], default=5)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('artwork', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.artwork')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'artwork')},
            },
        ),
        migrations.AddField(
            model_name='artwork',
            name='ratings',
            field=models.ManyToManyField(related_name='rated_artworks', through='base.ArtworkRating', to=settings.AUTH_USER_MODEL),
        ),
    ]
