import React, { useContext } from 'react';
import { todosArrayContext } from '../context/TodosArrayContext';

function TodoList({ handleDelete, handleEdit, handleEditSave, selectedIndex }) {
    const { todosArray, setTodosArray } = useContext(todosArrayContext);

    const handleChange = (e, index) => {
        const newArray = [...todosArray];
        newArray[index].todo = e.target.value;
        setTodosArray(newArray);
    };

    return (
        <ul>
            {todosArray?.map((data, index) => 
                (
                    <li
                    key={index}
                    id={data.todoId}
                    className={` p-2 rounded m-2 w-4/5
                    flex justify-between align-center
                    ${ index === selectedIndex ? 'bg-stone-500' : 'bg-stone-700'}`
                    }
                    >
                        <input
                        className='bg-inherit focus:border-none p-2 w-96'
                        value={data.todo}
                        readOnly={index !== selectedIndex}
                        onChange={e => handleChange(e, index)}
                        />
                        <div className='button-container'>
                            { index !== selectedIndex ? (
                                <button
                                className='p-1 px-2 m-2 rounded bg-stone-800 hover:bg-stone-900 active:bg-stone-950'
                                onClick={ () => handleEdit(index) }
                                >edit</button>
                            ) : (
                                <button
                                className='p-1 px-2 m-2 rounded bg-stone-800 hover:bg-stone-900 active:bg-stone-950'
                                onClick={ (e) => handleEditSave(e, index) }
                                >save</button>
                            )
                        }
                            <button
                            className='p-1 px-2 m-2 rounded bg-stone-800 hover:bg-stone-900 active:bg-stone-950'
                            onClick={ e => handleDelete(e) }
                            >delete</button>
                        </div>
                    </li>
                )
            )}
        </ul>
    );
};

export default TodoList;