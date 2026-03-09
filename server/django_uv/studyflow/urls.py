from django.urls import path
from . import views

urlpatterns = [

    # Courses
    path("courses/", views.CourseListCreateView.as_view(), name="course_list"),
    path("courses/<int:pk>/", views.CourseUpdateView.as_view(), name="course_update"),
    path("courses/delete/<int:pk>/", views.CourseDeleteView.as_view(), name="delete_course"),

    # Tasks
    path("tasks/", views.TaskListCreateView.as_view(), name="task_list"),
    path("tasks/<int:pk>/", views.TaskUpdateView.as_view(), name="task_update"),
    path("tasks/delete/<int:pk>/", views.TaskDeleteView.as_view(), name="delete_task"),
]
