import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginBtn() {
  const Navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const { isAuthenticated, user } = useAuth0();

  const handleSignInClick = () => {
    loginWithRedirect();
  };

  const handlesub = async () => {
    console.log(user?.email)
    const email = user?.email;
    const response = await axios.post("http://localhost:8080/loginwithsso", {email})
    try{
        if (response.data.message === "Login") {
            sessionStorage.setItem('authToken', response.data.token)
            toast.success('Login Successfully', {
              position: toast.POSITION.TOP_RIGHT
            });
    
            setTimeout(() => {
              Navigate('/dashboard')
            }, 1000)
          }
          if (response.data.message === "Login-admin") {
            sessionStorage.setItem('authToken', response.data.token)
            toast.success('Login Successfully', {
              position: toast.POSITION.TOP_RIGHT
            });
    
            setTimeout(() => {
              Navigate('/adminLearningDevelopment')
            }, 1000)
          }
          if (response.data.message === "Activation Required") {
                toast.warning('Activation Required', {
                  position: toast.POSITION.TOP_RIGHT
                });
    
                setTimeout(() => {
                  Navigate('/')
                }, 1000)
              }
        if (response.data.message === "User Not Found") {
                toast.error('User Not Found', {
                  position: toast.POSITION.TOP_RIGHT
                });
    
              }
    }
    catch (error) {
        console.error("Login error:", error);
        toast.error('Login failed. Please check your credentials', {
          position: toast.POSITION.TOP_RIGHT
        });
      }

  }
  if (isAuthenticated) {
    handlesub();
  }
  return (
    <main style={{ padding: '1rem 0' }}>
      <Grid container>
        <Grid container justifyContent="center">
          <Button variant="contained" onClick={handleSignInClick}>
            Sign In
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </main>
  );
}

export default LoginBtn;
