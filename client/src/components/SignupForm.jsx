import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookies';

function SignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3001/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                formData
            })
        })
        .then(response => response.json())
        .then(json => {
            const message = json.message;
            const token = json.token;
            if(message) {
                setMessage(message);
            }
            if(token) {
                Cookies.setItem('jwtToken', token, { secure: true, httpOnly: true });
                navigate(`/todo/${json.userId}`);
            } else {
                console.log("no token");
            }
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        console.log(formData);
    };

    return (
    <form
    className='bg-stone-700 w-3/5
    grid grid-cols-1
    rounded
    mt-28
    m-auto p-4 relative'
    onSubmit={e => handleSubmit(e)}
    >
        <div 
        className='absolute top-6 right-0 left-0
        text-center text-amber-200'
        >{message}</div>
        <label htmlFor="username"
        className='m-2'
        >Username</label>
        <input type="text" 
        className='m-2 p-1 text-black rounded'
        name="username"
        value={formData.username}
        onChange={e => handleInputChange(e)}
        required
        />
        <label htmlFor="email"
        className='m-2'
        >Email</label>
        <input type="email" 
        className='m-2 p-1 text-black rounded'
        name="email"
        value={formData.email}
        onChange={e => handleInputChange(e)}
        required
        />
        <label htmlFor="password"
        className='m-2'
        >Password
        </label>
        <input type="password"
        className='m-2 p-1 text-black rounded'
        name="password"
        value={formData.password}
        onChange={e => handleInputChange(e)}
        required
        />
        <button type="submit"
        className='bg-slate-50 rounded text-slate-900 active:bg-slate-300 hover:bg-slate-200 p-1 w-fit m-2'
        >
        Submit
        </button>
    </form>
    );
};

export default SignupForm;
