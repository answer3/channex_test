import React, { Component } from "react";
import {FormInvalidMsg} from "../util/const";
import {signup} from "../api/apiRequests";

const defaultFormErrors = {
    email: '',
    name: '',
    password: '',
    password_confirmation: ''
}

class Signup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fields: {
                email: '',
                name: '',
                password: '',
                password_confirmation: '',
            },
            formValid: true,
            formErrors: defaultFormErrors
        }
    }

    handleInput = (e) => {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({fields});
    }

    handleSubmit = () => {
        const errors = this.validate();
        const isValid = Object.keys(errors).length === 0;
        isValid ? this.signupRequest() : this.setValidationState(isValid, !isValid ? errors : defaultFormErrors);
    }

    setValidationState = (isValid, errors) => {
        let formState = this.state;
        formState.formValid = isValid;
        formState.formErrors = !isValid ? errors : defaultFormErrors
        this.setState(formState);
    }

    setRequestErrors = (responseDetails) => {
        let errors = {};
        Object.keys(responseDetails).map((field, index) => {
            errors = Object.assign({[field]:responseDetails[field].join(', ')}, errors)
        })
        this.setValidationState(false, errors)
    }

    signupRequest = () => {
        signup(this.state.fields)
            .then(res => {
                const status = res.status;
                switch (status) {
                    case 200:
                        alert('Success');
                        this.setValidationState(true, defaultFormErrors)
                        break;
                    case 422:
                        res.data.errors.code === 'validation_error'
                            ? this.setRequestErrors(res.data.errors.details)
                            : (() => {
                                alert(res.data.errors.title);
                                this.setValidationState(false, defaultFormErrors)
                            })()
                        break;
                    case 500:
                        alert('Internal server error');
                        break;
                    case 404:
                        alert('Request error');
                        break;
                    default:
                        (() => {
                            alert(res.data.errors.title);
                            this.setValidationState(false, defaultFormErrors)
                        })()
                        break;
                }
            })
            .catch(error => {
                alert(error.message)
            })
    }

    confirmPassword  = (password, confirm) => {
        return password.localeCompare(confirm) === 0;
    }

    validate = () => {
        let errors = {};
        const inputs = this.state.fields;
        Object.keys(inputs).map((field, index) => {
            const value = inputs[field]
            errors = !this.validateField(field, value)
                ? Object.assign({[field]:FormInvalidMsg[field]}, errors)
                : Object.assign({}, errors)
        });
        errors = !this.confirmPassword(inputs.password, inputs.password_confirmation)
            ? Object.assign({password_confirmation: FormInvalidMsg.password_confirmation})
            : Object.assign({}, errors)
        return errors
    }

    validateField = (name, value) => {
        switch(name){
            case 'email':
                return value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                break;
            case 'name':
                return value.trim().length > 0;
                break;
            case 'password':
                return value.trim().length >= 8;
                break;
        default:
            return true;
            break;
        }
    }

    getErrorMessage = (inputName) => {
        return this.state.formErrors.hasOwnProperty(inputName) && this.state.formErrors[inputName].length > 0
            ? this.state.formErrors[inputName]
            : ''
    }

    getInputClass = (inputName) => {
        return this.state.formErrors.hasOwnProperty(inputName) && this.state.formErrors[inputName].length > 0
            ? 'form-control input-error'
            : 'form-control'
    }

    render() {
        return (
        <form className="form-signin">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input type="email" autoComplete="off" id="email" name="email" value={this.state.fields.email} onChange={this.handleInput} className={this.getInputClass('email')} autoComplete="off" placeholder="&#xf003;  Email" />
            <p className="error-message">{this.getErrorMessage('email')}</p>

            <label htmlFor="name" className="sr-only">Name</label>
            <input type="text" id="name" name="name" autoComplete="off" value={this.state.fields.name} onChange={this.handleInput} className={this.getInputClass('name')} placeholder="&#xf2c0;  Name" />
            <p className="error-message">{this.getErrorMessage('name')}</p>

            <label htmlFor="password" className="sr-only">Password</label>
            <input type="password" id="password" name="password" autoComplete="off" value={this.state.fields.password} onChange={this.handleInput} className={this.getInputClass('password')} placeholder="&#xf023;  Password" />
            <p className="error-message">{this.getErrorMessage('password')}</p>

            <label htmlFor="passwordConfirm" className="sr-only">Password Confirmation</label>
            <input type="password" id="passwordConfirmation" name="password_confirmation" autoComplete="off" value={this.state.fields.password_confirmation} onChange={this.handleInput} className={this.getInputClass('password_confirmation')} placeholder="&#xf023;  Password Confirmation" />
            <p className="error-message">{this.getErrorMessage('password_confirmation')}</p>

            <input className="btn btn-primary btn-block" type="button" onClick={this.handleSubmit} value="&#xf023;  Sign in" />
        </form>
        )
    }
}

export default Signup