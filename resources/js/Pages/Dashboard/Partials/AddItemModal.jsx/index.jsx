import React, { useState, useEffect } from 'react';
import { Backdrop, Fade, Modal, Box, Avatar, Grid2, TextField, Button, InputLabel, Select, MenuItem, Typography, FormControlLabel, Checkbox } from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../../../api/axios';
import { Close, Add, Edit } from "@mui/icons-material";
import { FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

const AddItemModal = ({ open, handleClose, data }) => {
    const style = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "90%",
        maxWidth: { xs: 300, sm: 400, md: 500, lg: 600 },
        bgcolor: 'background.paper',
        borderRadius: "12px",
        pt: 4,
        px: 4,
        pb: 6,
        height: "70vh",
        maxHeight: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
    };

    const scrollableContentStyle = {
        flexGrow: 1,
        overflowY: "auto",
        paddingBottom: "16px",
        "&::-webkit-scrollbar": {
            width: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) => theme.palette.primary.main,
            border: "4px solid transparent",
            borderRadius: "8px",
            backgroundClip: "padding-box",
        },
    };

    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageRealLocations, setImageRealLocations] = useState([]);

    const initialValues = {
        name: data?.name || '',
        category: data?.item_category_id || '',
        expiration_date: data?.expiration_date || '',
        quantity: data?.quantity || 0,
        priority: data?.priority || false,
        notification: data?.notification || false,
    };
      
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("values:", values);

        const formData = {
            ...values,
            images: imageRealLocations,
        };

        try {
            const response = await api.post('/list/create', formData);
            alert(response?.data?.message);
        } catch (error) {
            console.log("error")
        } finally {
          setSubmitting(false);
        }
    }

    const { data: categoryOption } = useQuery({
        staleTime: 'Infinity',
        queryKey: ['category'],
        queryFn: async () => await api.get(`/list/get-all-category`).then((res) => res.data)
    });

    const handleFileUpload = async (files) => {
        if (imagePreviews.length >= 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        const uploadedImages = [];
        const previews = [];
    
        for (const file of files) {
            const formData = new FormData();
            
            files.forEach((file) => {
                formData.append("files[]", file);
                previews.push(URL.createObjectURL(file));
            });
    
            try {
                const response = await api.post("/upload-files", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                if (Array.isArray(response?.data?.files)) {
                    response?.data?.files?.forEach(file => {
                        uploadedImages.push(file?.real_location);
                        previews.push(file?.file_url);
                    });
                }
            } catch (error) {
                console.error("Upload Error:", error);
            }
        }
    
        setImagePreviews((prev) => [...prev, ...previews]);
        setImageRealLocations((prev) => [...prev, ...uploadedImages]);
    };

    useEffect(() => {
        if (!open) {
            setImagePreviews([]);
            setImageRealLocations([]);
        }
    }, [open]);
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 300,
                },
                }}
            >
                <Fade in={open}>
                
                <Box sx={style}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={(values, { setSubmitting }) => {
                            handleSubmit(values, { setSubmitting });
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                {/* MODAL HEADER */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '2rem', position: 'relative' }}>
                                    <Typography sx={{ fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                                        {data ? "Edit your item" : "Create your item"}
                                    </Typography>
                                    <Button onClick={handleClose} sx={{ position: 'absolute', right: 0 }}>
                                        <Close />
                                    </Button>
                                </Box>

                                {/* MODAL CONTENT */}
                                <Box sx={scrollableContentStyle}>
                                    {/* ADD ITEM FORM */}
                                    <Grid2 container spacing={2} sx={{ maxHeight: 400 }}>

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
                                                        }}
                                                    >
                                                        <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                                                    <FormControl fullWidth>
                                                        <InputLabel id="quantity-label">Quantity</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="quantity-label"
                                                            id="quantity"
                                                            value={field.value}
                                                            onChange={(event) => form.setFieldValue(field.name, event.target.value)}
                                                        >
                                                            <MenuItem value={1}>1</MenuItem>
                                                            <MenuItem value={2}>2</MenuItem>
                                                            <MenuItem value={3}>3</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </Grid2>

                                        {/* Unit Dropdown */}
                                        <Grid2 item size={6}>
                                            <Field name="unit">
                                                {({ field, form }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="unit-label">Unit</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="unit-label"
                                                            id="unit"
                                                            value={field.value}
                                                            onChange={(event) => form.setFieldValue(field.name, event.target.value)}
                                                        >
                                                            <MenuItem value="kg">kg</MenuItem>
                                                            <MenuItem value="liters">liters</MenuItem>
                                                            <MenuItem value="pieces">pieces</MenuItem>
                                                        </Select>
                                                    </FormControl>
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
                                        <Grid2 container item xs={12} spacing={2} alignItems="center">
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
                                <Box>
                                    <Grid2 spacing={2} container xs={12} justifyContent="flex-end">
                                        {data ? 
                                            <LoadingButton
                                                type="submit"
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                loading={isSubmitting}
                                                disableElevation
                                                startIcon={<Edit />}
                                            >
                                            DONE
                                            </LoadingButton>
                                        :  <LoadingButton
                                                type="submit"
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                loading={isSubmitting}
                                                disableElevation
                                                startIcon={<Add />}
                                                sx={{
                                                    borderRadius: "12px",
                                                    minWidth: "180px",
                                                    padding: "10px 24px",
                                                    fontSize: "16px",
                                                    "&:hover": {
                                                        backgroundColor: (theme) => theme.palette.secondary.main,
                                                    },
                                                }}
                                            >
                                            CREATE
                                            </LoadingButton>
                                        }
                                    </Grid2>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
                </Fade>
            </Modal>
    </div>
  );
}

export default AddItemModal;