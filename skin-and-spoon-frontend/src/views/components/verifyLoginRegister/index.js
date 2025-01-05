import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from "../../../api/axios"
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid2, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import welcomeImage from '../../../assets/images/welcome.jpeg';

const VerifyLoginRegister = ({ open, handleClose }) => {
    const { t } = useTranslation();
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
            const endpoint = action === 'login' ? '/auth/login' : '/auth/welcome'; 
            const response = await api.post(endpoint, values);

            console.log("response:", response);
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
                Log in (VerifyEmail)
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
                              disabled={action !== ''}
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
                        Login
                      </LoadingButton>
                    </DialogActions>
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