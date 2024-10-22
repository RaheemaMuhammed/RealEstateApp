from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate,login
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class Register(APIView):
    def post(self,request):
        serializer = RegisterSerializer(data=request.data, many=False)

        if serializer.is_valid():
            user = serializer.save()
            
            return Response({"userId": user.id, 
                             "Message": "User created ."}, 
                             status=status.HTTP_201_CREATED
                             )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

class Login(APIView):
    def post(self,request):
        
        data=request.data
       
        email=data.get('email')
        password=data.get('password')

        if not email:
            return Response({'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'message': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user=authenticate(email=email,password=password)
        if user is not None:
            
                
                login(request,user)
                token=RefreshToken.for_user(user)

                if user.is_superuser:
                    user_type = 'admin'
                elif user.is_staff:
                    user_type = 'staff'
                else:
                    try:
                        profile = user.profile  
                        user_type = profile.user_type  
                    except AttributeError:
                        user_type = 'regular'
                return Response({'message':'you are successfully logged in',
                                
                                'refresh':str(token),
                                'access':str(token.access_token),
                                'user_type': user_type,
                                'pk':user.pk,
                                'email':user.email

                },status=status.HTTP_200_OK)
            
                
        else:
            return Response({
                
                'message':'invalid email or password'
            },status=status.HTTP_400_BAD_REQUEST)