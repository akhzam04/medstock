from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Patient, Prescription, PrescriptionItem
from .serializers import (
    PatientSerializer,
    PrescriptionSerializer,
    PrescriptionItemSerializer
)
from .permissions import IsDoctor
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(phone__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctor]

    def get_queryset(self):
        queryset = super().get_queryset()
        patient = self.request.query_params.get('patient')
        professional = self.request.query_params.get('professional')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if patient:
            queryset = queryset.filter(patient_id=patient)
        if professional:
            queryset = queryset.filter(prescribing_professional_id=professional)
        if start_date:
            queryset = queryset.filter(prescription_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(prescription_date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        # Ensure the prescribing professional is a registered user
        prescribing_professional = self.request.user
        if not User.objects.filter(id=prescribing_professional.id).exists():
            raise serializers.ValidationError("Prescribing professional must be a registered user")
            
        serializer.save(prescribing_professional=prescribing_professional)

class PrescriptionItemViewSet(viewsets.ModelViewSet):
    queryset = PrescriptionItem.objects.all()
    serializer_class = PrescriptionItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        prescription = self.request.query_params.get('prescription')
        medicine = self.request.query_params.get('medicine')

        if prescription:
            queryset = queryset.filter(prescription_id=prescription)
        if medicine:
            queryset = queryset.filter(medicine_id=medicine)

        return queryset

    @action(detail=True, methods=['post'])
    def dispense(self, request, pk=None):
        item = self.get_object()
        quantity = request.data.get('quantity')

        if not quantity:
            return Response(
                {'error': 'Quantity is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except ValueError:
            return Response(
                {'error': 'Quantity must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity > item.quantity:
            return Response(
                {'error': 'Cannot dispense more than prescribed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update prescription item
        item.quantity -= quantity
        item.save()

        # Create stock movement
        from inventory.models import StockMovement
        StockMovement.objects.create(
            medicine=item.medicine,
            movement_type='stock_out',
            quantity=quantity,
            notes=f'Dispensed for prescription #{item.prescription.id}',
            user=request.user
        )

        return Response(PrescriptionItemSerializer(item).data)
