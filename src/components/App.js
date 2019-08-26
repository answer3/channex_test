import React, { Component } from "react";
import Signup from "./Signup";
import FooterSignup from "./FooterSignup";
import {LOGO_URL} from "../util/const";
import '../styles/App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    render() {
        return (
            <div>
                <img className="mb-4" src={LOGO_URL} alt="Logo" width="200" height="50"/>
                <div className="form-header">
                    <p className="font-weight-bold">Sign up</p>
                </div>
                <Signup />
                <FooterSignup />
            </div>
        );
    }
}

export default App;