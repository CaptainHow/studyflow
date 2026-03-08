from django.contrib import admin

from studyflow.models import Course, Task, User

# Register your models here.

admin.site.register(User)
admin.site.register(Course)
admin.site.register(Task)
