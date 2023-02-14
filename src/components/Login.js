import React, { Component } from 'react'
import { auth, provider } from './Firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: null,
            email: null,
            emailForInput: null,
            showRegister: false,
            password: null,
            isLoggedin: false,
            MustBeAlwaysFalse: false,
            FailAlert: false
        }
    }


    submitTwo = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                this.setState({ isLoggedin: true })
                const user = result.user;
                setTimeout(() => {
                    this.props.navigate("/home")
                    localStorage.setItem("loginData", this.state.isLoggedin)
                }, 1500);
                this.setState({ name: user.displayName, email: user.email })

            }).catch(() => {
                this.setState({ FailAlert: true })
                setTimeout(() => {
                    this.setState({ FailAlert: false })
                }, 4000);
            });
    }
    componentDidMount() {
        document.title = "Baatein Karoo || Log In"
        if (localStorage.getItem("loginData") === "true") {
            this.setState({ isLoggedin: true })
            setTimeout(() => {
                this.props.navigate("/home")
            }, 1000);
        }
        else{
            this.setState({ isLoggedin: false })
        }
    }
    render() {
        return (
            <div className="text-center my-5">
                {this.state.FailAlert === true && <div className="container">
                    <div className="alert alert-danger fs-5" role="alert">
                        <i className="fa fa-info-circle mx-3" aria-hidden="true"></i>
                        <strong>Login process was interupted. Try again</strong>
                    </div>
                </div>}

                {this.state.isLoggedin === true && <div className="spin my-5">
                    <div className="my-2 fs-4 fw-bold">Logging in. Please wait...</div>
                    <div className="spinner-border text-primary my-2" style={{ "width": "3rem", "height": "3rem" }} role="status">
                    </div>
                </div>}

                {this.state.isLoggedin === false && <div className="loginbloack">
                    <div className="unlogged">
                        <h2>Baatein Karoo!!</h2>
                        <div className="text-center container my-5 fs-4" >
                            Log in using your Google Account to continue. It's safe, because we are using <a rel="noreferrer" target="_blank" href='https://firebase.google.com'>Google Services</a> to Authenticate your credentials. <br /> 
                            <strong>
                                You will be logged in automatically from next time.
                            </strong>
                        </div>
                        <div className="my-5">

                            <button type="button" onClick={this.submitTwo} className="login-with-google-btn fs-6" >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

export function MainApp() {
    const navigate = useNavigate()
    return (<Login navigate={navigate}></Login>)
}