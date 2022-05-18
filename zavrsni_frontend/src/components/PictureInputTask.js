import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from '../images/money.jpg';
import '../styles/login.css'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class PictureInputTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pitanje: this.props.pitanje,
            tocan: this.props.tocan,
            hint: this.props.hint,
            novacZaPrikaz: this.props.novacZaPrikaz,
            idzadatka: this.props.idzadatka,
            valuta: "",
            odgovorKorisnika: "",
            novac: [],
            showHint: false,
            taskError: false,
            errorText: "",
            taskSucces: false
        }
        this.showHint = this.showHint.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getMoney = this.getMoney.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.sendLog = this.sendLog.bind(this)
        this.nextTask = this.nextTask.bind(this)
    }

    componentDidMount() {
        this.getMoney()
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

    getMoney() {
        var vjezba = JSON.parse(localStorage.getItem('vjezba'));
        let data = {
            tip: false,
            novacZaPrikaz: this.state.novacZaPrikaz,
            valuta: vjezba.valuta
        }
        axios.post(URL + '/exercise/getMoney', data, { withCredentials: false })
            .then(response => {
                this.setState({
                    novac: response.data.novac
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))

        var imageDiv = {
            height: `15vh`,
            minWidth: `300px`,
            maxWidth: '300px'
        }
        var imageRender = {
            imageRendering: `-webkit-optimize-contrast`,
        }
        var zindex = {
            zIndex: 1
        }
        const novac = this.state.novac
        const moneyList = novac.map((n, i) =>
            <div key={i} style={imageDiv} className="col-4">
                <img className="" style={imageRender} width="100%" height="100%" src={n.url}></img>
            </div>
        )
        return (
            <div className="h-100 d-flex flex-column py-1 px-0">
                <div className="h-25 pozadina font d-flex flex-column justify-content-around align-items-center">
                    <p>{vjezba.brojRijesenih + 1}. {this.state.pitanje}</p>
                    <div className="my-3">
                        <button className="btn btn-warning btn-sm mx-3" data-toggle="button" aria-pressed="false" autoComplete="off" onClick={this.showHint}>HINT</button>
                        {this.state.showHint && this.state.hint}
                    </div>
                </div>
                <div className="h-75 !important bg-white pozadina border-top-0 d-flex flex-column justify-content-center align-items-center">
                    <div className="w-100 row h-75 justify-content-around align-items-center">
                        {moneyList}
                    </div>
                    {this.state.taskError && !this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'danger'}>{this.state.errorText}</Alert></div>}
                    {this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'success'}>Točan odgovor!</Alert></div>}
                    <form onSubmit={this.handleSubmit} className="w-100 pozadina border-0 h-25 d-flex justify-content-center align-items-center">
                        <div className="input-group my-2 w-50">
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

export default PictureInputTask;