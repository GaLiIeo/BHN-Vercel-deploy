import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    InputAdornment,
    Chip,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactPageIcon from '@mui/icons-material/ContactPage';

const SearchDialog = ({ open, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Search suggestions and pages
    const searchableContent = [
        {
            title: 'Book Appointment',
            description: 'Schedule appointments with healthcare providers',
            path: '/appointment',
            icon: <BookOnlineIcon />,
            category: 'Services',
            keywords: ['appointment', 'book', 'schedule', 'doctor', 'visit']
        },
        {
            title: 'Dashboard',
            description: 'Access your health records and information',
            path: '/dashboard',
            icon: <DashboardIcon />,
            category: 'Health',
            keywords: ['dashboard', 'health', 'records', 'profile', 'data']
        },
        {
            title: 'Our Team',
            description: 'Meet our healthcare professionals',
            path: '/team',
            icon: <PersonIcon />,
            category: 'Company',
            keywords: ['team', 'doctors', 'staff', 'professionals', 'experts']
        },
        {
            title: 'Project Overview',
            description: 'Learn about our digital healthcare platform',
            path: '/project',
            icon: <ArticleIcon />,
            category: 'Project',
            keywords: ['project', 'platform', 'system', 'technology', 'innovation']
        },
        {
            title: 'Login',
            description: 'Access your Birth Health Network account',
            path: '/login',
            icon: <ContactPageIcon />,
            category: 'Account',
            keywords: ['login', 'signin', 'account', 'access', 'auth']
        },
        {
            title: 'Register',
            description: 'Create a new Birth Health Network account',
            path: '/register',
            icon: <ContactPageIcon />,
            category: 'Account',
            keywords: ['register', 'signup', 'account', 'create', 'new']
        }
    ];

    // Filter content based on search query
    const filteredContent = searchQuery.trim()
        ? searchableContent.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : searchableContent.slice(0, 6); // Show first 6 items when no search

    const handleItemClick = (path) => {
        navigate(path);
        onClose();
        setSearchQuery('');
    };

    const handleClose = () => {
        onClose();
        setSearchQuery('');
    };

    // Group by category
    const groupedContent = filteredContent.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    maxHeight: '80vh',
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Search Birth Health Network
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    placeholder="Search for pages, services, information..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            bgcolor: '#f8f9fa',
                        }
                    }}
                />

                {searchQuery.trim() && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Found {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''} for "{searchQuery}"
                        </Typography>
                    </Box>
                )}

                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {Object.entries(groupedContent).map(([category, items], categoryIndex) => (
                        <Box key={category} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Chip
                                    label={category}
                                    size="small"
                                    sx={{
                                        bgcolor: '#0066CC15',
                                        color: '#0066CC',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            </Box>

                            <List sx={{ p: 0 }}>
                                {items.map((item, index) => (
                                    <ListItem
                                        key={item.path}
                                        onClick={() => handleItemClick(item.path)}
                                        sx={{
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: '#f8f9fa',
                                                transform: 'translateX(4px)',
                                            },
                                            mb: 0.5,
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '8px',
                                                    bgcolor: '#0066CC15',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#0066CC',
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {item.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.description}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            {categoryIndex < Object.entries(groupedContent).length - 1 && (
                                <Divider sx={{ my: 2 }} />
                            )}
                        </Box>
                    ))}
                </Box>

                {filteredContent.length === 0 && searchQuery.trim() && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            No results found for "{searchQuery}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try searching for services, appointments, or health information
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;