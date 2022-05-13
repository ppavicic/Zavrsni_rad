import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from '../images/money.jpg';
import { Navigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class LoginTeacher extends React.Component {

    constructor() {
        super()
        this.state = {
            username: "",
            lozinka: "",
            startRedirect: false,
            loginError: false,
            errorText: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.start = this.start.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event) {
        event.preventDefault()
        let user = {
            korisnickoime: this.state.username,
            lozinka: this.state.lozinka
        }
        axios.post(URL + '/loginTeacher', user, { withCredentials: false })
            .then(response => {
                if (response.data.loginError !== undefined) {
                    this.setState({
                        loginError: true,
                        errorText: response.data.loginError
                    })
                } else {
                    const user = {
                        "username": response.data.username,
                        "role": "ucitelj",
                        "skola": response.data.skola,
                    }
                    sessionStorage.setItem('loginToken', JSON.stringify(user))
                    this.setState({
                        loginError: false,
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }

    start() {
        this.setState({
            startRedirect: true
        })
    }

    render() {
        if (this.state.startRedirect)
            return <Navigate to='/' />

        if (sessionStorage.getItem('loginToken') !== null) {
            var obj = JSON.parse(sessionStorage.getItem('loginToken'));
            if (obj.role === 'ucitelj') {
                return <Navigate to='/teacherProfile' />
            } else {
                return <Navigate to='/' />
            }
        }

        var background = {
            backgroundImage: `url()`,
            backgroundPosition: 'center',
            backgroundSize: '100% ',
            backgroundRepeat: 'no-repeat'
        }
        return (
            <div className=" d-flex flex-column justify-content-center align-items-center" style={background}>
                <h3>Prijava</h3>
                <form onSubmit={this.handleSubmit} className="w-100 container">
                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg-3">
                            <label>Korisničko ime</label>
                            <input type="text" name="username" value={this.state.username} className="form-control" placeholder="Enter username" onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg-3">
                            <label>Lozinka</label>
                            <input type="password" name="lozinka" value={this.state.lozinka} className="form-control" placeholder="Enter password" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="col-md-12 text-center">
                        <button type="submit" className="col btn btn-primary btn-block btn-success mt-2">Prijavi se</button>
                        <button className="col btn btn-primary btn-block btn-danger mt-2" onClick={this.start}>Povratak</button>
                    </div>
                    {this.state.loginError &&
                        <div className="mt-3"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
                </form>
            </div>
        );
    }
}

export default LoginTeacher;