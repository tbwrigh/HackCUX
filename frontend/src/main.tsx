import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import Root from './routes/root.tsx'
import SignupPage from './routes/signup/signup.tsx'
import LoginPage from './routes/login/login.tsx'
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import './index.css'

async function isLoggedIn() {
  const session_cookie = Cookies.get('session_id');
  if (session_cookie === undefined) {
    return redirect("login");
  } else {
    return null;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: isLoggedIn,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
