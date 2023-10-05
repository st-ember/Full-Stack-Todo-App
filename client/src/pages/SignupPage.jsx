import React from 'react';
import SignupForm from '../components/SignupForm';

function SignupPage() {
    return (
        <div>
            <h1
            className='text-white text-center text-6xl m-10'
            >Create Account</h1>
            <SignupForm />
        </div>
    );
};

export default SignupPage;