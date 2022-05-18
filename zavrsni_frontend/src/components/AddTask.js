import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/login.css'
import { Navigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import Image from '../images/money.jpg';
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class AddTask extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            vrsta: "",
            pitanje: "",
            tocanOdg: "",
            odgovor2: "",
            odgovor3: "",
            odgovor4: "",
            novacZaPrikaz: "",
            hint: "",
            tipNovca: "",
            back: false,
            addingError: false,
            errorText: ""
        }
        this.return = this.return.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTaskChoose = this.handleTaskChoose.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault()
        let task = {
            id: this.state.id,
            vrsta: this.state.vrsta,
            pitanje: this.state.pitanje,
            tocanOdg: this.state.tocanOdg,
            hint: this.state.hint,
            odgovor2: this.state.odgovor2,
            odgovor3: this.state.odgovor3,
            odgovor4: this.state.odgovor4,
            novacZaPrikaz: this.state.novacZaPrikaz,
            tipNovca: this.state.tipNovca
        }
        axios.post(URL + '/teacherProfile/addTask', task, { withCredentials: false })
            .then(response => {
                if (response.data.addingError === undefined) {
                    this.setState({
                        addingError: false,
                    })
                    console.log(response.status)
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

    handleTaskChoose(event) {
        const value = event.target.value
        this.setState({
            vrsta: value,
        })
    }

    return() {
        this.setState({
            back: true
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

        const typeOfMoney = []
        typeOfMoney.push(<option key={0} value={'NOVCANICA'}>NOVČANICA</option>)
        typeOfMoney.push(<option key={1} value={'KOVANICA'}>KOVANICA</option>)
        typeOfMoney.push(<option key={2} value={'OBOJE'}>OBOJE</option>)
        typeOfMoney.push(<option disabled key={3} value={'default'}>Odaberi tip novca</option>)

        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={background}>
                <h3 className="font text-center">Dodaj zadatak</h3>
                <form onSubmit={this.handleSubmit} className="w-100 container pozadina">
                    <div className="row justify-content-center">
                        <div className="form-group col-lg-3">
                            <label>ID zadatka:</label>
                            <input type="text" name="id" value={this.state.id} className="form-control" placeholder="Enter task ID" onChange={this.handleChange} required />
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <label className="mt-2 text-center font-weight-bold">Vrsta zadatka:</label>
                        <div className="form-group d-flex justify-content-around my-3" onChange={this.handleTaskChoose}>
                            <input type="radio" className="btn-check" name="vrsta" id="odabir" value="odabir" autoComplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="odabir">Odabir više ponuđenih odgovora</label>

                            <input type="radio" className="btn-check" name="vrsta" id="unos" value="unos" autoComplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="unos">Pitanje s unosom</label>

                            <input type="radio" className="btn-check" name="vrsta" id="slikovnoUnos" value="slikovnoUnos" autoComplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="slikovnoUnos">Slikovno pitanje s unosom</label>

                            <input type="radio" className="btn-check" name="vrsta" id="slikovnoOdabir" value="slikovnoOdabir" autoComplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="slikovnoOdabir">Slikovno pitanje s odabirom</label>
                        </div>
                    </div>

                    {this.state.vrsta === "slikovnoOdabir" &&
                        <p className="text-center text-white bg-dark">
                            KOD OVAKVIH PITANJA ĆE BITI PRIKAZANE SLIKE ŽELJENIH NOVČANICA ILI KOVANICA KOJE ĆE UČENIK MOĆI BIRATI DA UNESE TRAŽENU VRIJEDNOST
                        </p>
                    }

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg">
                            <label>Pitanje</label>
                            <textarea required name="pitanje" value={this.state.pitanje} className="form-control" placeholder="Enter the question" onChange={this.handleChange}></textarea>
                        </div>
                    </div>

                    {this.state.vrsta === "slikovnoOdabir" &&
                        <div className="form-group col-lg">
                            <label>Tip novca za prikaz</label>
                            <select defaultValue={'default'} name="tipNovca" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                {typeOfMoney}
                            </select>
                            {//<input type="text" name="tipNovca" value={this.state.tipNovca} className="form-control" placeholder="NOVCANICA ili KOVANICA ili OBOJE" onChange={this.handleChange} required />
                            }</div>
                    }

                    {this.state.vrsta === "slikovnoUnos" &&
                        <div className="row justify-content-md-center">
                            <div className="form-group col-lg">
                                <label>Novac za prikaz u obliku: brojValuta,</label>
                                <input type="text" name="novacZaPrikaz" value={this.state.novacZaPrikaz} className="form-control" placeholder="20kn,50lp,10kn" onChange={this.handleChange} />
                            </div>
                        </div>
                    }

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg">
                            <label>Točan odgovor</label>
                            <textarea required name="tocanOdg" value={this.state.tocanOdg} className="form-control" placeholder="Enter correct answer" onChange={this.handleChange}></textarea>
                        </div>
                    </div>

                    {this.state.vrsta === "odabir" &&
                        <div>
                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Drugi odgovor</label>
                                    <textarea required name="odgovor2" value={this.state.odgovor2} className="form-control" placeholder="Enter second answer" onChange={this.handleChange}></textarea>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Treći odgovor</label>
                                    <textarea required name="odgovor3" value={this.state.odgovor3} className="form-control" placeholder="Enter third answer" onChange={this.handleChange}></textarea>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Četvrti odgovor</label>
                                    <textarea required name="odgovor4" value={this.state.odgovor4} className="form-control" placeholder="Enter fourth answer" onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="row justify-content-md-center">
                        <div className="form-group col-lg">
                            <label>Pomoć pri rješavanju (HINT)</label>
                            <textarea required name="hint" value={this.state.hint} className="form-control" placeholder="Enter task hint" onChange={this.handleChange} ></textarea>
                        </div>
                    </div>

                    <div className="col-md-12 text-center my-2">
                        <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Dodaj</button>
                        <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                    </div>
                </form>
                {this.state.addingError &&
                    <div className="mt-3"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
            </div>
        );
    }
}

export default AddTask;