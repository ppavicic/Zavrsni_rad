import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class PictureChoiceTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pitanje: this.props.pitanje,
            tocan: this.props.tocan,
            hint: this.props.hint,
            idzadatka: this.props.idzadatka,
            tipNovca: this.props.tipNovca,
            valuta: this.props.valuta,
            odgovorKorisnika: "",
            novac: [],
            showHint: false,
            taskError: false,
            showWallet: false,
            errorText: "",
            taskSucces: false
        }
        this.showHint = this.showHint.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.sendLog = this.sendLog.bind(this)
        this.nextTask = this.nextTask.bind(this)
        this.getMoney = this.getMoney.bind(this)
    }

    componentDidMount() {
        this.getMoney()
    }

    getMoney() {
        var vjezba = JSON.parse(localStorage.getItem('vjezba'));
        let data = {
            tip: true,
            tipNovca: this.state.tipNovca,
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

    handleSubmit(event) {
        event.preventDefault()
        let tocan = this.state.tocan
        let odgovorKorisnika = this.state.odgovorKorisnika.toLowerCase()
        let dijelovi = odgovorKorisnika.split(',')
        for (let i = 1; i < dijelovi.length; i++) {
            if (this.state.valuta == 'EURO') {
                if (dijelovi[i].slice(-1) == 'c') {
                    dijelovi[i] = parseFloat(dijelovi[i].substring(0, dijelovi[i].length - 1)) / 100.0
                } else {
                    dijelovi[i] = parseFloat(dijelovi[i].substring(0, dijelovi[i].length - 2))
                }
            } else {
                if (dijelovi[i].slice(-2) == 'lp') {
                    dijelovi[i] = parseInt(dijelovi[i].substring(0, dijelovi[i].length - 2)) / 100.0
                } else {
                    dijelovi[i] = parseInt(dijelovi[i].substring(0, dijelovi[i].length - 2))
                }
            }
        }
        dijelovi.shift()
        let ukupno = 0
        for (let j = 0; j < dijelovi.length; j++) {
            ukupno += dijelovi[j]
        }

        ukupno = ukupno.toFixed(2)
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        if (ukupno % 1 == 0.0) {
            if (vjezba.valuta.trim() === "EURO") {
                ukupno = Math.round(ukupno).toString() + "eur"
            } else {
                ukupno = Math.round(ukupno).toString() + "kn"
            }
        } else {
            if (vjezba.valuta.trim() === "EURO") {
                let centi = parseInt((ukupno % 1) * 100)
                ukupno = Math.floor(ukupno) + "eur i " + centi + "c"
            } else {
                let lipe = parseInt((ukupno % 1) * 100)
                ukupno = Math.floor(ukupno) + "kn i " + lipe + "lp"
            }
        }

        console.log(tocan, ukupno)
        this.sendLog(ukupno)
        if (tocan !== ukupno) {
            this.setState({
                odgovorKorisnika: "",
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

    sendLog(odgovorKorisnika) {
        let playerToken = JSON.parse(sessionStorage.getItem('playerToken'))
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let idzadatka = this.state.idzadatka
        let brojRijesenih = vjezba.brojRijesenih
        let log = {
            idgrupe: vjezba.idvjezbe,
            idzadatka: idzadatka,
            iducenika: playerToken.ucenik,
            odgovor: odgovorKorisnika,
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
        const { name, alt } = event.target
        this.setState(state => ({
            [name]: state.odgovorKorisnika + "," + alt
        }))
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
        var div = {
            height: `15vh`,
        }
        var imageRender = {
            imageRendering: `-webkit-optimize-contrast`,
            maxWidth: `100%`,
            maxHeight: `100%`
        }

        const novac = this.state.novac
        var odgovoriKorisnika = this.state.odgovorKorisnika
        odgovoriKorisnika = odgovoriKorisnika.split(',')
        let slikeOdabranogNovca = []
        for (let i = 0; i < odgovoriKorisnika.length; i++) {
            slikeOdabranogNovca.push(novac.find(element => element.ime == odgovoriKorisnika[i]))
        }
        slikeOdabranogNovca.shift()
        //console.log(odgovoriKorisnika)
        const chosenMoney = slikeOdabranogNovca.map((n, i) =>
            <img className="mt-1 my-2" key={i} style={imageRender} minwidth="10%" height="35%" src={n.url} alt={n.ime}></img>
        )
        //const novac = this.state.novac
        const moneyList = novac.map((n, i) =>
            <div key={i} style={div} className="col-4 px-2 py-1 d-flex align-items-center" >
                <button type="button" className="btn w-100 h-100"><img name="odgovorKorisnika" style={imageRender} src={n.url} alt={n.ime} onClick={(e) => this.handleChange(e)}></img></button>
            </div>
        )
        return (
            <div className="h-100 d-flex flex-column py-1 px-0" >
                <div className="h-25 px-5 pozadina font d-flex flex-column justify-content-around align-items-center">
                    <div>{vjezba.brojRijesenih + 1}. {this.state.pitanje}</div>
                    <div className="my-3">
                        <button className="btn btn-warning btn-sm mx-3" data-toggle="button" aria-pressed="false" autoComplete="off" onClick={this.showHint}>HINT</button>
                        {this.state.showHint && this.state.hint}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="w-100 h-75 d-flex flex-column pozadina bg-white border-top-0 justify-content-center align-items-center">
                    <div className="h-75 w-100 d-flex flex-wrap" style={{ overflow: `auto` }}>
                        {moneyList}
                    </div>
                    {this.state.taskError && !this.state.taskSucces && <Alert style={zindex} className="alert-dismissible fade show" variant={'danger'}>{this.state.errorText}</Alert>}
                    {this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'success'}>Točan odgovor!</Alert></div>}
                    <div className="h-25 w-100 pozadina border-0 font d-flex flex-column justify-content-between align-items-center">
                        <div className="w-100 h-50 bg-white borderi">
                            Odabrano: {chosenMoney}
                        </div>
                        <button type="submit" className="btn btn-primary my-1">Odgovori</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default PictureChoiceTask;