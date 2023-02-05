import React, {useState} from "react"
import FacebookLogin from 'react-facebook-login'

import { useNavigate } from "react-router-dom"

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

    const responseFacebook = (response) => {
      console.log(response);
      if (response.accessToken) {
        navigate('/home');
      } else {
        console.log('failed to connect');
      }
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

            <form className="Form" onSubmit={onSubmit}>
              <div className="Form-content">
                <img src={AreaLogo} style={{width: 150, height: 150, display: "block", margin: "auto"}} alt="logo" />
                <h3 className="Title">Se connecter</h3>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control mt-1"
                    style={{width: "60%", display: "block", margin: "auto"}}
                    placeholder="Adresse email"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    style={{width: "60%", display: "block", margin: "auto"}}
                    className="form-control mt-1"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <button className="button-center"
                    style={{width: "60%", display: "block", margin: "auto"}}
                  >
                    Se connecter
                  </button>
                </div>
                <div className="text-center" style={{marginTop: 20}}>
                  Pas encore de compte ?  {"  "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    S'inscrire
                  </span>

                <div className="form-group">
                  <FacebookLogin
                    appId="604811154808703"
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="public_profile,user_friends"
                    callback={responseFacebook}
                    cssClass="facebook"
                    icon="fa-facebook" />
                </div>
                </div>
              </div>
            </form>
          </div>
          )}



      return (
        <div className="Form-container">
          <form className="Form" onSubmit={onSubmit}>
            <div className="Form-content">
              <img src={AreaLogo} style={{width: 150, height: 150, display: "block", margin: "auto"}} alt="logo" />
              <h3 className="Title">S'inscrire</h3>
              <div className="form-group">
                <input
                  type="email"
                  style={{width: "60%", display: "block", margin: "auto"}}
                  className="form-control mt-1"
                  placeholder="Adresse email"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  style={{width: "60%", display: "block", margin: "auto"}}
                  className="form-control mt-1"
                  placeholder="Mot de passe"
                  onChange={handleChange}
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
