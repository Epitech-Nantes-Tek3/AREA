import React, {useState} from "react"
import "./App.css"
import FacebookLogin from 'react-facebook-login';

export default function AuthPage(props) {

    let [authMode, setAuthMode] = useState("signin")

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    if (authMode === "signin") {
        return (
          <div className="Auth-form-container">
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="text-center">
                  Not registered yet ?  {"  "}
                  <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
                  </span>
                </div>
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                  />
                </div>
                <div className="form-group">
                  <button className="button-center">
                    Submit
                  </button>
                </div>
                <div className="form-group">
                <FacebookLogin
                  appId="1088597931155576"
                  autoLoad={true}
                  fields="name,email"
                  cssClass="facebook"
                  icon="fa-facebook" />
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
        <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign In
                </span>
              </div>
              <div className="form-group">
                <label>Full Name </label>
                <br></br>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g Jane Doe"
                />
              </div>
              <div className="form-group">
                <label>Email address </label>
                <br></br>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
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
