import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import Image from '../images/money.jpg';
import { Table, Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class AddStudent extends React.Component {
    constructor() {
        super();
        this.state = {
            ime: "",
            prezime: "",
            idRazreda: "",
            razredi: [],
            back: false,
            addingError: false,
            errorText: ""
        }
        this.return = this.return.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getClasses = this.getClasses.bind(this)
    }
    componentDidMount() {
        this.getClasses();
    }

    async handleSubmit(event) {
        event.preventDefault()
        let user = {
            ime: this.state.ime,
            prezime: this.state.prezime,
            idRazreda: this.state.idRazreda
        }
        console.log(user)
        axios.post(URL + '/teacherProfile/addStudent', user, { withCredentials: false })
            .then(response => {
                if (response.data.addingError === undefined) {
                    console.log(response.status)
                    this.setState({
                        addingError: false
                    })
                    window.location = "/teacherProfile"
                } else {
                    this.setState({
                        addingError: true,
                        errorText: response.data.addingError
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

    return() {
        this.setState({
            back: true
        })
    }

    getClasses() {
        var skola = sessionStorage.getItem('loginToken').split(',')[2].split(':')[1]
        skola = skola.slice(1, -2)
        let data = {
            skola: skola
        }
        axios.post(URL + '/teacherProfile/getClasses', data, { withCredentials: false })
            .then(response => {
                this.setState({
                    razredi: response.data.classes
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        if (this.state.back)
            return <Navigate to='/teacherProfile' />

        var background = {
            backgroundImage: `url()`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }

        const razredi = this.state.razredi
        const classesList = razredi.map((razred, i) => {
            return (
                <option key={i} value={razred.idrazred}>{razred.odjeljenje}</option>
            )
        }, this
        )
        classesList.push(<option disabled key={-1} value={"default"}>Odaberi razred</option>)

        return (
            <div className=" d-flex flex-column justify-content-center align-items-center" style={background}>
                <h3 className="text-center text-white bg-dark">Dodaj učenika</h3>
                <form onSubmit={this.handleSubmit} className="w-100 container">
                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg-3">
                            <label>Ime</label>
                            <input type="text" name="ime" value={this.state.ime} className="form-control" placeholder="Enter name" onChange={this.handleChange} required />
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg-3">
                            <label>Prezime</label>
                            <input type="text" name="prezime" value={this.state.prezime} className="form-control" placeholder="Enter surname" onChange={this.handleChange} required />
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg-3">
                            <label>Razred</label>
                            <select  defaultValue={'default'} name="idRazreda" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                {classesList}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-12 text-center">
                        <button type="submit" className="col btn btn-primary btn-block btn-success mt-2">Dodaj</button>
                        <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                    </div>
                </form>
                {this.state.addingError &&
                    <div className="mt-3"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
            </div>
        );
    }
}

export default AddStudent;