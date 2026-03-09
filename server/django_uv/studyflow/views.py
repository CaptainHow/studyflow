from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import ValidationError

from .models import Course, Task, User
from .serializers import CourseSerializer, TaskSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RetrieveUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# Course Views
class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.pk
        courses = Course.objects.filter(user=user)
        return courses

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)


class CourseUpdateView(generics.UpdateAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.pk
        courses = Course.objects.filter(user=user)
        return courses

class CourseDeleteView(generics.DestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        courses = Course.objects.filter(user=user)
        print(courses)
        return courses

# Task Views

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.pk
        tasks = Task.objects.filter(course__user=user)
        return tasks

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if course.user != self.request.user:
            raise ValidationError({"course": "Cannot create a task for another user's course"})
        serializer.save()


class TaskUpdateView(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.pk
        tasks = Task.objects.filter(course__user=user)
        return tasks

    def perform_update(self, serializer):
        # Prevent assigning task to another user's course
        print("here?")
        course = serializer.validated_data.get("course", serializer.instance.course)
        if course.user != self.request.user:
            raise ValidationError({"course": "Cannot assign task to another user's course"})
        serializer.save()

class TaskDeleteView(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tasks = Task.objects.filter(course__user=user)
        return tasks

