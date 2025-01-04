import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from "../../../components/Header";
import api from "../../../../api/axios"
import { encryptAES } from '../../../../store/constant';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid2, TextField, Button, Container, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import welcomeImage from '../../../../assets/images/welcome.jpeg';

const Login = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    
    const initialValues = {
        email: '',
        password: '',
      };
    
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleLogin = async (values) => {
        try {
            const response = await api.post('/auth/login', values);

            if (response?.data?.error === 0) {
              const dataToStore = {
                userInfo: {
                    name: response?.data?.chatSocialAccounts,
                    isVerified: response?.data?.isVerified,
                },
                accessToken: response?.data?.data?.access_token,
                refreshToken: response?.data?.data?.refresh_token
            };

              localStorage.setItem('accessToken', encryptAES(dataToStore.accessToken));
              localStorage.setItem('refreshToken', encryptAES(dataToStore.refreshToken));
              handleClose();
            }else {
              console.log("login failed,", response?.message);
            }
        } catch (error) {
            console.log("error")
        }
    };
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
      <Container>
        <Header />
        <h2>Login Dialog Example</h2>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Sign In
        </Button>
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
                  Log in
                </DialogTitle>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                      console.log("Form submitted with values:", values);
                      handleLogin(values);
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Grid2 
                        container
                        spacing={2}
                        sx={{ 
                          maxHeight: 400
                        }}>
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
                        </Grid2>

                        <DialogActions
                        sx={{
                          px: 0
                        }}>
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
      </Container>
    );
};
export default Login;