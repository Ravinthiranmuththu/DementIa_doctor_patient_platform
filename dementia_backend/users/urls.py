from django.urls import path
from .views import (
    RegisterView,
    DoctorLoginView,
    PatientLoginView,
    LogoutView,
    PatientViewSet,
    PatientProfileView,
    MyPatientProfileView,
<<<<<<< HEAD
    RecordingUploadView,  # Add this import
    PatientRecordingsView,  # Add this import
    MyRecordingsView,  # Add this import
    SendPatientCredentialsView,
=======
    RecordingViewSet,
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
)

from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'recordings', RecordingViewSet, basename='recordings')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('doctor-login/', DoctorLoginView.as_view(), name='doctor-login'),
    path('patient-login/', PatientLoginView.as_view(), name='patient-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

urlpatterns += router.urls
urlpatterns += [
    path('patient-profile/<str:username>/', PatientProfileView.as_view(), name='patient-profile'),
    path('patient/me/', MyPatientProfileView.as_view(), name='my-patient-profile'),
<<<<<<< HEAD
    path('recordings/upload/', RecordingUploadView.as_view(), name='recording-upload'),
    path('doctor/patient-recordings/<str:patient_username>/', PatientRecordingsView.as_view(), name='patient-recordings'),
    path('patient/my-recordings/', MyRecordingsView.as_view(), name='my-recordings'),
    #path('patients/<int:patient_id>/send-credentials/', SendPatientCredentialsView.as_view(), name='send-patient-credentials'),
    path('patients/<str:username>/send-credentials/', SendPatientCredentialsView.as_view(), name='send-patient-credentials'),
]
=======
]


>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
