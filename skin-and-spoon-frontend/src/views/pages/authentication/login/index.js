import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from "../../../components/Header";
import api from "../../../../api/axios"
const Login = () => {

    const initialValues = {
        email: '',
        password: '',
      };
    
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async () => {
        try {
            const response = await api.get('/auth/login');
            alert('Login successful!', response);
        } catch (error) {
            console.log("error")
        }
    };
    
    return (
        <>
            <Header />
            <h2>Login</h2>
            <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            </div>
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>
            {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
        </>
    );
};
export default Login;