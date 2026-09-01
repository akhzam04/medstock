import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    SelectChangeEvent,
} from '@mui/material';
import { prescriptionsAPI, patientsAPI, medicinesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'patient_name', headerName: 'Patient Name', width: 200 },
    { field: 'professional_name', headerName: 'Doctor Name', width: 200 },
    { field: 'prescription_date', headerName: 'Date', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 300 },
];

const Prescriptions: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        patient: '',
        prescription_date: '',
        notes: '',
    });

    const { data: prescriptions, isLoading } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => prescriptionsAPI.getAll(),
    });

    const { data: patients } = useQuery({
        queryKey: ['patients'],
        queryFn: () => patientsAPI.getAll(),
    });

    const createPrescriptionMutation = useMutation({
        mutationFn: prescriptionsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            handleClose();
        },
        onError: (error: any) => {
            setError(error.response?.data?.error || 'Failed to create prescription');
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError('');
        setFormData({
            patient: '',
            prescription_date: '',
            notes: '',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPrescriptionMutation.mutateAsync(formData);
        } catch (err) {
            console.error('Error creating prescription:', err);
        }
    };

    const isDoctor = user?.role === 'doctor';

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    Prescriptions
                </Typography>
                {isDoctor && (
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Create Prescription
                    </Button>
                )}
            </Box>

            <DataGrid
                rows={prescriptions || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                loading={isLoading}
            />

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Prescription</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Patient</InputLabel>
                            <Select
                                name="patient"
                                value={formData.patient}
                                onChange={handleSelectChange}
                                required
                            >
                                {patients?.map((patient: any) => (
                                    <MenuItem key={patient.id} value={patient.id}>
                                        {patient.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="prescription_date"
                            label="Prescription Date"
                            type="date"
                            value={formData.prescription_date}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="notes"
                            label="Notes"
                            multiline
                            rows={4}
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Prescriptions;
