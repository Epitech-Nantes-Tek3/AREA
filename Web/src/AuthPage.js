import React, {useState} from "react"
import FacebookLogin from 'react-facebook-login'

import AreaLogo from './assets/logo.png'
import "./AuthPage.css"
import "./App.css"

/**
 * @brief It creates the Sign up and Sign In Pages for the AREA
 * It has a login with facebook on Sign In page
 * @returns the page corresponding to the current authMode
 */
export default function AuthPage() {

    let [authMode, setAuthMode] = useState("signin")

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

    const onSubmit = (event) => {
      console.log('submit');
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  
      },
        body: JSON.stringify({email: email, password: password})
      }

      console.log(email, password)

      try {
          fetch("http://10.29.125.146:8080/register", requestOptions).then(response => {
              response.json().then(data => {
                  console.log(data);
              })
          });
      } catch (error) {
          console.log(error);
      }
      
    };

    if (authMode === "signin") {
        return (
          <div className="Form-container">
            
            <form className="Form" onSubmit={onSubmit}>
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
        )
      }

      return (
        <div className="Form-container">
          <form className="Form">
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
                />
              </div>
              <div className="form-group">
                <br></br>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Password"
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
