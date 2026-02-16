import React, { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton,
  Paper, Chip, alpha, useTheme, InputAdornment, useMediaQuery,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Add, Edit, Delete, Search, GridView, ViewList,
  FileDownload, DeleteSweep, Close
} from '@mui/icons-material';

// Sample data
const initialItems = [
  { id: 1, name: 'Drone Model X1', category: 'Electronics', price: 299.99, stock: 45, status: 'active' },
  { id: 2, name: 'Propeller Set', category: 'Parts', price: 24.99, stock: 120, status: 'active' },
  { id: 3, name: 'Battery Pack', category: 'Power', price: 89.99, stock: 30, status: 'low' },
  { id: 4, name: 'Camera Module', category: 'Electronics', price: 199.99, stock: 0, status: 'out' },
  { id: 5, name: 'Controller', category: 'Accessories', price: 149.99, stock: 25, status: 'active' },
];

const Items = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 60,
      hide: isMobile 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: isMobile ? 120 : 200, 
      flex: isTablet ? 1 : 0 
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: isMobile ? 90 : 150,
      hide: isMobile 
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: isMobile ? 80 : 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      field: 'stock', 
      headerName: 'Stock', 
      width: isMobile ? 60 : 100 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: isMobile ? 80 : 120,
      renderCell: (params) => {
        const colors = { active: 'success', low: 'warning', out: 'error' };
        return <Chip label={params.value} color={colors[params.value]} size="small" variant="filled" />;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 80 : 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
            sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, category: item.category, price: item.price, stock: item.stock });
    } else {
      setEditingItem(null);
      setFormData({ name: '', category: '', price: '', stock: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    const newItem = {
      id: editingItem ? editingItem.id : Math.max(...items.map(i => i.id), 0) + 1,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      status: parseInt(formData.stock) === 0 ? 'out' : parseInt(formData.stock) < 10 ? 'low' : 'active',
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setItems([...items, newItem]);
    }
    handleClose();
  };

  const handleEdit = (item) => handleOpen(item);

  const handleDelete = (id) => {
    if (window.confirm('Delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleBulkDelete = () => {
    if (items.length === 0) return;
    if (window.confirm('Delete all items?')) {
      setItems([]);
    }
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3, 
          flexWrap: 'wrap', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            📦 Items
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 3, px: 3, whiteSpace: 'nowrap' }}
          >
            Add Item
          </Button>
        </Box>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: 250 }, 
                flex: { xs: 1, sm: 'none' },
                '& .MuiOutlinedInput-root': { borderRadius: 3 } 
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: 1 }}>
                <IconButton 
                  onClick={() => setViewMode('table')}
                  size="small"
                  sx={{ 
                    bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: viewMode === 'table' ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  <ViewList />
                </IconButton>
                <IconButton 
                  onClick={() => setViewMode('grid')}
                  size="small"
                  sx={{ 
                    bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: viewMode === 'grid' ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  <GridView />
                </IconButton>
              </Box>
              
              <Button 
                variant="outlined" 
                startIcon={<FileDownload />} 
                size="small" 
                sx={{ borderRadius: 2, display: { xs: 'none', sm: 'flex' } }}
              >
                Export
              </Button>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteSweep />} 
                size="small" 
                onClick={handleBulkDelete}
                sx={{ borderRadius: 2 }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Paper sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            cursor: 'pointer',
          },
        }}>
          <DataGrid
            rows={filteredItems}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: isMobile ? 5 : 10 } },
            }}
            pageSizeOptions={isMobile ? [5] : [5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowClick={(params) => handleEdit(params.row)}
            autoHeight
            sx={{
              width: '100%',
              minHeight: isMobile ? 300 : 500,
            }}
          />
        </Paper>
      </motion.div>

      {/* Stats */}
      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        {[
          { label: 'Total Items', value: items.length },
          { label: 'In Stock', value: items.filter(i => i.status === 'active').length },
          { label: 'Low Stock', value: items.filter(i => i.status === 'low').length },
          { label: 'Out', value: items.filter(i => i.status === 'out').length },
        ].map((stat, i) => (
          <Paper 
            key={stat.label}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            sx={{ 
              px: { xs: 2, sm: 3 }, 
              py: 1.5, 
              borderRadius: 2, 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flex: { xs: 1, sm: 'auto' },
              minWidth: { xs: '100%', sm: 'auto' },
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            <Typography variant="h6" fontWeight={600}>{stat.value}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Add/Edit Dialog */}
      <AnimatePresence>
        {open && (
          <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, scale: 0.9, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, y: 20 },
              transition: { duration: 0.2 },
              sx: { borderRadius: 3 }
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 600, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {editingItem ? '✏️ Edit Item' : '➕ Add New Item'}
              <IconButton onClick={handleClose} size="small">
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Category"
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Stock"
                type="number"
                fullWidth
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} sx={{ borderRadius: 2 }}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>
                {editingItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Items;