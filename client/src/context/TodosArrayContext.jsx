import React, { useState } from 'react';

export const todosArrayContext = React.createContext();

export function TodosArrayContextProvider({ children }) {
    const [todosArray, setTodosArray] = useState([]);
    
    return (
    <todosArrayContext.Provider value={{ todosArray, setTodosArray }}>
        {children}
    </todosArrayContext.Provider>
    );
};