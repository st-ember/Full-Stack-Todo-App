import React from 'react';
import SigninForm from '../components/SigninForm';

function SigninPage() {
    return (
        <div>
            <h1
            className='text-white text-center text-6xl m-10'
            >Sign In</h1>
            <SigninForm />
        </div>
    );
};

export default SigninPage;