import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from "../../../components/Header";
import api from "../../../../api/axios"
import { encryptAES } from '../../../../store/constant';
import { Grid2, FormControl, Card, CardHeader, CardContent, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
const Login = () => {
    const { t } = useTranslation();
    
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

            if (response?.data?.error == 0) {
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

            }else {
              console.log("login failed,", response?.message);
            }
        } catch (error) {
            console.log("error")
        }
    };
    
    return (
        <>
            <Header />
            <h2>Login</h2>
            <Grid2 
            container
            sx={{ 
              maxWidth: 400, 
              m: '0 auto',
              p: 5,
              backgroundColor: 'red'
            }}
            >
              <Grid2 item p={5}>
                <Card>
                  <CardHeader title="REGISTER FORM"></CardHeader>
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
                        <CardContent>
                          <Grid2 item container spacing={1} justify="center">
                            <FormControl>
                              <Field name="email">
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Email Address"
                                    variant="outlined"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    fullWidth
                                  />
                                )}
                              </Field>
                            </FormControl>
                          </Grid2>

                          <Grid2 item container spacing={1} justify="center">
                            <FormControl>
                              <Field name="password">
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Password"
                                    variant="outlined"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    fullWidth
                                  />
                                )}
                              </Field>
                            </FormControl>
                          </Grid2>

                          <Grid2 item container spacing={1} justifyContent="center" >
                            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                              Login
                            </Button>
                          </Grid2>
                        </CardContent>
                      </Form>
                    )}
                  </Formik>
                </Card>
              </Grid2>
          </Grid2>
        </>
    );
};
export default Login;