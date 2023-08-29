import React from 'react'
import { auth, provider, db } from './Firebase'
import { signInWithPopup } from 'firebase/auth'
import { withRouter } from 'react-router-dom'
import './Login.css'
import { addDoc, collection, query, where } from 'firebase/firestore'

const userData = collection(db, "users")

class Login extends React.Component {
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
            FailAlert: false,
            rememberMe: false
        }
    }


    submitTwo = async () => {
        await signInWithPopup(auth, provider)
            .then((result) => {
                this.setState({ isLoggedin: true })
                const user = result.user;
                const q = query(userData, where("id", "==", auth.currentUser.uid))

                if (!q) {
                    addDoc(userData, {
                        username: user.displayName,
                        email: user.email,
                        id: user.uid
                    })
                }

                setTimeout(() => {
                    localStorage.setItem("loginData", this.state.isLoggedin)
                    this.props.history.push("/home")

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

        if (localStorage.getItem("rememberMe") === "yes") {
            if (localStorage.getItem("loginData") === "true") {
                this.setState({ isLoggedin: true })
                this.props.history.push("/home")
            }
        }
    }


    checkbox = () => {
        var box = document.getElementById("checkbox")

        box.addEventListener("change", () => {
            if (box.checked) {
                console.log("yesss")
                localStorage.setItem("rememberMe", "yes")
            }
            if (!box.checked) {
                console.log("No")
                localStorage.setItem("rememberMe", "no")
            }
        })
    }

    render() {
        return (
            <div className="text-center">


                {this.state.isLoggedin === true && <div className="spin my-5">
                    <div className="my-2 fs-4 fw-bold">Logging in. Please wait...</div>
                    <div className="spinner-border text-primary my-2" style={{ "width": "3rem", "height": "3rem" }} role="status">
                    </div>
                </div>}

                {this.state.isLoggedin === false && <div className="loginbloack">
                    <div className="unlogged">
                        <div id='title'>Baatein Karoo!!</div>
                        <div className="mian">
                            {this.state.FailAlert === true && <div className="container my-3">
                                <div className="alert alert-danger fs-6 " role="alert">
                                    <i className="fa fa-info-circle mx-3" aria-hidden="true"></i>
                                    <strong>Login process was interupted. Try again</strong>
                                </div>
                            </div>}

                            <div className="text-center container logintext" >
                                Log in using your Google Account.
                            </div>
                                <span id='contact'><a href="mailto:contactpiyushhere@gmail.com" rel="noreferrer"><strong>Developer</strong><i class="fa fa-envelope" aria-hidden="true"></i> </a></span>

                            <div className="my-5 btnbox">

                                <button type="button" onClick={this.submitTwo} className="login-with-google-btn fs-6" >
                                    Sign in with Google
                                </button>
                                <div className="inputcheck">

                                    <input onClick={this.checkbox} type="checkbox" name="Remember Me" id="checkbox" />
                                    <label id='label' htmlFor="checkbox">Remember_Me!</label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>}
            </div>
        )
    }
}

export default withRouter(Login)
