from rest_framework.serializers import ModelSerializer
from .models import *


class RegisterSerializer(ModelSerializer):
    class Meta:
            model = CustomUser
            fields = '__all__'

    def create(self, validated_data):
        user= CustomUser.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])  
        user.save()
        return user
    

