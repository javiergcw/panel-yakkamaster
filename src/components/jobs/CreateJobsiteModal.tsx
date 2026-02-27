'use client';

import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CreateJobsiteModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateJobsiteModal({ open, onClose }: CreateJobsiteModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', p: 1 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1d1d1f' }}>
                    Create new Jobsite
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon sx={{ color: '#1d1d1f' }} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ color: '#555555', fontSize: '0.875rem', mb: 3, mt: 1 }}>
                    Add a new location where the worker should arrive.
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="location-label">Location</InputLabel>
                    <Select
                        labelId="location-label"
                        label="Location"
                        defaultValue=""
                        sx={{ borderRadius: '8px' }}
                    >
                        <MenuItem value="sydney">Sydney</MenuItem>
                        <MenuItem value="melbourne">Melbourne</MenuItem>
                        <MenuItem value="brisbane">Brisbane</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />

                <TextField
                    fullWidth
                    label="Suburb"
                    variant="outlined"
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Details/Instructions"
                    variant="outlined"
                    placeholder="e.g. Enter through the back gate, ask for John."
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        bgcolor: '#66bb6a',
                        color: '#ffffff',
                        py: 1.5,
                        borderRadius: '8px',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#5cb85c',
                            boxShadow: 'none',
                        }
                    }}
                >
                    Save jobsite
                </Button>
            </DialogActions>
        </Dialog>
    );
}
