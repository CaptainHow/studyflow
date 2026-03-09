from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from studyflow.models import Course, Task, User


# should i expose every field in the api response or exclude the created at and modified at fields?
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email_id", "first_name", "middle_name", "last_name", "birth_date", "password", "modified_at", "created_at"]
        extra_kwargs = {
            "password": {"write_only": True}
        }
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__' 
        read_only_fields = ["user"]


class TaskSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        error_messages={"does_not_exist": "The specified course does not exist."}
    )
    class Meta:
        model = Task
        fields = '__all__' 
    
    def validate_course(self, value):
        print(value, "adadada")
        return value
