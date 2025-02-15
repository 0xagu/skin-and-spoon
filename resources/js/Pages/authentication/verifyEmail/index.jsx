import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { TextField, Container, Grid2, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import welcomeImage from '../../../../assets/images/welcome.jpeg';
import { useQuery } from '@tanstack/react-query';

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [action, setAction] = useState('');

    const { data: verifyResult } = useQuery({
        staleTime: Infinity,
        cacheTime: Infinity,
        queryKey: ['verifyResult'],
        queryFn: async () =>
          await api
            .get(`/auth/verify-email/${token}`)
            .then((res) => res.data)
    });

    useEffect(() => {
        if (!verifyResult) return;
    
        const { error, action } = verifyResult;
    
        if (error === 0) {
            setMessage('Verification successful!');
        } else {
            if (action === 'login'){
                setMessage('Account already existed, please proceeed to login');
            } else if (action === 'register') {
                setMessage('Please re-enter a valid email.');
            }
        }
    
        setAction(action);
    }, [verifyResult, action]);

    const initialValues = {
        email: verifyResult?.data || '',
        password: '',
        password_confirmation: '',
        name: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        // password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        // confirmPassword: Yup.string()
        //     .oneOf([Yup.ref('password'), null], 'Passwords must match')
        //     .required('Confirm password is required')
    });
    
    const handleVerifyEmail = async (values, { setSubmitting }) => {
        try {
            const endpoint = action === 'register' ? '/auth/register' : '/auth/welcome'; 
            const response = await api.post(endpoint, values);

            
            if (response?.data?.error === 0) {
              console.log("verify success!")
              if (response?.data?.action === 'login') {
                setAction('login');
              } else {
                setAction('verifyEmail');
              }
            }else {
              console.log("login failed,", response?.message);
            }
        } catch (error) {
            console.log("error")
        } finally {
          setSubmitting(false);
        }
    };
    return (
        <Container
            maxWidth="false"
            disableGutters
        >
            <Grid2 
                container 
                spacing={0}
                sx={{
                    px: 0
                }}
            >
                <Grid2 
                    item 
                    size={6}
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        height: '100vh',
                    }}
                >
                    <img 
                        src={welcomeImage} 
                        alt="Verify Email" 
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                         }} 
                    />
                </Grid2>
                <Grid2 
                    item 
                    size={6}
                    px={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        height: '100vh',
                        justifyContent: 'center',
                        padding: '5rem'
                    }}
                >
                    <Grid2 item>
                        {action === 'register' ? (
                            <>
                                <h1>Email Verified!</h1>
                                <h1>Register An Account</h1>
                            </>
                        ) : (
                            <>
                                <h1>Invalid or expired token.</h1>
                                <p>{message}</p>
                            </>
                        )}
                    </Grid2>
                    <Grid2 item>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log("Form submitted with values:", values);
                                handleVerifyEmail(values, { setSubmitting });
                            }}
                            enableReinitialize={true}
                            // validateOnChange={false}
                            // validateOnBlur={false}
                            // context={{ isEmailVerified }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <Grid2 
                                        container
                                        spacing={2}
                                        sx={{ 
                                            maxHeight: 400
                                        }}
                                    >
                                        <Grid2 
                                            item 
                                            xs={6}
                                            size={6}
                                            sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                            }}
                                        >
                                            <Field name="email">
                                                {({ field }) => (
                                                    <TextField
                                                    {...field}
                                                    label="Email Address"
                                                    variant="standard"
                                                    error={touched.email && Boolean(errors.email)}
                                                    helperText={touched.email ? errors.email : ' '}
                                                    fullWidth
                                                    disabled={action === 'register'}
                                                    />
                                                )}
                                            </Field> 

                                            {action === 'verifyEmail' && (
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{ mt: 2 }}
                                                >
                                                    Verification email sent! Please check your inbox. :)
                                                </Typography>
                                            )}
                                        </Grid2>
                                    </Grid2>

                                    {action === 'register' && (
                                        <>
                                            <Grid2 
                                                item 
                                                xs={6}
                                                size={6}
                                                sx={{
                                                    pb: { xs: 0, sm: 4, md: 1 }
                                                }}
                                            >
                                                <Field name="name">
                                                    {({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="name"
                                                            type="text"
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
                                                xs={6}
                                                size={6}
                                                sx={{
                                                    pb: { xs: 0, sm: 4, md: 1 }
                                                }}
                                            >
                                                <Field name="password">
                                                    {({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Password"
                                                            type="password"
                                                            variant="standard"
                                                            error={touched.password && Boolean(errors.password)}
                                                            helperText={touched.password ? errors.password : ' '}
                                                            fullWidth
                                                        />
                                                    )}
                                                </Field>
                                            </Grid2>

                                            <Grid2 
                                                item 
                                                xs={6}
                                                size={6}
                                                sx={{
                                                    pb: { xs: 0, sm: 4, md: 1 }
                                                }}
                                            >
                                                <Field name="password_confirmation">
                                                    {({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Confirm Password"
                                                            type="password"
                                                            variant="standard"
                                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                                            helperText={touched.confirmPassword ? errors.confirmPassword : ' '}
                                                            fullWidth
                                                        />
                                                    )}
                                                </Field>
                                            </Grid2>
                                        </>
                                    )}

                                    <Grid2 
                                        item 
                                        xs={6}
                                        size={6}
                                        sx={{
                                            pb: { xs: 0, sm: 4, md: 1 }
                                        }}
                                    >
                                        <LoadingButton
                                            type="submit"
                                            size='large'
                                            variant="contained"
                                            color="primary"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            fullWidth
                                            disableElevation
                                        >
                                            {action === 'register' ? 'Register' : 'Verify Email'}
                                        </LoadingButton>
                                    </Grid2>
                                </Form>
                            )}
                        </Formik>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default VerifyEmail;
