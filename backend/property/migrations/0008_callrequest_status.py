# Generated by Django 5.1 on 2024-10-22 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0007_docusigntemplate_contract'),
    ]

    operations = [
        migrations.AddField(
            model_name='callrequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('success', 'Success'), ('failed', 'Failed')], default='pending', max_length=10),
        ),
    ]
