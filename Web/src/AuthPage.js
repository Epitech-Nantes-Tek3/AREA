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
                  Pas encore de compte ?  {"  "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    S'inscrire
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="form-group">
                  <button className="button-center">
                    Se connecter
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
              </div>
            </form>
          </div>
        )
      }

      return (
        <div className="Form-container">
          <form className="Form">
            <div className="Form-content">
              <h3 className="Title">S'inscrire</h3>
              <div className="text-center">
                Déjà un compte ?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Se connecter
                </span>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Adresse email"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Mot de passe"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control mt-2"
                  placeholder="Valider le mot de passe"
                />
              </div>
              <div className="form-group">
                <button className="button-center">
                  S'inscrire
                </button>
              </div>
            </div>
          </form>
        </div>
    );
}
