/**
 * Sign in view component for ohana!'s webapp. Uses Firebase for user authentication.
 */

import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import constants from "./Constants";
import "firebase/auth";

import Header from "./Header";


export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push('/view/roommates')
            }
        })
    }

    componentWillUnmount() {
        this.authUnsub();
    }

    handleSubmit(evt) {
        evt.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(err => this.setState({ fberror: err }))
    }

    render() {
        return (
            <div>
                <Header/>
                <main>
                    <h2 className="sloganS"><span className="thicker">sign in</span> to manage tasks</h2>
                    <div className="test">
                        <div id="cred">
                            <div id="uhh"></div>
                            <form onSubmit={evt => this.handleSubmit(evt)}>
                                <h2 id="username">amazon email</h2>
                                <input type="Email" className="textBox form-control form-control-sm p-1" value={this.state.email} 
                                onInput={evt => this.setState({ email: evt.target.value })}/>
                                <h2 id="password">password</h2>
                                <input type="Password" className="textBox form-control form-control-sm p-1" value={this.state.password} 
                                onInput={evt => this.setState({ password: evt.target.value })}/>
                                {
                                    this.state.fberror ?
                                        <div className="alert alert-danger">
                                            invalid email or password
                                        </div> :
                                        undefined
                                }
                                <div className="row mx-auto">
                                    <button className="btn btn-primary signin" type="submit">sign in</button>
                                </div>
                                <h2 className="signup">Don't have an account? <Link to={constants.routes.signup} className="text-white"><u>sign up</u></Link></h2>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

