import React, { useState } from 'react';
import Cookies from 'js-cookies';
import { useNavigate } from 'react-router-dom';

function SigninForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log("submitted")
        e.preventDefault();
        await fetch("http://localhost:3001/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            const token = json.token;
            if(token) {
                Cookies.setItem('jwtToken', token, { secure: true, httpOnly: true });
                navigate(`/todo/${json.userId}`)
            } else {
                console.log("no token")
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
    m-auto p-4'
    onSubmit={e => handleSubmit(e)}
    >
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
        >Password</label>
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

export default SigninForm;