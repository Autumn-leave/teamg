import { ReactHTMLElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from "@mui/material/InputAdornment";

import Image from "../Components/image";
import "../Styles/jinSignIn.css";
import LoginBtn from "../Components/LoginBtn";

const JinSignIn = () => {
  const [mailId, setMailId] = useState("");
  const [password, setPwd] = useState("");

  const [mErr, setMerr] = useState(false);
  const [mtext, setMtext] = useState("");

  const [pErr, setPerr] = useState(false);
  const [ptext, setPtext] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const validator = require("validator");

  const Navigate = useNavigate();
  console.log(mailId);
  console.log(password);

  interface typeCheck {
    email: string;
    password: string;
  }
  const data = {
    email: mailId,
    password: password,
  };
  console.log(data);

  const handleSubmit = async () => {
    console.log("data =>", data);

    if (mailId === "" || mailId === undefined) {
      setMailId("Please Enter E-mail");
      setMerr(true);
    } else if (!validator.isEmail(mailId)) {
      setMailId("Please enter valid mail address");
      setMerr(true);
    } else if (password === "" || password === undefined) {
      setPtext("Please Enter Password");
      setPerr(true);
    } else {

      try {
        // Send a POST request to your login endpoint
          const response = await axios.post("http://localhost:8080/login", data)
          console.log(response.data.message);
          //   console.log(response.data.data);

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

          if (response.data.message === "password not matching") {
            toast.error('Invalid User', {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          if (response.data.message === "User Not Found") {
            toast.error('User Not Found', {
              position: toast.POSITION.TOP_RIGHT
            });

          }
          if (response.data.message === "empty datad") {
            toast.error('All Fields are mandatory', {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        
      } catch (error) {
        console.error("Login error:", error);
        toast.error('Login failed. Please check your credentials', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  };


  return (
    <div className="main-container">
      <Image />
      <div className="sign-container">
        <form
          className="sign-container"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
        >
          <div className="d-flex flex-column w-50 ">
            <h1>Sign In</h1>
            <TextField
              required
              id="mailId"
              error={mErr}
              helperText={mtext}
              label="Email"
              name="mailId"
              size="small"
              className="mb-4"
              onChange={(e) => {
                setMailId(e.target.value);
                if (!validator.isEmail(mailId)) {
                  setMtext("Please enter valid mail address");
                  setMerr(true);
                } else {
                  setMerr(false);
                  setMtext("");
                }
              }}
              onBlur={() => {
                if (mailId.trim() === "") {
                  setMerr(true);
                  setMtext("Enter mail Id");
                } else if (!validator.isEmail(mailId)) {
                  setMtext("Please enter valid mail address");
                  setMerr(true);
                } else {
                  setMerr(false);
                  setMtext("");
                }
              }}
            />
            <TextField
              required
              id="password"
              error={pErr}
              helperText={ptext}
              label="Password"
              name="password"

              size="small"
              className="mb-4"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setPwd(e.target.value);
              }}
              onBlur={() => {
                if (password.trim() === "") {
                  setPerr(true);
                  setPtext("Enter Password");
                } else {
                  setPerr(false);
                  setPtext("");
                }
              }}
            />
            <div className="d-flex flex-row justify-content-end">
              {/* <Button variant="contained" className='mb-3 button' onClick={signin}>Sign In</Button> */}
              <button type="button" className="button1" onClick={handleSubmit}>
                SIGN IN
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right ms-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              </button>
              <LoginBtn />
            </div>
            <p className="text-end mt-2">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default JinSignIn;
