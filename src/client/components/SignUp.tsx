import * as React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    useLocation,
    useHistory
} from 'react-router-dom';
import * as _ from "lodash";
import { TextField, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { TosFooter } from './Landing';
import { useFormik } from 'formik' ;
import * as Yup from 'yup';
import { useAuth } from './Auth';

export const SignUp = () => {
    const [errorNotice, setErrorNotice] = React.useState('');
    const [redirect, setRedirect] = React.useState(false);
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            tos: false,
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            lastName: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            username: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Must be 8 characters or longer')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            confirmPassword: Yup.string()
                .when("password", {
                    is: val => (val && val.length > 0 ? true : false),
                    then: Yup.string().oneOf(
                    [Yup.ref("password")],
                    "Both password need to be the same"
                    )
                })
                .required('Required'),
            tos: Yup.bool()
                .oneOf([true], 'Field must be checked')
        }),
        onSubmit: (values, { setErrors, setSubmitting }) => {
            // If errors exist, show top/main error msg to alert user
            if (_.isEmpty(formik.errors) === false) {
                setErrorNotice('Some fields need to be changed before proceeding!');
            } else {
                // Send register info to auth service 
                auth?.register({
                    username: values.username,
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: values.password,
                    password2: values.confirmPassword,
                    tos: values.tos
                })
                .then(res => {
                    if (res.success === false) {
                        if (res.error) {
                            setErrors(res.error);
                        } else {
                            setErrorNotice("Oh no, something went wrong!");
                        }
                    } else {
                        setRedirect(true);
                    }
                });
            }
            setSubmitting(false);
        },
    });

    if (redirect === true) {
        return <Redirect to={"/home"} />;
    }
    
    return (
        <>
            <div className='landing__title--hi'>
                <h1>Awesome Dash</h1>
                <h4>Please complete to create your account.</h4>
            </div>
            <div className='landing-form__container landing__overlay--white'>
                <form className='signup-form column' onSubmit={formik.handleSubmit}>
                    <div className='signup-form__error-msg'>
                        <p>{errorNotice}</p>
                    </div>
                    <div className='signup-form__name'>
                        <TextField 
                            className='signup-form__textfield'
                            label='First name' 
                            id='firstName'
                            type='text' 
                            autoComplete='given-name'
                            {...formik.getFieldProps('firstName')}
                            error={formik.errors.firstName && formik.touched.firstName ? true : false}
                            helperText={formik.touched.firstName ? formik.errors.firstName : null}/>
                        <TextField 
                            className='signup-form__textfield'
                            label='Last name'
                            id='lastName' 
                            type='text'
                            autoComplete='family-name'
                            {...formik.getFieldProps('lastName')}
                            error={formik.errors.lastName && formik.touched.lastName ? true : false}
                            helperText={formik.touched.lastName ? formik.errors.lastName : null}/>
                    </div>
                    <TextField 
                        className='signup-form__textfield'
                        label='Username'
                        id='username'
                        type='text'
                        autoComplete='username'
                        {...formik.getFieldProps('username')}
                        error={formik.errors.username && formik.touched.username ? true : false}
                        helperText={formik.touched.username ? formik.errors.username : null}/>
                    <TextField 
                        className='signup-form__textfield'
                        label='Email' 
                        type='email'
                        autoComplete='email'
                        {...formik.getFieldProps('email')}
                        error={formik.errors.email && formik.touched.email ? true : false}
                        helperText={formik.touched.email ? formik.errors.email : null}/>
                    <TextField 
                        className='signup-form__textfield'
                        label='Password'
                        id='password' 
                        type='password'
                        autoComplete='new-password'
                        {...formik.getFieldProps('password')}
                        error={formik.errors.password && formik.touched.password ? true : false}
                        helperText={formik.touched.password ? formik.errors.password : null}/>
                    <TextField 
                        className='signup-form__textfield'
                        label='Confirm Password'
                        id='confirmPassword'
                        type='password'
                        autoComplete='new-password'
                        {...formik.getFieldProps('confirmPassword')}
                        error={formik.errors.confirmPassword && formik.touched.confirmPassword ? true : false}
                        helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : null}/>
                    <FormControlLabel
                        className='signup-form__tos'
                        control={
                            <Checkbox
                                id='tos'
                                className={formik.touched.tos && formik.errors.tos
                                    ? 'error'
                                    : ''}
                                {...formik.getFieldProps('tos')}
                                color="primary"/>
                        }
                        label="I agree with terms and conditions"
                    />
                    <div className='signup-form__submitBtn--container'>
                        <Button 
                            className='signup-form__submitBtn' 
                            variant='contained' 
                            color='primary' 
                            type='submit'
                            disableElevation>
                            Sign up
                        </Button>
                    </div>
                    <Link className='text-sm underline signup-form__sign-in' to='/'>Already have an account? Sign in.</Link>
                </form>
                <TosFooter />
            </div>
        </>
    )
}