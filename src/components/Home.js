import React, { Component } from 'react'
import { auth, db } from './Firebase'
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'

let name

const dataBaseConnection = collection(db, "post")
export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            logouttt: false,
            postText: "",
            showPostState: [],
            letId: null,
            FailAlert: false,
            FailAlertText: "There seems to be an internal error right now. We are working to solve it.",
            PostError: false,
            postAlertText: "Make sure you're connected to the Internet",
            postStatus: false,
        }
    }
    submitpost = async (event, id) => {
        event.preventDefault()

        if (!this.state.postText.length <= 0) {
            try {
                this.setState({ msgid: this.state.msgid + 1 })
                await addDoc(dataBaseConnection, { post: this.state.postText, author: auth.currentUser.displayName, id: auth.currentUser.uid, msgidno: serverTimestamp(), email: auth.currentUser.email })
                document.getElementById("textarea").value = ""
                this.setState({ postText: "" })
                this.setState({ letId: auth.currentUser.uid })
                this.showPost()
            }
            catch {
                this.setState({ PostError: true })
            }

        }
        else {
            alert("Message cannot be empty")
        }
    }
    async componentDidMount() {
        document.title = "Baatein Karoo || Home"
        this.showPost()
        setInterval(() => {
            this.showPost()
        }, 4000);
    }

    showPost = async () => {
        try {
            const q = query(dataBaseConnection, orderBy("msgidno", "desc"), limit(7))
            const data = await getDocs(q)
            this.setState({ showPostState: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) })
            name = auth.currentUser.displayName

            this.setState({ FailAlert: false })
            this.setState({ postStatus: true })
        }
        catch (error) {
            this.setState({ FailAlert: true })
        }
    }

    render() {
        return (
            <>
                <div className="main">
                    <div className="text-center my-3 container rounded-4 text-white fs-3 bg-primary py-3 fw-bold">
                        Welcome {name}
                        {this.state.FailAlert === false && <div className="spinner-grow mx-3 text-white" role="status">
                        </div>}
                    </div>

                    {this.state.FailAlert === true && <div className="container">
                        <div className="alert text-center alert-danger fs-5" role="alert">
                            <i className="fa fa-info-circle mx-3" aria-hidden="true"></i>
                            <strong>{this.state.FailAlertText}</strong>
                        </div>
                    </div>}
                    {this.state.PostError === true && <div className="container">
                        <div className="alert text-center alert-danger fs-5" role="alert">
                            <i className="fa fa-info-circle mx-3" aria-hidden="true"></i>
                            <strong>{this.state.postAlertText}</strong>
                        </div>
                    </div>}

                    {this.state.postStatus === true && <div className="showing-posts container border border-3 rounded-3 border-dark" style={{ "height": "400px", "overflowY": "auto", "backgroundColor": "#a0ffe9" }}>
                        {this.state.showPostState.map((post) => {
                            return <>
                                {<div className="ok" >
                                    <div className=" container bg-info rounded-4 py-1 border border-3 border-dark my-1">

                                        <div style={{ "color": "white" }} className="author ">
                                            <u >{post.author}</u>
                                        </div>

                                        <div className="post text fw-bold fs-4" style={{ "fontFamily": "consolas", "color": "black" }}>
                                            {post.post}
                                        </div>

                                    </div>
                                </div>}
                            </>
                        })}
                    </div>}

                    {this.state.postStatus === false && <div className="nopost text-center">
                        <div className="my-2 fs-4 fw-bold">Loading Messages. Please wait...</div>
                        <div className="spinner-border text-primary my-2" style={{ "width": "3rem", "height": "3rem" }} role="status">
                        </div>
                    </div>}

                    <div className="my-5 border border-3 container border-dark px-4 py-3 fs-5" style={{ "backgroundColor": "lightcyan", "borderWidth": "5px", "borderColor": "black", "borderRadius": "20px" }}>
                        <form>
                            <div className="mb-3">
                                <textarea style={{ "fontFamily": "serif", "resize": "none" }} onChange={(event) => { this.setState({ postText: event.target.value }) }} type="text" placeholder='Type your message' className="form-control py-3 fs-4" id="textarea" />
                            </div>
                            <div className="text-center "><button type="submit" onClick={this.submitpost} className="btn btn-primary my-3 py-2 fs-5 fw-bold">Send</button></div>
                        </form>
                    </div>



                </div>

            </>
        )
    }
}
