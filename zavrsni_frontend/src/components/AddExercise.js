import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class AddExercise extends React.Component {
    constructor() {
        super();
        this.state = {
            naziv: "",
            namjena: "",
            valuta: "",
            pokreni: "",
            idzadataka: "",
            back: false,
            addingError: false,
            errorText: ""
        }
        this.return = this.return.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event) {
        event.preventDefault()
        let exercise = {
            naziv: this.state.naziv,
            namjena: this.state.namjena,
            valuta: this.state.valuta,
            pokreni: this.state.pokreni,
            idzadataka: this.state.idzadataka
        }
        console.log(exercise)
        axios.post(URL + '/teacherProfile/addExercise', exercise, { withCredentials: false })
            .then(response => {
                if (response.data.addingError === undefined) {
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

    return() {
        this.setState({
            back: true
        })
    }

    render() {
        if (this.state.back)
            return <Navigate to='/teacherProfile' />

        const purpose = []
        purpose.push(<option key={0} value={'ISPIT'}>ISPIT</option>)
        purpose.push(<option key={1} value={'VJEZBA'}>VJEŽBA</option>)
        purpose.push(<option disabled key={2} value={'default'}>Odaberi namjenu</option>)

        const currency = []
        currency.push(<option key={0} value={'KUNA'}>KUNA</option>)
        currency.push(<option key={1} value={'EURO'}>EURO</option>)
        currency.push(<option disabled key={2} value={'default'}>Odaberi valutu</option>)

        const choose = []
        choose.push(<option key={0} value={'1'}>DA</option>)
        choose.push(<option key={1} value={'0'}>NE</option>)
        choose.push(<option disabled key={2} value={'default'}>Odaberi DA ili NE</option>)

        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h3 className="text-center font">Dodaj vježbu</h3>
                <form onSubmit={this.handleSubmit} className="w-100 container pozadina">
                    <div className="row justify-content-md-center">
                        <div className="form-group">
                            <label>Naziv vježbe</label>
                            <input type="text" name="naziv" value={this.state.naziv} className="form-control" placeholder="Enter name" onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group">
                            <label>Namjena</label>
                            <select defaultValue={'default'} name="namjena" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                {purpose}
                            </select>
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group">
                            <label>Valuta u zadacima</label>
                            <select defaultValue={'default'} name="valuta" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                {currency}
                            </select>
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group">
                            <label>Odabrat ovu vježbu za rješavanje?</label>
                            <select defaultValue={'default'} name="pokreni" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                {choose}
                            </select>
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="form-group">
                            <label>Unesite ID zadataka koje želite u vježbi odvojene sa ","</label>
                            <input type="text" name="idzadataka" value={this.state.idzadataka} className="form-control" placeholder="1,2,3" onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="my-2 col-md-12 text-center">
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

export default AddExercise;