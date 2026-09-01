import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { medicinesAPI, patientsAPI, prescriptionsAPI, inventoryAPI } from '../services/api';

const Dashboard: React.FC = () => {
    const { data: medicines, isLoading: medicinesLoading } = useQuery({
        queryKey: ['medicines'],
        queryFn: () => medicinesAPI.getAll(),
    });

    const { data: patients, isLoading: patientsLoading } = useQuery({
        queryKey: ['patients'],
        queryFn: () => patientsAPI.getAll(),
    });

    const { data: prescriptions, isLoading: prescriptionsLoading } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => prescriptionsAPI.getAll(),
    });

    const { data: inventory, isLoading: inventoryLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: () => inventoryAPI.getAll(),
    });

    if (medicinesLoading || patientsLoading || prescriptionsLoading || inventoryLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Medicines</Typography>
                        <Typography variant="h4">{medicines?.length || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Patients</Typography>
                        <Typography variant="h4">{patients?.length || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Prescriptions</Typography>
                        <Typography variant="h4">{prescriptions?.length || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Inventory Items</Typography>
                        <Typography variant="h4">{inventory?.length || 0}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
