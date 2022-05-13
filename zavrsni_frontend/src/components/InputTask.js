import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from '../images/money.jpg';
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class InputTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pitanje: this.props.pitanje,
            tocan: this.props.tocan,
            hint: this.props.hint,
            idzadatka: this.props.idzadatka,
            odgovorKorisnika: "",
            showHint: false,
            taskError: false,
            errorText: "",
            taskSucces: false
        }
        this.showHint = this.showHint.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.sendLog = this.sendLog.bind(this)
        this.nextTask = this.nextTask.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        this.sendLog()
        let tocan = this.state.tocan
        let odgovorKorisnika = this.state.odgovorKorisnika.toLowerCase()
        if (tocan !== odgovorKorisnika) {
            this.setState({
                taskError: true,
                errorText: 'Pogrešan odgovor! Pokušaj ponovo.'
            })
        } else {
            this.setState({
                taskSucces: true,
            })
            setTimeout(function () {
                this.nextTask()
            }.bind(this), 1000)
        }
    }

    nextTask() {
        this.props.next()
    }

    sendLog() {
        let playerToken = JSON.parse(sessionStorage.getItem('playerToken'))
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let idzadatka = this.state.idzadatka
        let brojRijesenih = vjezba.brojRijesenih
        let log = {
            idgrupe: vjezba.idvjezbe,
            idzadatka: idzadatka,
            iducenika: playerToken.ucenik,
            odgovor: this.state.odgovorKorisnika,
            tocan: vjezba.zadaci[brojRijesenih].tocanodgovor
        }
        axios.post(URL + '/exercise/sendLog', log, { withCredentials: false })
            .then(result => {
                //console.log(result.data.odg)
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }

    showHint() {
        this.setState({
            showHint: !this.state.showHint
        })
    }

    render() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))

        var zindex = {
            zIndex: 1
        }
        
        return (
            <div className="h-100 d-flex flex-column py-1">
                <div className="h-50 pt-3 px-5 border border-secondary text-white bg-secondary bg-gradient d-flex flex-column justify-content-around align-items-center">
                    <p>{vjezba.brojRijesenih+1}. {this.state.pitanje}</p>
                    <div className="my-3">
                        <button className="btn btn-outline-warning btn-sm mx-3" data-toggle="button" aria-pressed="false" autoComplete="off" onClick={this.showHint}>HINT</button>
                        {this.state.showHint && this.state.hint}
                    </div>
                </div>
                <div className="h-50 !important border border-secondary d-flex flex-column justify-content-center align-items-center">
                    {this.state.taskError && !this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'danger'}>{this.state.errorText}</Alert></div>}
                    {this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'success'}>Točan odgovor!</Alert></div>}
                    <form onSubmit={this.handleSubmit} className="w-75 h-25 bg-secondary bg-gradient d-flex justify-content-center align-items-center">
                        <div className="input-group my-2 mx-2">
                            <input name="odgovorKorisnika" value={this.state.odgovorKorisnika} type="text" className="form-control" placeholder="Enter answer"
                                aria-label="Enter answer" aria-describedby="basic-addon2" onChange={this.handleChange}></input>
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-primary">Odgovori</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default InputTask;