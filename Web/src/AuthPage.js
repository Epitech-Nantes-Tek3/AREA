import React, { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import AreaLogo from './assets/logo.png'
import "./AuthPage.css"
import "./App.css"

import { firebaseMod, provider, auth } from './firebaseConfig'
import { ip } from './env'

import { addDataIntoCache } from './CacheManagement'
import { loginWithCache } from './Common/Login'

/**
 * It creates the Sign up and Sign In Pages for the AREA
 * It has a login with facebook on Sign In page
 * @param props the props of the page (userInformation and allAreas)
 * @returns the page corresponding to the current authMode
 */
function AuthPage(props) {
    const navigate = useNavigate();
    let [authMode, setAuthMode] = useState("signin")

    const [isBadPassord, setIsBadPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * It changes the authMode between SignIn and SignUp
     */
    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    /**
     * It checks if the user is already logged in.
     * If he is, it redirects him to the home page.
     */
    useEffect(() => {
        if (loginWithCache("/home", props) === "/home") {
            console.log("Already logged in")
            navigate("/home");
        }
    }, [])

    /**
     * If the event target type is email, set the email state to the event target
     * value. Otherwise, set the password state to the event target value
     * @param event - The event that triggered the function.
     */
    function handleChange(event) {
        console.log("aaa")
        if (event.target.type === "email") {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    /* Checking if the user is already logged in. If he is, it redirects him to
    the home page. */
    auth.onAuthStateChanged(user => {
        auth.getRedirectResult().then((result) => {
            console.log(result);
            if (result.user !== null) {
                navigate('/home');
            }
        });
    })

    /**
     * The function is called when the user clicks on the Facebook login button.
     * It prevents the default action of the button, and then sets the persistence
     * of the user to none. This means that the user will not be remembered by the
     * browser. Then, the user is redirected to the Facebook login page
     * @param event - The event that triggered the function.
     */
    async function onLoginFacebook(event) {
        event.preventDefault();
        console.log('facebook')
        try {
            firebaseMod.auth().setPersistence(firebaseMod.auth.Auth.Persistence.NONE).then(async () => {
                await auth.signInWithRedirect(provider);
            })
        } catch (err) {
            console.log(err);
        };
    }

    /**
     * It sends a request to the server, and if the server returns a userUid, it
     * adds the user's information into the cache and navigates to the home page
     * @param endpoint - the endpoint of the server you want to request
     * @param requestOptions - A request to the server.
     */
    async function requestServer(endpoint, requestOptions) {
        try {
            await fetch(ip + endpoint, requestOptions).then(response => {
                response.json().then(data => {
                    console.log(data);
                    if (data.userUid !== 'error') {
                        setIsBadPassword(false);
                        props.userInformation.id = data.userUid;
                        props.userInformation.mail = email;
                        addDataIntoCache("area", { ip }, props.userInformation);
                        navigate('/home');
                    } else {
                        setIsBadPassword(true);
                    }
                })
            });
        } catch (error) {
            console.log(error);
            setIsBadPassword(true);
        }
    }

    /**
     * The function is called when the user clicks the submit button. It prevents
     * the default action of the submit button, which is to refresh the page. It
     * then creates a requestOptions object, which contains the method, mode,
     * headers, and body of the request. The body of the request is a JSON object
     * containing the email and password of the user. The function then checks if
     * the authMode is signup or login, and sends the request to the appropriate
     * endpoint
     * @param event - the event that triggered the function
     */
    async function onSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: email, password: password })
        }
        if (authMode === "signup") {
            await requestServer("register", requestOptions);
        } else {
            await requestServer("login", requestOptions);
        }
    }

    /**
     * It returns a button with the text props.
     * @param {string} props - the props of the button (text)
     * @returns the button div with the props
     */
    function CenterButton(props) {
        return (
            <div className="form-group">
                <button className="button-center"
                    style={{ width: "60%", display: "block", margin: "auto" }}>
                    {props.text}
                </button>
            </div>
        )
    }

    /**
     * It returns a button with the text and action props.
     * @param {text: string, action: function} props - the props of the button (text, action)
                            * @returns the button div with the props
                            */
    function AuthButton(props) {
        return (
            <div className="form-group">
                <button className="button-center"
                    style={{ width: "60%", display: "block", margin: "auto", backgroundColor: "#3b5998" }}
                    onClick={props.action}>
                    {props.text}
                </button>
            </div>
        )
    }
    /**
     * It returns an input with the type, placeholder and onChange props.
     * @param {type: string, placeHolder: string, change: function} props - the props of the input (type, placeholder, change)
                            * @returns the input div with the props
                            */
    function Input(props) {
        return (
            <div className="form-group">
                <input
                    type={props.type}
                    className="form-control mt-1"
                    style={{ width: "60%", display: "block", margin: "auto" }}
                    placeholder={props.placeholder}
                    onChange={handleChange}
                />
            </div>
        )
    }
    /**
     * It returns a form with an email input, a password input, a button to submit
     * the form, and a link to change the authentication mode
     * @returns A form with a title, an email input, a password input, a button to
     * submit the form, and a link to the sign up page.
     */
    function signInPage() {
        return (
            <div className="Form-container">

                <form className="Form" onSubmit={onSubmit}>
                    <div className="Form-content">
                        <img src={AreaLogo} style={{ width: 150, height: 150, display: "block", margin: "auto" }} alt="logo" />
                        <h3 className="Title">Se connecter</h3>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control mt-1"
                                style={{ width: "60%", display: "block", margin: "auto" }}
                                placeholder="Adresse email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control mt-1"
                                style={{ width: "60%", display: "block", margin: "auto" }}
                                placeholder="Mot de passe"
                                onChange={handleChange}
                            />
                        </div>
                        <CenterButton text="Se connecter" />
                        <div className="text-center" style={{ marginTop: 20 }}>
                            Pas encore de compte ?  {"  "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                S'inscrire
                            </span>
                            <AuthButton text="Facebook" action={{ onLoginFacebook }} />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    /**
     * It returns a form with a logo, a title, three inputs, a button and a link
     * to the login page
     * @returns A form with a logo, a title, 3 inputs, a button and a link to the
     * login page.
     */
    function signUpPage() {
        return (
            <div className="Form-container">
                <form className="Form" onSubmit={onSubmit}>
                    <div className="Form-content">
                        <img src={AreaLogo} style={{ width: 150, height: 150, display: "block", margin: "auto" }} alt="logo" />
                        <h3 className="Title">S'inscrire</h3>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control mt-1"
                                style={{ width: "60%", display: "block", margin: "auto" }}
                                placeholder="Adresse email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control mt-1"
                                style={{ width: "60%", display: "block", margin: "auto" }}
                                placeholder="Mot de passe"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control mt-1"
                                style={{ width: "60%", display: "block", margin: "auto" }}
                                placeholder="Valider le mot de passe"
                                onChange={handleChange}
                            />
                        </div>
                        <CenterButton text="S'inscrire" />
                        <div className="text-center">
                            Déjà un compte ?{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                Se connecter
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    if (authMode === "signin") {
        return (signInPage())
    }
    return (signUpPage())
}

export default AuthPage;