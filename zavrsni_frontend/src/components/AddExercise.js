import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
import Popup from "./Popup";
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
            errorText: "",
            showPopup: false,
            tasks: [],
            checked: {}
        }
        this.return = this.return.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.toggleTasks = this.toggleTasks.bind(this)
        this.getTasks = this.getTasks.bind(this)
    }

    componentDidMount() {
        this.getTasks()
    }

    getTasks() {
        axios.get(URL + '/teacherProfile/getTasks', { withCredentials: false })
            .then(response => {
                var zadaci = {}
                for (let i = 0; i < response.data.tasks.length; i++) {
                    zadaci[response.data.tasks[i].idzad] = false
                }
                this.setState({
                    tasks: response.data.tasks,
                    checked: zadaci
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async handleSubmit(event) {
        event.preventDefault()
        var odabraniZadaci = this.state.checked
        var idzadataka = ""
        for(var key in odabraniZadaci){
            if(odabraniZadaci[key] === true){
                idzadataka = idzadataka + key + ","
            }
        }
        idzadataka = idzadataka.slice(0, -1) //ukloni zadnji zarez
        let exercise = {
            naziv: this.state.naziv,
            namjena: this.state.namjena,
            valuta: this.state.valuta,
            pokreni: this.state.pokreni,
            idzadataka: idzadataka
        }
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

    handleClose() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    toggleTasks(event) {
        var newChecked = {...this.state.checked}
        newChecked[event.target.value] = (newChecked[event.target.value] === true) ? false : true
        this.setState({
            checked: newChecked
        }, function () {
            //console.log(this.state.checked);
        });
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

        const tasks = this.state.tasks
        let i = 0
        const listTasks = tasks.map(task =>
            <li key={i++} className="d-flex align-items-start">
                <input className="mt-2" type="checkbox" defaultChecked={this.state.checked[task.idzad]} id={task.idzad} name={task.idzad} value={task.idzad} onChange={(e) => this.toggleTasks(e)} />
                <label className="labelWidth" htmlFor={task.idzad}>{task.pitanje}<span className="font"> |ODGOVOR: {task.tocanodgovor}</span></label>
            </li>
        )

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
                        <div className="form-group mt-3">
                            <label>Odaberite zadatke koje želite da se rješavaju u vježbi:</label>
                            <Button variant="btn btn-primary" className="mx-2" onClick={this.handleClose}>Odaberi</Button>
                            {this.state.showPopup && <Popup
                                content={
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <h3>Označite zadatke koje želite u vježbi</h3>
                                        <hr/>
                                        <ul>
                                            {listTasks}
                                        </ul>
                                    </div>
                                }
                                handleClose={this.handleClose}
                            />}
                        </div>
                    </div>

                    <div className="my-2 col-md-12 text-center">
                        <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Dodaj</button>
                        <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                    </div>
                </form>
                {this.state.addingError &&
                    <div className="mt-3 mx-5"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
            </div>
        );
    }
}

export default AddExercise;