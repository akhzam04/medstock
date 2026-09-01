from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from inventory.models import Category, Supplier, Medicine
from prescriptions.models import Patient

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates initial data for the application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating initial data...')

        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@medstock.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))

        # Create test users
        test_users = [
            {
                'username': 'doctor1',
                'email': 'doctor1@medstock.com',
                'password': 'doctor123',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'doctor'
            },
            {
                'username': 'pharmacist1',
                'email': 'pharmacist1@medstock.com',
                'password': 'pharmacist123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'pharmacist'
            }
        ]

        for user_data in test_users:
            if not User.objects.filter(username=user_data['username']).exists():
                User.objects.create_user(**user_data)
                self.stdout.write(self.style.SUCCESS(f"User '{user_data['username']}' created successfully"))

        # Create test categories
        categories = [
            {'name': 'Antibiotics', 'description': 'Medicines that fight bacterial infections'},
            {'name': 'Painkillers', 'description': 'Medicines that relieve pain'},
            {'name': 'Vitamins', 'description': 'Nutritional supplements'},
        ]

        for category_data in categories:
            Category.objects.get_or_create(**category_data)
            self.stdout.write(self.style.SUCCESS(f"Category '{category_data['name']}' created successfully"))

        # Create test suppliers
        suppliers = [
            {
                'name': 'MedSupply Co',
                'contact_person': 'Robert Johnson',
                'email': 'robert@medsupply.com',
                'phone': '123-456-7890',
                'address': '123 Medical St, Health City'
            },
            {
                'name': 'PharmaCare Ltd',
                'contact_person': 'Sarah Williams',
                'email': 'sarah@pharmacare.com',
                'phone': '098-765-4321',
                'address': '456 Pharma Ave, Medicine Town'
            }
        ]

        for supplier_data in suppliers:
            Supplier.objects.get_or_create(**supplier_data)
            self.stdout.write(self.style.SUCCESS(f"Supplier '{supplier_data['name']}' created successfully"))

        # Create test medicines
        medicines = [
            {
                'brand_name': 'Amoxil',
                'generic_name': 'Amoxicillin',
                'category': Category.objects.get(name='Antibiotics'),
                'unit': 'tablets',
                'price': '10.99',
                'stock_quantity': 100,
                'reorder_level': 20,
                'supplier': Supplier.objects.get(name='MedSupply Co'),
                'expiry_date': '2025-12-31',
                'batch_number': 'AMX123'
            },
            {
                'brand_name': 'Panadol',
                'generic_name': 'Paracetamol',
                'category': Category.objects.get(name='Painkillers'),
                'unit': 'tablets',
                'price': '5.99',
                'stock_quantity': 200,
                'reorder_level': 50,
                'supplier': Supplier.objects.get(name='PharmaCare Ltd'),
                'expiry_date': '2025-12-31',
                'batch_number': 'PND456'
            }
        ]

        for medicine_data in medicines:
            Medicine.objects.get_or_create(**medicine_data)
            self.stdout.write(self.style.SUCCESS(f"Medicine '{medicine_data['brand_name']}' created successfully"))

        # Create test patients
        patients = [
            {
                'name': 'Michael Brown',
                'date_of_birth': '1980-05-15',
                'phone': '111-222-3333',
                'email': 'michael@example.com',
                'address': '789 Patient St, Health City'
            },
            {
                'name': 'Emily Wilson',
                'date_of_birth': '1995-08-22',
                'phone': '444-555-6666',
                'email': 'emily@example.com',
                'address': '321 Patient Ave, Medicine Town'
            }
        ]

        for patient_data in patients:
            Patient.objects.get_or_create(**patient_data)
            self.stdout.write(self.style.SUCCESS(f"Patient '{patient_data['name']}' created successfully"))

        self.stdout.write(self.style.SUCCESS('Initial data created successfully')) 