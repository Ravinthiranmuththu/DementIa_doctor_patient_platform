from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from users.models import CustomUser, Patient
from rest_framework_simplejwt.tokens import RefreshToken

class UserTests(APITestCase):

    def setUp(self):
        self.doctor_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            "password": "securepass123",
            "re_enter_password": "securepass123",
            "user_type": "doctor",
            "slmc_id": "DOC123456"
        }
        self.doctor_register_url = reverse("register")
        self.doctor_login_url = reverse("doctor-login")
        self.patient_list_url = reverse("patients-list")

    def test_doctor_registration(self):
        response = self.client.post(self.doctor_register_url, self.doctor_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access_token", response.data)
        self.assertEqual(response.data["user_type"], "doctor")

    def test_doctor_login(self):
        # Register first
        self.client.post(self.doctor_register_url, self.doctor_data)
        login_data = {
            "slmc_id": self.doctor_data["slmc_id"],
            "password": self.doctor_data["password"]
        }
        response = self.client.post(self.doctor_login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_add_patient(self):
        # Register and login doctor
        self.client.post(self.doctor_register_url, self.doctor_data)
        login_res = self.client.post(self.doctor_login_url, {
            "slmc_id": self.doctor_data["slmc_id"],
            "password": self.doctor_data["password"]
        })
        access_token = login_res.data["access_token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        patient_data = {
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice@example.com",
            "age": 30,
            "gender": "female",
            "address": "123 Street",
            "emergency_contact": "123456789",
            "medical_history": "None"
        }

        response = self.client.post(self.patient_list_url, patient_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("username", response.data)
        self.assertIn("password", response.data)
