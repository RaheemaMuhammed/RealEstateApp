# Generated by Django 5.1 on 2024-10-24 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0011_remove_contract_is_signed_by_buyer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contract',
            name='docu_sign_url',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
