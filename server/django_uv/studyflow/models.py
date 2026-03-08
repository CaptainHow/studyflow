from django.db import models
from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(TimeStampedModel):
    email_id = models.EmailField(unique=True)
    first_name = models.CharField(max_length=128)
    middle_name = models.CharField(max_length=128, blank=True, null=True)
    last_name = models.CharField(max_length=128)
    password = models.CharField(max_length=128)
    birth_date = models.DateField()

    def __str__(self):
        return str(self.email_id)

    class Meta:
        indexes = [
            models.Index(fields=["email_id"])
        ]

    def save(self, *args, **kwargs):
        # hash password before saving
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)


class Course(TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    course_name = models.CharField(max_length=128)
    course_code = models.CharField(max_length=128, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"])
        ]

    def __str__(self):
        return str(self.course_name)


class Task(TimeStampedModel):

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    class Status(models.TextChoices):
        TODO = "TODO", "Todo"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        DONE = "DONE", "Done"

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    task_name = models.CharField(max_length=128)
    description = models.TextField()

    due_date = models.DateField(blank=True, null=True)

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO
    )

    class Meta:
        indexes = [
            models.Index(fields=["course"])
        ]

    def __str__(self):
        return str(self.task_name)
