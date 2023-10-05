import React from 'react';

function TodoForm({ handleSubmit, todo, handleChange }) {
    return (
        <form onSubmit={e => handleSubmit(e)}>
            <input
            className='text-black p-1 rounded m-2 w-3/5'
            onChange={e => handleChange(e)}
            value={todo}
            />
            <button
            type="submit"
            className='bg-stone-800 p-1 rounded
            hover:bg-stone-900 active:bg-stone-950'
            >Add Todo</button>
        </form>
    );
};

export default TodoForm;