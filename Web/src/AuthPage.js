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
                <img src={AreaLogo} style={{width: 150, height: 150, display: "block", margin: "auto"}} alt="logo" />
                <h3 className="Title">Se connecter</h3>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control mt-1"
                    style={{width: "60%", display: "block", margin: "auto"}}
                    placeholder="Adresse email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    style={{width: "60%", display: "block", margin: "auto"}}
                    className="form-control mt-1"
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="form-group">
                  <button className="button-center"
                    style={{width: "60%", display: "block", margin: "auto"}}
                  >
                    Se connecter
                  </button>
                </div>
                <div className="form-group" style={{width: "55%", display: "block", margin: "auto", alignItems: "center"}}>
                  <FacebookLogin
                    appId="1088597931155576"
                    autoLoad={true}
                    fields="email"
                    icon="fa-facebook"
                    size="medium"
                    />
                  </div>
                <div className="text-center" style={{marginTop: 20}}>
                  Pas encore de compte ?  {"  "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    S'inscrire
                  </span>
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
              <img src={AreaLogo} style={{width: 150, height: 150, display: "block", margin: "auto"}} alt="logo" />
              <h3 className="Title">S'inscrire</h3>
              <div className="form-group">
                <input
                  type="email"
                  style={{width: "60%", display: "block", margin: "auto"}}
                  className="form-control mt-1"
                  placeholder="Adresse email"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  style={{width: "60%", display: "block", margin: "auto"}}
                  className="form-control mt-1"
                  placeholder="Mot de passe"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  style={{width: "60%", display: "block", margin: "auto"}}
                  className="form-control mt-2"
                  placeholder="Valider le mot de passe"
                />
              </div>
              <div className="form-group">
                <button className="button-center"
                  style={{width: "60%", display: "block", margin: "auto"}}>
                  S'inscrire
                </button>
              </div>
              <div className="text-center">
                Déjà un compte ?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Se connecter
                </span>
              </div>
            </div>
          </form>
        </div>
    );
}
