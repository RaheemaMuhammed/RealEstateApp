# Generated by Django 5.1 on 2024-10-20 08:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0002_alter_property_address'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CallRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, null=True)),
                ('phone_number', models.CharField(max_length=15)),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('lister', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_call_requests', to='property.profile')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='call_requests', to='property.property')),
                ('requested_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='call_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=255)),
                ('notification_type', models.CharField(choices=[('call_request', 'Call Request'), ('contract_uploaded', 'Contract Uploaded'), ('contract_approved', 'Contract Approved'), ('contract_rejected', 'Contract Rejected'), ('contract_signing', 'Contract Signing Required')], max_length=50)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('call_request', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='property.callrequest')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
