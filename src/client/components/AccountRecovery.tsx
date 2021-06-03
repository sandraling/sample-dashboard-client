import * as React from "react";
import { TextField, Button } from "@material-ui/core";

export const AccountRecovery = () => {
    const emailRef = React.useRef(null);

    return (
        <>
            <div className='landing__title--lo'>
                <h1>Awesome Dash</h1>
                <h4 className='account-recovery'>Enter your email and we will send you a password reset link.</h4>
            </div>
            <div className='account-recovery-form__container landing__overlay--white'>
                <form className='account-recovery-form column'>
                    <TextField
                        className='account-recovery-form__textfield'
                        label='Email'
                        name='email'
                        type='text'
                        ref={emailRef} />
                    <Button className='btn' variant='contained' color='primary' disableElevation>Send request</Button>
                </form>
            </div>
        </>
    )
}