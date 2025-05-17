import uuid
import random
import string
from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Patient

User = get_user_model()


# === Doctor Registration Serializer ===
class UserRegistrationSerializer(serializers.ModelSerializer):
    re_enter_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
        'first_name', 'last_name', 'email', 'password',
        're_enter_password', 'user_type', 'slmc_id'
        ]

        extra_kwargs = {
            'password': {'write_only': True},
            'slmc_id': {'required': True}
        }

    def validate(self, data):
        if data.get('password') != data.get('re_enter_password'):
            raise serializers.ValidationError("Passwords do not match.")
        if data.get('user_type') != User.DOCTOR:
            raise serializers.ValidationError("Only doctors can register through this form.")
        return data

    def create(self, validated_data):
        validated_data.pop('re_enter_password')
        password = validated_data.pop('password')

        # Generate a unique username for doctors too
        validated_data['username'] = f"doc_{uuid.uuid4().hex[:6]}"

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user



# === Patient Registration ===

def generate_username():
    return f"pat_{uuid.uuid4().hex[:6]}"


def generate_password():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))


class PatientSerializer(serializers.ModelSerializer):
    # Keep all existing fields
    email = serializers.EmailField(write_only=True, required=False)  # Make optional for updates
    first_name = serializers.CharField(write_only=True, required=False)  # Make optional for updates
    last_name = serializers.CharField(write_only=True, required=False)  # Make optional for updates
    generated_username = serializers.CharField(read_only=True)
    generated_password = serializers.CharField(read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'age', 'gender', 'address', 'emergency_contact',
            'medical_history', 'generated_username', 'generated_password'
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def create(self, validated_data):
        # Your existing create logic remains exactly the same
        doctor = self.context['request'].user
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')

        username = generate_username()
        password = generate_password()

        # Create user
        patient_user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            slmc_id=username,  # Using same generated ID for both fields
            user_type=User.PATIENT,
            password=password
        )

        # Create patient profile
        patient = Patient.objects.create(
            user=patient_user,
            doctor=doctor,
            **validated_data
        )

        # Pass username and password to frontend
        patient._generated_username = username
        patient._generated_password = password
        return patient

    def update(self, instance, validated_data):
        # Handle patient profile updates
        instance.age = validated_data.get('age', instance.age)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.address = validated_data.get('address', instance.address)
        instance.emergency_contact = validated_data.get('emergency_contact', instance.emergency_contact)
        instance.medical_history = validated_data.get('medical_history', instance.medical_history)
        instance.save()

        # Handle user updates if any user-related fields are provided
        user = instance.user
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            user.last_name = validated_data['last_name']
        if 'email' in validated_data:
            user.email = validated_data['email']
        user.save()

        return instance

    def to_representation(self, instance):
        # Your existing representation logic remains
        rep = super().to_representation(instance)
        rep['generated_username'] = getattr(instance, '_generated_username', '')
        rep['generated_password'] = getattr(instance, '_generated_password', '')
        return rep