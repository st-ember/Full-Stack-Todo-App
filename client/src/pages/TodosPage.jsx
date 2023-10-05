import React, { useEffect, useState, useContext } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { todosArrayContext } from '../context/TodosArrayContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookies';

function TodosPage() {
    const { todosArray, setTodosArray } = useContext(todosArrayContext);
    const [effectTrigger, setEffectTrigger] = useState(false);
    const [todo, setTodo] = useState('');
    const [username, setUsername] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(false);
    const [logOutPopup, setLogOutPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = Cookies.getItem("jwtToken")
        fetch("http://localhost:3001/get-todolist", 
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(json => {
            setTodosArray(json.results)
            setUsername(json.username)
        });
    }, [effectTrigger]);

    const handleDelete = async (e) => {
        const jwtToken = Cookies.getItem("jwtToken")
        const todoId = e.target.parentElement.parentElement.id;
        await fetch("http://localhost:3001/delete-todo", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                todoId: todoId
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
        });
        setEffectTrigger(!effectTrigger);
    };

    const handleEdit = (index) => {
        setSelectedIndex(index);
    };

    const handleEditSave = async (e) => {
        console.log(todosArray)
        const jwtToken = Cookies.getItem("jwtToken")
        const todoId = e.target.parentElement.parentElement.id;
        const todo = e.target.parentElement.parentElement.querySelector("input").value;
        console.log(todoId);
        await fetch("http://localhost:3001/update-todo", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                todoId: todoId,
                todo: todo
            })
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .then(setEffectTrigger(!effectTrigger))
        .then(setSelectedIndex(null));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const jwtToken = Cookies.getItem("jwtToken")
        await fetch("http://localhost:3001/add-todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                todo: todo
            })
        })
        .then(setEffectTrigger(!effectTrigger));
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setTodo(value);
        console.log(todo)
    };

    const handleClickPopup = () => {
        setLogOutPopup(!logOutPopup);
    };
    
    const handleLogOut = () => {
        Cookies.removeItem("jwtToken", '/todo', 'localhost');
        setTimeout(() => {
            const isCookie = Cookies.getItem("jwtToken");
            console.log(isCookie);
        });
        setTodosArray([]);
        navigate("/home");
    };

    return (
        <div>
            <h1
            className='text-center text-4xl m-10'
            >Here is your Todo List, {username}</h1>
            <button
            className='rounded bg-stone-300 text-black hover:bg-stone-400 active:bg-stone-500
            absolute top-10 right-10
            p-2'
            onClick={handleClickPopup}
            >Log Out</button>
            {logOutPopup && (
                <div
                className='grid grid-cols-1 place-items-center 
                absolute top-20 right-10 
                my-2 p-2 rounded
                bg-stone-700'>
                    <div
                    className='m-2 text-lg'
                    >Confirm Log Out?
                    </div>
                    <div
                    className='grid grid-cols-2-even'
                    >
                        <button
                        className='bg-stone-500 hover:bg-stone-400 active:text-stone-800
                        p-1 m-1 rounded
                        text-sm'
                        onClick={handleLogOut}
                        >Confirm</button>
                        <button
                        className='bg-stone-500 hover:bg-stone-400 active:text-stone-800
                        p-1 m-1 rounded
                        text-sm'
                        onClick={handleClickPopup}
                        >Cancel</button>
                    </div>
                </div>
            )
            }
            <div className='grid grid-cols-1 w-3/5 m-auto'>
                <TodoForm 
                todo={todo}
                handleChange={e => handleChange(e)}
                handleSubmit={e => handleSubmit(e)}
                />
                <TodoList 
                selectedIndex={selectedIndex}
                handleEdit={handleEdit}
                handleEditSave={e => handleEditSave(e)}
                handleDelete={e => handleDelete(e)}/>
            </div>
        </div>
    );
};

export default TodosPage;