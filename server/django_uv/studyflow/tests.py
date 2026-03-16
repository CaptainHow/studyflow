from django.test import TestCase
from django.urls import reverse
from studyflow.models import Course, Task, User
from rest_framework.test import APIClient, APITestCase


# Create your tests here.

# User Test
class UserTests(APITestCase):

    def test_create_user(self):
        url = reverse("register")

        data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
            "first_name": "John",
            "middle_name": "",
            "last_name": "Doe",
            "birth_date": "2026-01-01",
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)

# User Auth Test
class AuthTests(APITestCase):

    def setUp(self) -> None:
        data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
            "first_name": "John",
            "middle_name": "",
            "last_name": "Doe",
            "birth_date": "2026-01-01",
        }
        self.user = User.objects.create_user(**data)

    def test_login_success(self):
        url = reverse("get_token")

        login_data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
        }

        response = self.client.post(url, login_data)

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

    def test_invalid_credentials(self):
        url = reverse("get_token")

        login_data = {
            "email_id": "johndoe@test.com",
            "password": "Incorrect@123",
        }

        response = self.client.post(url, login_data)

        self.assertEqual(response.status_code, 401)

    def test_refresh_token(self):

        login_url = reverse("get_token")
        refresh_url = reverse("refresh")

        login_data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
        }

        login_response = self.client.post(login_url, login_data)

        refresh_token = login_response.json()["refresh"]

        refresh_response = self.client.post(
            refresh_url,
            {"refresh": refresh_token}
        )

        self.assertEqual(refresh_response.status_code, 200)
        self.assertIn("access", refresh_response.json())

    def test_invalid_refresh_token(self):

        url = reverse("refresh")

        response = self.client.post(
            url,
            {"refresh": "invalidtoken"}
        )

        self.assertEqual(response.status_code, 401)

    def test_access_token_authentication(self):

        login_url = reverse("get_token")

        login_data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
        }

        login_response = self.client.post(login_url, login_data)

        access_token = login_response.json()["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        url = reverse("course_list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)


class BaseTestCase(APITestCase):
    def setUp(self) -> None:
        self.client = APIClient()

        data = {
            "email_id": "johndoe@test.com",
            "password": "Password@123",
            "first_name": "John",
            "middle_name": "",
            "last_name": "Doe",
            "birth_date": "2026-01-01",
        }

        self.user = User.objects.create_user(
            **data
        )

        self.client.force_authenticate(user=self.user)

class CourseTests(BaseTestCase):
    def test_create_course(self):
        url = reverse("course_list")

        data = {
            "course_name": "Internet Technology",
            "course_code": "COMPSCI5012"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Course.objects.count(), 1)

    def test_list_courses(self):
        Course.objects.create(
            user=self.user,
            course_name="Databases"
        )

        url = reverse("course_list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

class TaskTests(BaseTestCase):

    def setUp(self):
        super().setUp()

        self.course = Course.objects.create(
            user=self.user,
            course_name="Internet Technology"
        )

    def test_create_task(self):
        url = reverse("task_list")

        data = {
            "course": self.course.pk,
            "task_name": "Task 1",
            "description": "Task 1 Description",
            "priority": "HIGH"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Task.objects.count(), 1)

    def test_user_cannot_create_task_for_other_users_course(self):

        from studyflow.models import User

        other_user = User.objects.create_user(
            email_id="otheruser@test.com",
            password="Pass@123"
        )

        other_course = Course.objects.create(
            user_id=other_user.pk,
            course_name="Private Course"
        )

        url = reverse("task_list")

        data = {
            "course": other_course.pk,
            "task_name": "Illegal task",
            "description": "Not allowed",
            "priority": "HIGH",
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json().get("course"), "Cannot create a task for another user's course")

    def test_update_task(self):
        task = Task.objects.create(
            course=self.course,
            task_name="Legal Task",
            description="test"
        )

        url = reverse("task_update", args=[task.pk])

        data = {
            "task_name": "Updated Task",
            "description": "Updated"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, 200)
