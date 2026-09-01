from rest_framework import serializers
from .models import Patient, Prescription, PrescriptionItem
from inventory.serializers import MedicineSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PrescriptionItemSerializer(serializers.ModelSerializer):
    medicine_details = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = PrescriptionItem
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)
    patient_name = serializers.ReadOnlyField(source='patient.name')
    professional_name = serializers.ReadOnlyField(source='prescribing_professional.get_full_name')

    def validate_prescribing_professional(self, value):
        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Prescribing professional must be a registered user")
        return value

    class Meta:
        model = Prescription
        fields = '__all__' 