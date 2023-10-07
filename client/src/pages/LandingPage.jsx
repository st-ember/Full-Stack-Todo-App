import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div 
        className='bg-amber-100 h-screen w-screen
        absolute top-0
        grid grid-cols-2'>
            <div className='grid grid-cols-1 py-60 px-32'>
                <h1 className='text-black text-5xl'>
                    Create your own todo list
                </h1>
                <h2 className='text-black text-3xl my-6'>
                    Sign in or create an account
                </h2>
            </div>
            <div className='bg-neutral-700 py-60 pl-20'>
                <Link className='p-4 text-2xl hover:cursor-pointer hover:text-amber-200 active:text-amber-400'
                to="/signin">Sign In</Link>
                <Link className='p-4 text-2xl hover:cursor-pointer hover:text-amber-200 active:text-amber-400 flex'
                to="/signup">Create Account</Link>
            </div>
        </div>
    );
};

export default LandingPage;
