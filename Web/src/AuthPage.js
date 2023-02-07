import React, {useEffect, useState} from "react"
import FacebookLogin from 'react-facebook-login'

import { useNavigate } from "react-router-dom"

import AreaLogo from './assets/logo.png'
import "./AuthPage.css"
import "./App.css"

import {provider, auth} from './firebaseConfig'

/**
 * @brief It creates the Sign up and Sign In Pages for the AREA
 * It has a login with facebook on Sign In page
 * @returns the page corresponding to the current authMode
 */
export default function AuthPage() {

    let [authMode, setAuthMode] = useState("signin")
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const handleChange = (event) => {
      if (event.target.type === "email") {
        setEmail(event.target.value);
      } else {
        setPassword(event.target.value);
      }
    };

    auth.onAuthStateChanged(user => {
      if (user) {
        auth.getRedirectResult().then((result) => {
          if (result.user !== null) {
            navigate('/home');
          }  
        });
      }
    });
    

    const onLoginFacebook = async (event) => {
      event.preventDefault();
      try {
        await auth.signInWithRedirect(provider)
      } catch (err) {
        console.log(err);
      };

    }

    const requestServer = async (endpoint, requestOptions) => {
      try {
        await fetch("http://192.168.0.71:8080/" + endpoint, requestOptions).then(response => {
            response.json().then(data => {
                console.log(data);
                if (data.userUid != 'error') {
                  navigate('/home');
                }
            })
        });
      } catch (error) {
          console.log(error);
      }
    }

    const onSubmit = async (event) => {
      event.preventDefault();
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  
      },
        body: JSON.stringify({email: email, password: password})
      }
      if (authMode === "signup") {
        await requestServer("register", requestOptions);
      } else {
        await requestServer("login", requestOptions);
      }
      
    };

    if (authMode === "signin") {
        return (
          <div className="Form-container">
            
            <form className="Form">
              <div className="Form-content">
                <img src={AreaLogo} className="logo" alt="logo" />
                <div className="text-center">
                  Not registered yet ?  {"  "}
                  <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter email"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <button className="button-center" onClick={onSubmit}>
                    Submit
                  </button>
                </div>
                <div className="form-group">
                  <button className="button-center" id="facebook-button" onClick={onLoginFacebook}>
                    facebook
                  </button>
                </div>
                <p className="text-center mt-2">
                  Forgot <a href="#">password?</a>
                </p>
              </div>
            </form>
          </div>
        )
      }

      return (
        <div className="Form-container">
          <form className="Form" onSubmit={onSubmit}>
            <div className="Form-content">
              <h3 className="Title">Sign Up</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign In
                </span>
              </div>
              <div className="form-group">
                <br></br>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <br></br>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <button className="button-center">
                  Submit
                </button>
              </div>
              <p className="text-center mt-2">
                Forgot <a href="#">password?</a>
              </p>
            </div>
          </form>
        </div>
    );
}
