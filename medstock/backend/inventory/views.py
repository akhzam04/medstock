from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Supplier, Medicine, StockMovement
from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    MedicineSerializer,
    StockMovementSerializer
)

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        return queryset

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(contact_person__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        supplier = self.request.query_params.get('supplier')
        
        if search:
            queryset = queryset.filter(
                Q(brand_name__icontains=search) |
                Q(generic_name__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        if supplier:
            queryset = queryset.filter(supplier_id=supplier)
            
        return queryset

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        medicine = self.get_object()
        movement_type = request.data.get('movement_type')
        quantity = request.data.get('quantity')
        notes = request.data.get('notes', '')

        if not movement_type or not quantity:
            return Response(
                {'error': 'Movement type and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except ValueError:
            return Response(
                {'error': 'Quantity must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if movement_type == 'stock_out' and medicine.stock_quantity < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create stock movement
        StockMovement.objects.create(
            medicine=medicine,
            movement_type=movement_type,
            quantity=quantity,
            notes=notes,
            user=request.user
        )

        # Update stock quantity
        if movement_type == 'stock_in':
            medicine.stock_quantity += quantity
        elif movement_type == 'stock_out':
            medicine.stock_quantity -= quantity
        medicine.save()

        return Response(MedicineSerializer(medicine).data)

class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        medicine = self.request.query_params.get('medicine')
        movement_type = self.request.query_params.get('movement_type')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if medicine:
            queryset = queryset.filter(medicine_id=medicine)
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        return queryset
