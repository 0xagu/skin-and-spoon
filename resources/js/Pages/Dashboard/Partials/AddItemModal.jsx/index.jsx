import React, { useState, useEffect, useRef } from 'react';
import {  Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid2, TextField, Button, InputLabel, Select, MenuItem, Typography, FormControlLabel, Checkbox, Autocomplete} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../../../api/axios';
import { Close, Add } from "@mui/icons-material";
import { FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SnackbarAlert from '../../../../components/SnackbarAlert';

const AddItemModal = ({ open, handleClose, data }) => {
    const queryClient = useQueryClient();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageRealLocations, setImageRealLocations] = useState([]);
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);
    const contentRef = useRef(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            setShowTopShadow(scrollTop > 0);
            setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
        };

        const contentEl = contentRef.current;
        if (contentEl) {
            contentEl.addEventListener("scroll", handleScroll);
            handleScroll(); // Run once on mount
        }

        return () => contentEl?.removeEventListener("scroll", handleScroll);
    }, [open]);

    useEffect(() => {
        if (open) {
            if (data?.img_preview?.length) {
                const existingPreviews = data.img_preview.map(img => img.temporary_url);
                const existingRealLocations = data.img_preview.map(img => img.real_location);
    
                setImagePreviews(existingPreviews);
                setImageRealLocations(existingRealLocations);
            } else {
                setImagePreviews([]);
                setImageRealLocations([]);
            }
        }
    }, [open, data]);

    const initialValues = {
        id: data?.uuid || '',
        name: data?.name || '',
        category: data?.item_category?.uuid || '',
        acquire_date: data?.acquire_date || '',
        expiration_date: data?.expiration_date || '',
        quantity: data?.quantity || 0,
        unit: data?.unit || '',
        priority: data?.priority || false,
        notification: data?.notification || false,
    };
      
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
    
        const formData = {
            ...values,
            images: imageRealLocations,
        };
    
        try {
            const response = await api.post('/list/create-or-edit-item', formData);
            setSnackbar({
                open: true,
                message: response?.data?.message || "Item updated successfully!",
                severity: "success",
            });
            queryClient.invalidateQueries(['items']);
            resetForm();
            handleClose();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error?.response?.data?.message || "An error occurred!",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };
    

    const { data: categoryOption } = useQuery({
        staleTime: 'Infinity',
        queryKey: ['category'],
        queryFn: async () => await api.get(`/list/get-all-category`).then((res) => res.data)
    });

    const handleFileUpload = async (files) => {
        if (imagePreviews.length >= 5) {
            setSnackbar({
                open: true,
                message: "You can only upload up to 5 images.",
                severity: 'warning',
            });
            return;
        }
    
        const uploadedImages = [];
        const previews = [];
    
        // Loop through each file
        for (const file of files) {
            const formData = new FormData();
            
            formData.append("files[]", file);  // Append only the current file
            
            const filePreviewUrl = URL.createObjectURL(file);

            if (!imagePreviews.includes(filePreviewUrl)) {
                previews.push(filePreviewUrl);
            }
    
            try {
                const response = await api.post("/upload-files", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                if (Array.isArray(response?.data?.files)) {
                    response?.data?.files?.forEach(file => {
                        uploadedImages.push(file?.real_location);
                    });
                }
            } catch (error) {
                console.error("Upload Error:", error);
                setSnackbar({
                    open: true,
                    message: "There was an error uploading the files.",
                    severity: 'error',
                });
            }
        }
    
        // Update state with the new previews and real file locations
        setImagePreviews((prev) => [...prev, ...previews]);
        setImageRealLocations((prev) => [...prev, ...uploadedImages]);
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar((prevState) => ({
            ...prevState,
            open: false, // Close snackbar
        }));
    };

    useEffect(() => {
        if (!open) {
            setImagePreviews([]);
            setImageRealLocations([]);
        }
    }, [open]);
    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                {/* Dialog Header */}
                <DialogTitle 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontWeight: "bold",
                        boxShadow: showTopShadow ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                        transition: "box-shadow 0.2s ease-in-out",
                    }}
                >
                    <Typography 
                    variant="h6" 
                        fontWeight="bold" 
                        sx={{ 
                            flexGrow: 1, 
                            textAlign: "center" 
                        }}
                    >
                        {data ? "Edit Item" : "Create Item"}
                    </Typography>
                    <Button onClick={handleClose} sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        minWidth: 0,
                    }}>
                        <Close />
                    </Button>
                </DialogTitle>

                {/* Dialog Content */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <DialogContent 
                                dividers={false}
                                ref={contentRef}
                                sx={{ 
                                    maxHeight: "60vh", 
                                    overflowY: "auto",
                                    paddingBottom: '200px',
                                    "&::-webkit-scrollbar": {
                                        width: "12px",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "#000", // Black scrollbar
                                        border: "4px solid transparent",
                                        borderRadius: "8px",
                                        backgroundClip: "padding-box",
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "transparent",
                                    },
                                }}
                            >
                                {/* MODAL CONTENT */}
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {/* ADD ITEM FORM */}
                                    <Grid2 container spacing={4} sx={{ maxHeight: 400 }}>
                                        {/* Image Upload Section */}
                                        {/* First Box */}
                                        <Grid2 item size={12}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                style={{ display: "none" }}
                                                id="image-upload"
                                                onChange={(event) => {
                                                    const files = Array.from(event.target.files);
                                                    if (files.length > 0) {
                                                        handleFileUpload(files);
                                                    }
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "10px",
                                                }}
                                            >
                                                {imagePreviews?.map((preview, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            width: "100px",
                                                            height: "100px",
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            position: "relative",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#f0f0f0",
                                                        }}
                                                    >
                                                        <img 
                                                            src={preview} 
                                                            alt="Preview" 
                                                            style={{ 
                                                                width: "100%", 
                                                                height: "100%", 
                                                                objectFit: "cover"
                                                            }} 
                                                        />
                                                    </Box>
                                                ))}
                                                <Box
                                                    sx={{
                                                        width: "100px",
                                                        height: "100px",
                                                        bgcolor: "grey.300",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: 2,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => document.getElementById("image-upload").click()}
                                                >
                                                    <Add sx={{ color: "grey.600", fontSize: 40 }} />
                                                </Box>
                                            </Box>
                                        </Grid2>
                                        
                                        {/* ITEM NAME INPUT */}
                                        <Grid2 item xs={12} size={12}>
                                            <Field name="name">
                                                {({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Name"
                                                        variant="outlined"
                                                        error={touched.name && Boolean(errors.name)}
                                                        helperText={touched.name ? errors.name : ' '}
                                                        fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>
                                        <Grid2 item size={12}>
                                            <Field name="category">
                                                {({ field, form }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="category-label">Category</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="category-label"
                                                            id="category"
                                                            value={field.value}
                                                            onChange={(event) => form.setFieldValue(field.name, event.target.value)}
                                                        >
                                                            {categoryOption?.map((cat) => (
                                                                <MenuItem key={cat.uuid} value={cat.uuid}>
                                                                    {cat.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </Grid2>
                                        
                                        {/* Quantity Dropdown */}
                                        <Grid2 item size={6}>
                                            <Field name="quantity">
                                                {({ field, form }) => (
                                                    <TextField
                                                        {...field}
                                                        type="number"
                                                        label="Quantity"
                                                        variant="outlined"
                                                        inputProps={{ min: 1 }}
                                                        onChange={(event) => form.setFieldValue(field.name, Number(event.target.value))}
                                                        fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>

                                        {/* Unit Dropdown */}
                                        <Grid2 item size={6}>
                                            <Field name="unit">
                                                {({ field, form }) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        disablePortal
                                                        selectOnFocus
                                                        clearOnBlur
                                                        handleHomeEndKeys
                                                        value={field.value || "pieces"} 
                                                        options={["kg", "liters", "pieces"]} // Predefined units
                                                        onChange={(_, newValue) => form.setFieldValue(field.name, newValue)}
                                                        renderInput={(params) => (
                                                            <TextField {...params} label="Unit" variant="outlined" fullWidth />
                                                        )}
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>

                                        {/* Acquire Date & Expiration Date */}
                                        {/* Acquire Date */}
                                        <Grid2 item size={6}>  
                                            <Field name="acquire_date">
                                                {({ field, form }) => (
                                                    <DatePicker
                                                        label="Acquire Date"
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(newValue) => 
                                                            form.setFieldValue(field.name, newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
                                                        }
                                                        fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>

                                        {/* Expiration Date */}
                                        <Grid2 item size={6}>  
                                            <Field name="expiration_date">
                                                {({ field, form }) => (
                                                    <DatePicker
                                                        label="Expiration Date"
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(newValue) => 
                                                            form.setFieldValue(field.name, newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
                                                        }
                                                        fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>

                                        
                                        {/* Important & Notification */}
                                        <Grid2 container item xs={12} spacing={4} alignItems="center">
                                            {/* Important Checkbox */}
                                            <Grid2 item xs={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Field name="priority">
                                                            {({ field }) => (
                                                                <Checkbox {...field} checked={field.value} />
                                                            )}
                                                        </Field>

                                                    }
                                                    label="Important"
                                                />
                                            </Grid2>

                                            {/* Notification Checkbox */}
                                            <Grid2 item xs={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Field name="notification">
                                                            {({ field }) => (
                                                                <Checkbox {...field} checked={field.value} />
                                                            )}
                                                        </Field>
                                                    }
                                                    label="Notification"
                                                />
                                            </Grid2>
                                        </Grid2>                            
                                    </Grid2>
                                </Box>
                            </DialogContent>

                            {/* Dialog Actions (Footer) */}
                            <DialogActions 
                                sx={{
                                    justifyContent: "flex-end",
                                    pr: 2,
                                    boxShadow: showBottomShadow ? "0px -4px 6px rgba(0, 0, 0, 0.1)" : "none",
                                    transition: "box-shadow 0.2s ease-in-out",
                                }}
                            >
                                {/* <Button onClick={handleClose} variant="outlined">Cancel</Button> */}
                                <LoadingButton
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    loading={isSubmitting}
                                    disableElevation
                                    // startIcon={data ? <Edit /> : <Add />}
                                    sx={{ borderRadius: "12px", minWidth: "150px" }}
                                >
                                    {data ? "Done" : "Create Item"}
                                </LoadingButton>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* SnackbarAlert Usage */}
            <SnackbarAlert
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}

export default AddItemModal;