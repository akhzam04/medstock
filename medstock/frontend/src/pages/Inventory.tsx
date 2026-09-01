import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { inventoryAPI } from '../services/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'medicine_name', headerName: 'Medicine Name', width: 200 },
  { field: 'batch_number', headerName: 'Batch Number', width: 150 },
  { field: 'expiry_date', headerName: 'Expiry Date', width: 150 },
  { field: 'quantity', headerName: 'Quantity', width: 100, type: 'number' },
  { field: 'unit', headerName: 'Unit', width: 100 },
  { field: 'purchase_price', headerName: 'Purchase Price', width: 150, type: 'number' },
  { field: 'selling_price', headerName: 'Selling Price', width: 150, type: 'number' },
];

const Inventory: React.FC = () => {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryAPI.getAll(),
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <DataGrid
        rows={inventory || []}
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

export default Inventory;
