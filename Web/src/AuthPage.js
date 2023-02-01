import React, {useState} from "react"
import AreaLogo from './assets/logo.png'
import FacebookLogo from './assets/facebook.png'
import "./AuthPage.css"
import "./App.css"

/**
 * @brief It creates the Sign up and Sign In Pages for the AREA
 * It has a login with facebook on Sign In page
 * @returns the page corresponding to the current authMode
 */
export default function AuthPage() {

    let [authMode, setAuthMode] = useState("signin")

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

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
                  />
                </div>
                <div className="form-group">
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
                  <button className="facebook">
                    <img src={FacebookLogo} alt="Facebook" className="icon-Style"/>
                    <label className="fb-text">Connexion</label>
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
