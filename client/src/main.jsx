import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from "./routes/root"
import LandingPage from './pages/LandingPage';
import TodosPage from './pages/TodosPage';
import Signin from './pages/SigninPage';
import Signup from './pages/SignupPage';
import ErrorPage from './pages/ErrorPage';
import { TodosArrayContextProvider } from './context/TodosArrayContext';

const router = createBrowserRouter([
  {
    path: "/",
    element:(
      <TodosArrayContextProvider>
        <Root />
      </TodosArrayContextProvider>
      ),
    children: [
      {
        path: "",
        element: <LandingPage />
      }, {
        path: "todo/:id",
        element: <TodosPage />
      }, {
        path: "signin",
        element: <Signin />
      }, {
        path: "signup",
        element: <Signup />
      }
    ]
  }, {
    path: "*",
    element: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
