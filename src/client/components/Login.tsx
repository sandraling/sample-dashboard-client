import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    useLocation,
    useHistory
} from 'react-router-dom';
import { useAuth } from "./Auth";
import { TextField, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { TosFooter } from './Landing';
import { useFormik } from 'formik' ;
import * as Yup from 'yup';

export const Login = () => {
    let location = useLocation();
    let auth = useAuth();

    const [loginError, setLoginError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    let { from } = location.state as any || { from: { pathname: "/" } };

    const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
        rememberMe: false
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .required('Required'),
        password: Yup.string()
          .required('Required'),
        rememberMe: Yup.bool()
      }),
      onSubmit: ({ username, password, rememberMe }) => {
        auth?.login(username, password, rememberMe)
          .then(success => {
            if (success === true) {
              return (
                <Redirect to={from} />
              );
            } else {
              setLoginError("Incorrect username and password combination!");
            }
          })
      }
    });
    
    return (
      <>
        <div className='landing__title--lo'>
          <h1>Awesome Dash</h1>
          <h4>Welcome back! Please login to your account.</h4>
        </div>
        <div className='landing-form__container landing__overlay--white'>
          <form className='login-form column' onSubmit={formik.handleSubmit}>
            <div className='login-form__error-msg'>
                <p>{loginError}</p>
            </div>
            <TextField 
              className='login-form__textfield'
              label='Username'
              id='username'
              type='text'
              autoComplete='username'
              {...formik.getFieldProps('username')}
              onChange={formik.handleChange}/>
            <TextField 
              className='login-form__textfield'
              label='Password'
              type='password' 
              autoComplete='current-password'
              {...formik.getFieldProps('password')}
              onChange={formik.handleChange}/>

            <div className='row login-form-row-2'>
              <FormControlLabel
                className='login-form__rmbr'
                control={
                  <Checkbox
                    id='rememberMe'
                    className={formik.touched.rememberMe 
                      && formik.errors.rememberMe
                      ? 'error'
                      : ''}
                    {...formik.getFieldProps('rememberMe')}
                    color="primary"/>
                }
                label="Remember me"
              />
              <Link to='account-recovery'>
                <p>Forgot password</p>
              </Link>
            </div>

            <div className='login-form-row-3'>
              <Button 
                className='btn' 
                type='submit'
                variant='contained' 
                color='primary' 
                disableElevation>
                Login
              </Button>
              <Link to='/sign-up'>
                <Button 
                  className='btn' 
                  variant='outlined' 
                  color='primary'>
                  Sign Up
                </Button>
              </Link>
            </div>

          </form>
          <TosFooter />
        </div>
      </>
    )
}