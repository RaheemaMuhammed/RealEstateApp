# Generated by Django 5.1 on 2024-08-31 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='address',
            field=models.TextField(),
        ),
    ]