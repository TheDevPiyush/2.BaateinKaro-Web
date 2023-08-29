import React from 'react'
import { auth, db } from './Firebase'
import { Offline, Online } from "react-detect-offline";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, onSnapshot, doc, deleteDoc, limit } from 'firebase/firestore'
import './Login'
import './Home.css'

import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
let name
const dataBaseConnection = collection(db, "post")



class Home extends React.Component {

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
            time: null,
            ChildKey: 0,
            imgURL: null,
            confirmwindow: false,
            deleteconfirmwindow: false,
            logoutconfirm: false,
            deleteconfirm: false,
            thepostid: "",
            counter: 1
        }
        this.chatContainerRef = React.createRef();
    }

    submitpost = async (event, id) => {
        event.preventDefault()
        const currentDate = new Date();

        const hours = currentDate.getHours();
        const isAM = hours >= 0 && hours < 12;
        const meridiem = isAM ? 'AM' : 'PM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');

        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString().slice(-2);

        const formatTime = `${formattedHours}:${minutes} ${meridiem}`
        const formatDate = `${day}-${month}-${year}`;


        if (!this.state.postText.length <= 0) {
            try {
                this.setState({ msgid: this.state.msgid + 1 })
                await addDoc(dataBaseConnection, { post: this.state.postText, author: auth.currentUser.displayName, id: auth.currentUser.uid, msgidno: serverTimestamp(), email: auth.currentUser.email, msgTime: formatTime, msgDate: formatDate })
                document.getElementById("inputbox").value = ""
                this.setState({ postText: "" })
                this.setState({ letId: auth.currentUser.uid })
                console.log(this.state.imgURL)
                this.showPost()


            }
            catch {
                setTimeout(() => {
                    this.setState({ PostError: false })
                }, 1500);
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

        if (localStorage.getItem("loginData") === "false") {
            setTimeout(() => {
                this.props.history.push("/")

            }, 1500);
        }
        this.scrollToBottom()

    }



    scrollToBottom = () => {
        try {
            this.chatContainerRef.current.scrollTop = this.chatContainerRef.current.scrollHeight;
        }
        catch (error) {
            console.log("hello")
        };
    }



    logOut = () => {


        this.setState({ confirmwindow: false })
        this.props.history.push("/")
        localStorage.setItem("loginData", "false")
        localStorage.setItem("rememberMe", "no")

    }


    getmessgae = onSnapshot(dataBaseConnection, () => {

        this.showPost()
        setTimeout(() => {
        }, 500);
    })

    showPost = async () => {

        try {
            const q = query(dataBaseConnection, orderBy("msgidno", "desc"), limit(50))
            const data = await getDocs(q)
            this.setState({ showPostState: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) })
            name = auth.currentUser.displayName
            this.setState({ FailAlert: false })
            this.setState({ postStatus: true })
            this.setState({ imgURL: auth.currentUser.photoURL })
            this.scrollToBottom()

        }
        catch (error) {
            setTimeout(() => {
                this.setState({ FailAlert: false })
            }, 1500);
            this.setState({ FailAlert: true })
        }
    }

    deleteDoc = async (text) => {
        await deleteDoc(doc(db, "post", text));
        this.setState({ deleteconfirmwindow: false })

    }
    handleclick = (id) => {
        this.setState({ thepostid: id })
        this.setState({ deleteconfirmwindow: true })

    }

    render() {
        return (
            <>
                {
                    this.state.confirmwindow &&

                    <div className="topLayer">
                        <div className="messageBox">
                            <div className="text">Do you want to Logout?</div>
                            <div className="btnnn">
                                <div className="yesBtn" onClick={this.logOut}>OK</div>
                                <div className="noBtn" onClick={() => { this.setState({ confirmwindow: false }) }}>Cancel</div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.deleteconfirmwindow &&

                    <div className="topLayer">
                        <div className="messageBox">
                            <div className="text">Delete this message for everyone?</div>
                            <div className="btnnn">
                                <div className="yesBtn" onClick={() => { this.deleteDoc(this.state.thepostid) }}>OK</div>
                                <div className="noBtn" onClick={() => { this.setState({ deleteconfirmwindow: false }) }}>Cancel</div>
                            </div>
                        </div>
                    </div>
                }


                <audio id="myAudio1">
                    <source src="./Assets/1.wav" type="audio/wav" />
                </audio>
                <audio id="myAudio2">
                    <source src="./Assets/2.mp3" type="audio/mp3" />
                </audio>
                <div className="main">
                    <div className="headingDiv">

                        <div className="heading">
                            <div className="pic">
                                <img id='dp' src={this.state.imgURL} alt="" />
                                <Online>
                                    <div className='active' id="active"></div>

                                </Online>
                                <Offline>
                                    <div className='unactive' id="active"></div>
                                </Offline>
                            </div>
                            <Offline>
                                <div className="offline">
                                    You appear to be offline at the moment!
                                </div>
                            </Offline>

                            <div className="UserName">
                                {name}
                            </div>
                            <div className="logout">
                                <i className="fa fa-power-off" onClick={() => { this.setState({ confirmwindow: true }) }} aria-hidden="true"></i>
                            </div>
                        </div>
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

                    {this.state.postStatus === true &&
                        <div className="Messageparent">

                            <div ref={this.chatContainerRef} id='mainMessageContainer' className="showing-posts container">
                                {this.state.showPostState.map((post) => {
                                    return <>
                                        {
                                            (name === post.author)
                                                ?
                                                <div className="messageOwner" key={post.id} id='messageowner'>

                                                    <div className="nametime">
                                                        <div className="name">
                                                            Me
                                                        </div>
                                                        <div className="time">
                                                            {post.msgTime} {post.msgDate}
                                                            <span id='delete'>
                                                                <i style={{ cursor: "pointer" }} onClick={() => { this.handleclick(post.id) }} className="fa fa-trash" aria-hidden="true"></i>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="msgcontent">
                                                        {post.post}
                                                    </div>
                                                </div>
                                                :
                                                <div className="messageGot" key={post.id}>
                                                    <div className="nametime">
                                                        <div className="name">
                                                            {post.author}
                                                        </div>
                                                        <div className="time">
                                                            {post.msgTime} {post.msgDate}
                                                        </div>
                                                    </div>

                                                    <div className="msgcontent">
                                                        {post.post}
                                                    </div>
                                                </div>
                                        }
                                    </>

                                })

                                }


                            </div>
                            <div className="inputdiv">
                                <input type="text" onChange={(e) => { this.setState({ postText: e.target.value }) }} id='inputbox' placeholder='Type something...' />

                                <div className="send"><i onClick={this.submitpost} className="fa-solid fa-paper-plane"></i></div>
                            </div>
                        </div>}


                    {this.state.postStatus === false && 
                    <div className="nopost text-center">
                        <div className="my-3 fs-4 lodingText fw-bold">Loading Chats...</div>
                        <div className="spinner-border text-light my-3" style={{ "width": "3rem", "height": "3rem" }} role="status">
                        </div>
                    </div>}

                </div >

            </>
        )
    }
}

export default withRouter(Home)
