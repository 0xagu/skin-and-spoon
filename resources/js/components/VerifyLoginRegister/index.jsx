import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from "../../api/axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid2, TextField, Typography, Link } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import welcomeImage from '../../../assets/images/welcome.jpeg';
import { useNavigate } from 'react-router-dom';
import { router } from '@inertiajs/react';
const VerifyLoginRegister = ({ open, handleClose }) => {
    const [action, setAction] = useState('');

    useEffect(() => {
      if(!open){
        setAction('');
      }
    }, [open])

    const initialValues = {
      email: '',
      password: ''
    };
    
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const endpoint = action === 'login' ? '/oauth/login' : '/auth/welcome'; 
            const response = await api.post(endpoint, values);

            if (response?.data?.error === 0) {
              console.log("verify success!")

              localStorage.setItem('access_token', response?.data?.data?.access_token); 
              localStorage.setItem('refresh_token', response?.data?.data?.refresh_token); 
              if (response?.data?.action === 'login') {
                setAction('login');
              } else if (response?.data?.action === 'dashboard') {
                router.visit('/dashboard');
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
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
      >
        <DialogContent 
          sx={{ 
            p: 0,
            overflow: 'hidden'
          }}
        >
          <Grid2 container>
            <Grid2 
              item 
              size={{ xs: 12, sm: 6 }}
              sx={{
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <img
                src={welcomeImage}
                alt="Welcome"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
              }}
              />
            </Grid2>

            <Grid2 
              item 
              size={{ xs: 12, sm: 6 }}
              sx={{
                flexGrow: 1,
                px: 6,
                py: 6
              }}
            >
              <Typography
              sx={{
                display: { xs: 'flex', sm: 'none' }
              }}>
                Welcome to Skin & Spoon!
              </Typography>
              <DialogTitle 
                sx={{
                  px: 0,
                  py: { xs: 3, sm: 6 },
                  fontWeight: '800'
                }}
              >
                { action === 'login' ? 'Sign In' : 'Sign Up (VerifyEmail)' }
              </DialogTitle>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log("Form submitted with values:", values);
                    handleLogin(values, { setSubmitting });
                }}
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
                        xs={12}
                        size={12}
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
                              // disabled={action !== ''}
                              fullWidth
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

                    {action === 'login' && (
                      <Grid2 
                        item 
                        xs={12}
                        size={12}
                        sx={{
                          pb: { xs: 1, sm: 5 }
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
                    )}

                    <DialogActions
                      sx={{
                        px: 0
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        size='large'
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        disabled={isSubmitting || action === 'verifyEmail'}
                        fullWidth
                        disableElevation
                      >
                        {action === 'login' ? 'Login' : 'Register'}
                      </LoadingButton>
                    </DialogActions>

                    {action === 'login' ? 
                      <Grid2 sx={{ display: "flex", alignItems: "center" }}>
                      <h6 style={{ margin: 0, marginRight: "8px" }}>Don't have an account yet?</h6>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          setAction('register');
                        }}
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        Register
                      </Link>
                    </Grid2>
                    : 
                    <Grid2 sx={{ display: "flex", alignItems: "center" }}>
                      <h6 style={{ margin: 0, marginRight: "8px" }}>Already have an account?</h6>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          setAction('login');
                        }}
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        Log in.
                      </Link>
                    </Grid2>}
                  </Form>
                )}
              </Formik>
            </Grid2>
          </Grid2>
        </DialogContent>
      </Dialog>
    );
};
export default VerifyLoginRegister;