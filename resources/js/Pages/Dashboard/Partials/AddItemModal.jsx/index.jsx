import * as React from 'react';
import { Backdrop, Fade, Modal, Box, Avatar, Grid2, TextField, Button } from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import api from '../../../../api/axios';
const AddItemModal = ({ open, handleClose, data }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    const initialValues = {
        name: data?.name || '',
        category: data?.item_category_id || '',
        expiration_date: data?.expiration_date || '',
        quantity: data?.quantity || 0
    };
      
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const extendedValues = { ...values, user_id: 18, acquire_date: '2025-01-01', priority: 0 }; 
            const response = await api.post('/list/create', extendedValues);
            alert(response?.data?.message);
        } catch (error) {
            console.log("error")
        } finally {
          setSubmitting(false);
        }
    }

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
                            console.log("Form submitted with values:", values);
                            handleSubmit(values, { setSubmitting });
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                {/* MODAL HEADER */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb:'2rem'}}>
                                    <Button onClick={handleClose}>CANCEL</Button>
                                    {data ? 
                                        <LoadingButton
                                            type="submit"
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            loading={isSubmitting}
                                            disableElevation
                                        >
                                        EDIT
                                        </LoadingButton>
                                    :  <LoadingButton
                                            type="submit"
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            loading={isSubmitting}
                                            disableElevation
                                        >
                                        ADD
                                        </LoadingButton>
                                    }
                                </Box>

                                {/* MODAL CONTENT */}
                                <Box>
                                    <Avatar 
                                        alt="Emoji" 
                                        src="/static/images/avatar/1.jpg"
                                        sx={{ width: 80, height: 80 }}
                                    />

                                    {/* ADD ITEM FORM */}
                                
                                    <Grid2 
                                        container
                                        spacing={2}
                                        sx={{ 
                                            maxHeight: 400
                                        }}
                                    >
                                        <Grid2 
                                            item 
                                            xs={12}
                                            size={12}
                                            sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                            }}
                                        >
                                            <Field name="name">
                                                {({ field }) => (
                                                    <TextField
                                                    {...field}
                                                    label="Name"
                                                    variant="standard"
                                                    error={touched.name && Boolean(errors.name)}
                                                    helperText={touched.name ? errors.name : ' '}
                                                    fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>
                                        <Grid2 
                                            item 
                                            xs={12}
                                            size={12}
                                            sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                            }}
                                        >
                                            <Field name="category">
                                                {({ field }) => (
                                                    <TextField
                                                    {...field}
                                                    label="Category"
                                                    variant="standard"
                                                    error={touched.category && Boolean(errors.category)}
                                                    helperText={touched.category ? errors.category : ' '}
                                                    fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>
                                        <Grid2 
                                            item 
                                            xs={12}
                                            size={12}
                                            sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                            }}
                                        >
                                            <Field name="expiration_date">
                                                {({ field }) => (
                                                    <TextField
                                                    {...field}
                                                    label="Expiry Date"
                                                    variant="standard"
                                                    error={touched.expiration_date && Boolean(errors.expiration_date)}
                                                    helperText={touched.expiration_date ? errors.expiration_date : ' '}
                                                    fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>
                                        <Grid2 
                                            item 
                                            xs={12}
                                            size={12}
                                            sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                            }}
                                        >
                                            <Field name="quantity">
                                                {({ field }) => (
                                                    <TextField
                                                    {...field}
                                                    label="Quantity"
                                                    variant="standard"
                                                    error={touched.quantity && Boolean(errors.quantity)}
                                                    helperText={touched.quantity ? errors.quantity : ' '}
                                                    fullWidth
                                                    />
                                                )}
                                            </Field>
                                        </Grid2>
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