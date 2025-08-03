import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Select, MenuItem, Collapse, IconButton, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Admin - Orders
      </Typography>

      <Select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="cancelled">Cancelled</MenuItem>
      </Select>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <React.Fragment key={order.orderId}>
                <TableRow hover onClick={() => {
                setSelectedOrder(order);
                setDialogOpen(true);
                }}
                >
                  <TableCell>
                    <IconButton>
                      {expandedOrder === order.orderId ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.firstName}</TableCell>
                  <TableCell>{order.lastName}</TableCell>
                  <TableCell sx={{height: '100%', padding: 0,}} >
                    <Box
                        sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: 60, // or whatever your row height is
                        }}
                    >
                        <Box
                        sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            color: '#fff',
                            bgcolor:
                            order.status === 'pending' ? 'orange' :
                            order.status === 'completed' ? 'green' :
                            order.status === 'cancelled' ? 'red' : 'grey',
                            borderRadius: '5px',
                            px: 2,
                            py: 0.5,
                            textAlign: 'center',
                            display: 'inline-block',
                        }}
                        >
                        {order.status}
                        </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent dividers>
                {selectedOrder && (
                <>
                    <Typography variant="subtitle2">Order ID: {selectedOrder.orderId}</Typography>
                    <Typography variant="subtitle2">First Name: {selectedOrder.firstName}</Typography>
                    <Typography variant="subtitle2">Last Name: {selectedOrder.lastName}</Typography>
                    <Typography variant="subtitle2">Contact No: {selectedOrder.contactNumber}</Typography>
                    <Typography variant="subtitle2">Email: {selectedOrder.email}</Typography>

                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    <b>Items:</b> (Placeholder for now)
                    </Typography>
                    {/* Render selectedOrder.items here when available */}
                </>
                )}
            </DialogContent>
        </Dialog>
    </Box>
  );
};

export default Orders;
