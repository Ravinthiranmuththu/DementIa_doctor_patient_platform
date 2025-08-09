from django.urls import path
from .views import (
    RegisterView,
    DoctorLoginView,
    PatientLoginView,
    LogoutView,
    PatientViewSet,
    PatientProfileView,
    MyPatientProfileView,
    RecordingViewSet,
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
]


