from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet,
    PrescriptionViewSet,
    PrescriptionItemViewSet
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'prescription-items', PrescriptionItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 