import React from "react";
import { Link } from "react-router-dom";
import constants from "./Constants";
import firebase from "firebase/app";
import "firebase/auth";
import md5 from "blueimp-md5";

import NameList from "./NameList";
import TaskList from "./TaskList";
import NewUserForm from "./NewUserForm";
import Header from "./Header";


export default class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            channel: "roommates",
        }
    }

    componentDidMount() {
        console.log("main view mounted!");
        // let currentUser = firebase.auth().currentUser;
        this.unlistenAuth = firebase.auth().onAuthStateChanged(currentUser => {
            if (currentUser == null) {
                console.log("current user is NULL");
                this.props.history.push(constants.routes.home);
            } else {
                this.setState({ user: currentUser });
                let hash = md5(currentUser.email);
                this.setState({ userHash: hash })
                // console.log(this.state.user.uid); 

            }
        });
    }

    componentWillUnmount() {
        this.unlistenAuth();
        console.log("main view will unmount");

    }

    handleSignOut() {
        console.log("user signing off!")
        firebase.auth().signOut();
    }

    handleChange() {
        if (this.state.channel == 'tasks') {
            console.log('hey');
            this.props.history.push('/view/roommates');
            this.setState({ channel: 'rommmates' });
        } else {
            console.log('yo');
            this.props.history.push('/view/tasks');
            this.setState({ channel: 'tasks' });
        };
    }

    handleChangeText(tab) {
        if (tab == 'main') {
            return this.state.channel;
        } else {
            if (this.state.channel == 'tasks') {
                return 'roommates';
            } else {
                return 'tasks';
            }
        }
    }

    handleChangeGraphic(tab){
        if(tab == 'main'){
            if(this.state.channel == 'tasks'){
                return {backgroundImage: 'url(/static/media/taskTab.42f108f6.png)'};
            }else{
                return {backgroundImage: 'url(/static/media/userTab.88ed72d3.png)'};
            }
        }else{
            if(this.state.channel == 'tasks'){
                return {backgroundImage: 'url(/static/media/userTab.88ed72d3.png)'};
            }else{
                return {backgroundImage: 'url(/static/media/taskTab.42f108f6.png)'};
            }
        }
    }

    handleChangeSlogan(num){
        if(num == 1){
            if(this.state.channel=='tasks'){
                return 'what will you do?';
            }else{
                return 'who are your roommates?';
            }
        }else{
            if(this.state.channel=='tasks'){
                return 'who will start the task?';
            }else{
                return 'list roommates in order top to bottom';
            }
        }
    }

    handleSloganShrink(){
        if(this.state.channel != 'tasks'){
            console.log('in');
            return {fontSize: '2.1vh'};
        }
    }


    render() {

        let ref;

        if (this.props.match.params.tabName == 'roommates') {
            ref = firebase.database().ref(this.state.userHash + "/" + this.props.match.params.tabName + "/names/");
            // console.log(this.state.user.uid);
            console.log(this.state.userHash);
        } else {
            ref = firebase.database().ref(this.state.userHash + "/" + this.props.match.params.tabName);
        }

        return (
            <div>
                {/* <header className="">
                    <div className="container-fluid">
                        <div className="row justify-content-between">
                            <div className="col-1 align-self-center">
                                <button className="btn btn-outline-danger btn-sm" onClick={this.handleSignOut}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </header> */}
                <header id="logoBox" className="row m-0">
                    <div className="col">
                        <div id='logo' className="">
                            <div id='logoInner'>
                                <div id='logoInnerInner'></div>
                            </div>
                        </div>
                    </div>
                    <div className="col d-flex justify-content-end align-items-center">
                        <div id="signOut" className="">
                            <button className="btn btn-outline-danger btn-sm" onClick={this.handleSignOut}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>
                <div className="container containerView">
                    <div id="tabContainer">
                        <div id="inactiveTab" onClick={() => this.handleChange()}>
                            <div id="hacking"></div>
                            <div id="innerInactive">
                                <div id="graphics" style={this.handleChangeGraphic('inactive')}></div>
                            </div>
                            <div id="tabOverlay"></div>
                        </div>
                        <div id="inactiveText" dangerouslySetInnerHTML={{ __html: this.handleChangeText('inactive') }}></div>
                        <div id="activeText" dangerouslySetInnerHTML={{ __html: this.handleChangeText('main') }}></div>
                        <div id="activeTabBox">
                            <div id="activeTab">
                                <div id="innerActive">
                                    <div id="graphics" style={this.handleChangeGraphic('main')}></div>
                                </div>
                            </div>
                            <div id="activeTabSlogan">
                                <p className="tabSlogan" dangerouslySetInnerHTML={{ __html: this.handleChangeSlogan(1) }}></p>
                                <p className="tabSlogan" style={this.handleSloganShrink()} dangerouslySetInnerHTML={{ __html: this.handleChangeSlogan(2) }}></p>
                            </div>
                        </div>
                    </div>
                    {/*<ul className="nav nav-tabs">
                        <li className = "nav-item">
                        <a 
                            className={this.props.match.params.tabName == 'roommates'?
                            "display-4 nav-link active":
                            "display-4 nav-link"}
                            onClick={() => this.handleChange('roommates')}
                            >Roommates</a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={this.props.match.params.tabName == 'tasks' ?
                                    "display-4 nav-link active" :
                                    "display-4 nav-link"}
                                onClick={() => this.handleChange('tasks')}
                            >Tasks</a>
                        </li>
                    </ul>

                    <main>
                        {this.props.match.params.tabName == 'roommates' ?
                            <NameList roommatesRef={firebase.database().ref(this.state.userHash + "/" + this.props.match.params.tabName + "/names/")} />
                    </ul>*/}

                    <main id="maxSize">
                        {this.props.match.params.tabName == 'roommates' ?
                            <NameList roommatesRef={firebase.database().ref(this.state.userHash + "/" + this.props.match.params.tabName + "/names/")} />
                            :
                            <TaskList taskRef={firebase.database().ref(this.state.userHash + "/" + this.props.match.params.tabName)}
                                hash={this.state.userHash} />
                        }
                        {/* <NewUserForm roommatesRef={this.state.roommatesRef}/> */}

                    </main>
                </div>
            </div>
        )
    }
}