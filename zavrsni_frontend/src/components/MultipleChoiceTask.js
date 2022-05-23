import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class MultipleChoiceTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pitanje: this.props.pitanje,
            tocan: this.props.tocan,
            hint: this.props.hint,
            odg2: this.props.odg2,
            odg3: this.props.odg3,
            odg4: this.props.odg4,
            idzadatka: this.props.idzadatka,
            odgovorKorisnika: "",
            showHint: false,
            odgovori: [],
            taskError: false,
            errorText: ""
        }
        this.nextTask = this.nextTask.bind(this)
        this.showHint = this.showHint.bind(this)
        this.shuffleAnswers = this.shuffleAnswers.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.shuffleAnswers()
    }

    shuffleAnswers() {
        let odgovori = []
        odgovori.push(this.state.tocan, this.state.odg2, this.state.odg3, this.state.odg4)
        let currentIndex = odgovori.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [odgovori[currentIndex], odgovori[randomIndex]] = [odgovori[randomIndex], odgovori[currentIndex]];
        }

        this.setState({
            odgovori: odgovori
        })
    }

    showHint() {
        this.setState({
            showHint: !this.state.showHint
        })
    }

    handleChange(event){
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event){
        event.preventDefault()
        this.sendLog()
        let tocan = this.state.tocan
        let odgovorKorisnika = this.state.odgovorKorisnika
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
        //console.log(log)
        axios.post(URL + '/exercise/sendLog', log, { withCredentials: false })
            .then(result => {
                //console.log(result.data.odg)
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    nextTask() {
        this.props.next()
    }

    render() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))

        var zindex = {
            zIndex: 1
        }
        let odgovori = this.state.odgovori
        return (
            <div className="h-100 d-flex flex-column py-1 px-0">
                <div className="h-25 pt-3 px-5 pozadina font d-flex flex-column justify-content-around align-items-center">
                    <p>{vjezba.brojRijesenih+1}. {this.state.pitanje}</p>
                    <div className="my-3">
                        <button className="btn btn-warning btn-sm mx-3" data-toggle="button" aria-pressed="false" autoComplete="off" onClick={this.showHint}>HINT</button>
                        {this.state.showHint && this.state.hint}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="w-100 h-75 bg-white pozadina border-top-0 d-flex flex-column justify-content-center align-items-center">
                    <div className="h-75 w-100 d-flex flex-column justify-content-center align-items-center">
                        <input type="radio" className="btn-check" name="odgovorKorisnika" value={odgovori[0]} id="odg1" autoComplete="off" onChange={this.handleChange}></input>
                        <label className="mb-1 btn btn-secondary btn-lg" htmlFor="odg1">{odgovori[0]}</label>

                        <input type="radio" className="btn-check" name="odgovorKorisnika" value={odgovori[1]} id="odg2" autoComplete="off" onChange={this.handleChange}></input>
                        <label className="mb-1 btn btn-secondary btn-lg" htmlFor="odg2">{odgovori[1]}</label>

                        <input type="radio" className="btn-check" name="odgovorKorisnika" value={odgovori[2]} id="odg3" autoComplete="off" onChange={this.handleChange}></input>
                        <label className="mb-1 btn btn-secondary btn-lg" htmlFor="odg3">{odgovori[2]}</label>

                        <input type="radio" className="btn-check" name="odgovorKorisnika" value={odgovori[3]} id="odg4" autoComplete="off" onChange={this.handleChange}></input>
                        <label className="mb-1 btn btn-secondary btn-lg" htmlFor="odg4">{odgovori[3]}</label>
                    </div>
                    {this.state.taskError && !this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'danger'}>{this.state.errorText}</Alert></div>}
                    {this.state.taskSucces && <div style={zindex}><Alert className="alert-dismissible fade show" variant={'success'}>Točan odgovor!</Alert></div>}
                    <div className="h-25 w-100 font pozadina border-0 d-flex justify-content-center align-items-center">
                        <button type="submit" className="btn btn-primary">Odgovori</button>
                    </div>
                </form>
            </div>);
    }
}

export default MultipleChoiceTask;