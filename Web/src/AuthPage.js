/**
 * @module AuthPage
 */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AreaLogo from './assets/logo.png'
import "./AuthPage.css"
import "./App.css"
import { firebaseMod, provider, auth } from './firebaseConfig'
import { addDataIntoCache } from './Common/CacheManagement'
import { authWithCache } from './Common/Login'

import FacebookLogin from 'react-facebook-login'

const confirmPlaceHolder = "Valider le mot de passe"

/**
 * It creates the Sign up and Sign In Pages for the AREA
 * It has a login with facebook on Sign In page
 * @function AuthPage
 * @param props the props of the page (userInformation and allAreas)
 * @returns the page corresponding to the current authMode
 */
function AuthPage(props) {
    const navigate = useNavigate();
    let [authMode, setAuthMode] = useState("signin")
    const [color, setColor] = useState("red");

    const [isBadPassord, setIsBadPassword] = useState(false);
    const [isPasswordDifferent, setIsPasswordDifferent] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * It changes the authMode between SignIn and SignUp
     * @function changeAuthMode
     */
    function changeAuthMode() {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    /**
     * It checks if the user is already logged in.
     * If he is, it redirects him to the home page.
     */
    useEffect(() => {
        updateIP({ target: { value: props.userInformation.ip } })
        try {
            authWithCache(props.setUserInformation, props);
            console.log("Already logged in")
            navigate("/home");
        } catch (error) {
            console.log("Unable to login" + error);
        }
    }, [])

    /**
     * If the event target type is email, set the email state to the event target
     * value. Otherwise, set the password state to the event target value
     * @function handleChange
     * @param event - The event that triggered the function.
     */
    function handleChange(event) {
        if (event.target.type === "email") {
            setEmail(event.target.value);
        } else if (event.target.placeholder === confirmPlaceHolder) {
            setConfirmPassword(event.target.value)
        } else {
            setPassword(event.target.value);
        }
    }

    /* Checking if the user is already logged in. If he is, it redirects him to
    the home page. */
    auth.onAuthStateChanged(async user => {
        console.log('user', user);
        if (user !== null) {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({uid: user.uid, email: user.email})
            }
            await fetch(props.userInformation.ip + "/register/facebook", requestOptions).then(response => {
                response.json().then(async data => {
                    requestOptions.body = JSON.stringify({uid: user.uid});
                    await fetch(props.userInformation.ip + "/register/google", requestOptions).then(response => {
                        response.json().then(dataGoogle => {
                            if (data.body != 'Error') {
                                setIsBadPassword(false);
                                props.userInformation.id = user.uid;
                                props.userInformation.mail = user.email;
                                addDataIntoCache("area", { mail: props.userInformation.mail, id: props.userInformation.id, password: btoa('facebook-auth'), ip: props.userInformation.ip });
                                navigate('/home');
                            }
                        });
                    });
                })
            });
        }
    })

    /**
     * The function is called when the user clicks on the Facebook login button.
     * It prevents the default action of the button, and then sets the persistence
     * of the user to none. This means that the user will not be remembered by the
     * browser. Then, the user is redirected to the Facebook login page
     * @function onLoginFacebook
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
     * @function requestServer
     * @param endpoint - the endpoint of the server you want to request
     * @param requestOptions - A request to the server.
     */
    async function requestServer(endpoint, requestOptions) {
        try {
            await fetch(props.userInformation.ip + endpoint, requestOptions).then(response => {
                response.json().then(async data => {
                    if (data.userUid !== 'error') {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({uid: data.userUid})
                        }
                        await fetch(props.userInformation.ip + "/register/google", requestOptions).then(response => {
                            response.json().then(dataGoogle => {
                                if (dataGoogle.body != 'Error') {
                                    setIsBadPassword(false);
                                    props.userInformation.id = data.userUid;
                                    props.userInformation.mail = email;
                                    if (endpoint === '/register') {
                                        alert("Vous êtes bien inscrit ! Vérifier votre boite mail pour confirmer votre inscription. Vous pouvez maintenant vous connecter.")
                                        window.location.reload()
                                    } else {
                                        addDataIntoCache("area", { mail: props.userInformation.mail, id: props.userInformation.id, password: btoa(JSON.parse(requestOptions.body).password), ip: props.userInformation.ip });
                                        navigate('/home');
                                    }
                                }
                            })
                        })
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
     * @function onSubmit
     * @param event - the event that triggered the function
     */
    async function onSubmit(event) {
        event.preventDefault();
        if (authMode === "signup") {
            setIsBadPassword(false);
            if (password !== confirmPassword) {
                setIsPasswordDifferent(true);
                return;
            } else {
                setIsPasswordDifferent(false);
            }
        }
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
            await requestServer("/register", requestOptions);
        } else {
            await requestServer("/login", requestOptions);
        }
    }

    /**
     * It returns a button with the text props.
     * @function CenterButton
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
     * @function AuthButton
     * @param {object} props - the props of the button (text, action)
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
     * It fetches a resource, but if the fetch takes longer than the timeout, it
     * aborts the fetch
     * @function fetchWithTimeout
     * @param {string} resource - The URL to fetch.
     * @param {*} [options] - An object containing any custom settings that you want
     * to apply to the request.
     * @returns A function that takes two parameters, resource and options.
     */
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 8000 } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    }

    /**
     * It updates the IP address of the user in the state of the application
     * @function updateIP
     * @param event - the event that triggered the function
     */
    function updateIP(event) {
        setColor("black")
        console.log(event.target.value)
        try {
            fetchWithTimeout(event.target.value + "/testConnexion", { timeout: 500 }).then(response => {
                if (response.status == 200) {
                    setColor("#5281B7")
                } else {
                    setColor("red")
                }
                console.log(response)
            }).catch(error => {
                setColor("red")
                console.log(error)
            })
        } catch (error) {
            setColor("red")
            console.log(error)
        }
        props.setUserInformation({
            mail: props.userInformation.mail,
            locationAccept: props.userInformation.locationAccept,
            coord: {
                latitude: props.userInformation.coord.latitude,
                longitude: props.userInformation.coord.longitude,
                city: props.userInformation.coord.city
            },
            id: props.userInformation.id,
            services: {
                spotifyId: props.userInformation.spotifyId,
                googleId: props.userInformation.googleId,
                twitterId: props.userInformation.twitterId,
                twitchId: props.userInformation.twitchId,
                stravaId: props.userInformation.stravaId
            },
            ip: event.target.value
        })
    }

    /**
     * It returns a form with an email input, a password input, a button to submit
     * the form, and a link to change the authentication mode
     * @function signInPage
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
                        <input style={{ color: color, display: "block", margin: "auto" }} type="text" defaultValue={props.userInformation.ip} placeholder="IP du server" onChange={updateIP} />
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
                        <div className="error-text">{(isBadPassord) ? "L'utilisateur ou le mot de passe est invalide." : ""}</div>
                        <CenterButton text="Se connecter" />
                        <div className="text-center" style={{ marginTop: 20 }}>
                            Pas encore de compte ?  {"  "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                S'inscrire
                            </span>
                            <AuthButton text="Facebook" action={ onLoginFacebook } />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    /**
     * It returns a form with a logo, a title, three inputs, a button and a link
     * to the login page
     * @function signUpPage
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
                        <input style={{ color: color, display: "block", margin: "auto" }} type="text" defaultValue={props.userInformation.ip} placeholder="IP du server" onChange={updateIP} />
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
                                placeholder={confirmPlaceHolder}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="error-text">{(isPasswordDifferent) ? "Les mots de passes sont différents." : ""}</div>
                        <CenterButton text="S'inscrire" />
                        <div className="text-center">
                            Déjà un compte ?{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                Se connecter
                            </span>
                            <AuthButton text="Facebook" action={ onLoginFacebook } />
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