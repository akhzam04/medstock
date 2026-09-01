import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { medicinesAPI } from '../services/api';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'unit', headerName: 'Unit', width: 100 },
    { field: 'price', headerName: 'Price', width: 100, type: 'number' },
];

const Medicines: React.FC = () => {
    const { data: medicines, isLoading } = useQuery({
        queryKey: ['medicines'],
        queryFn: () => medicinesAPI.getAll(),
    });

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Medicines
            </Typography>
            <DataGrid
                rows={medicines || []}
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

export default Medicines;
