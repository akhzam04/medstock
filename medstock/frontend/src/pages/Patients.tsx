import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { patientsAPI } from '../services/api';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 100, type: 'number' },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Address', width: 300 },
];

const Patients: React.FC = () => {
    const { data: patients, isLoading } = useQuery({
        queryKey: ['patients'],
        queryFn: () => patientsAPI.getAll(),
    });

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Patients
            </Typography>
            <DataGrid
                rows={patients || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                loading={isLoading}
            />
        </Box>
    );
};

export default Patients;
