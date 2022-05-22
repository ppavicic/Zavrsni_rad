import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from '../images/money.jpg';
import { Navigate } from 'react-router-dom'
import Countdown from 'react-countdown';
import axios from 'axios'
import { URL } from './Constants'
import PictureInputTask from './PictureInputTask'
import MultipleChoiceTask from './MultipleChoiceTask'
import InputTask from './InputTask'
import PictureChoiceTask from './PictureChoiceTask'
axios.defaults.withCredentials = true;

class Exercise extends React.Component {
    constructor() {
        super()
        this.state = {
            student: [],
            naziv: "",
            currentTask: "",
            hours: "",
            minutes: "",
            seconds: "",
            stop: false,
            show: false
        }
        this.getStudent = this.getStudent.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderTask = this.renderTask.bind(this)
        this.nextTask = this.nextTask.bind(this)
        this.updateTimer = this.updateTimer.bind(this)
        this.sendLog = this.sendLog.bind(this)
    }

    componentDidMount() {
        this.getStudent()
        var vjezba = JSON.parse(localStorage.getItem('vjezba'));
        this.setState({
            naziv: vjezba.naziv
        })
        var brojRijesenih = vjezba.brojRijesenih
        if(brojRijesenih == 0){
            this.sendLog()
        }

        if (brojRijesenih >= vjezba.zadaci.length) {
            localStorage.removeItem('vjezba')
            this.setState({
                stop: true
            })
        } else {
            this.setState({
                currentTask: vjezba.zadaci[brojRijesenih],
                show: !this.state.show
            })
        }
    }

    sendLog() {
        let playerToken = JSON.parse(sessionStorage.getItem('playerToken'))
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let log = {
            idgrupe: vjezba.idvjezbe,
            idzadatka: "0",
            iducenika: playerToken.ucenik,
            odgovor: "start"
        }
        axios.post(URL + '/exercise/sendLog', log, { withCredentials: false })
            .then(result => {
                //console.log(result.data.odg)
            })
            .catch(err => {
                console.log(err)
            })
    }

    getStudent() {
        var data = JSON.parse(sessionStorage.getItem('playerToken'));
        axios.post(URL + '/exercise/getStudent', data, { withCredentials: false })
            .then(response => {
                this.setState({
                    student: response.data.student
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async handleChange(event) {
        event.preventDefault()
        this.setState({
            stop: true
        })
    }

    nextTask() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let brojRijesenih = vjezba.brojRijesenih
        brojRijesenih = brojRijesenih + 1
        const vjezba2 = {
            "idvjezbe": vjezba.idvjezbe,
            "zadaci": vjezba.zadaci,
            "valuta": vjezba.valuta,
            "naziv": vjezba.naziv,
            "brojRijesenih": brojRijesenih
        }
        localStorage.setItem('vjezba', JSON.stringify(vjezba2))

        if (brojRijesenih < vjezba.zadaci.length) {
            this.setState({
                currentTask: vjezba.zadaci[brojRijesenih]
            })
        } else {
            localStorage.removeItem('vjezba')
            localStorage.removeItem('vjezba2')
            this.setState({
                stop: true
            })
        }
    }

    renderTask() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let task = this.state.currentTask
        if (task.vrsta === 'slikovnoUnos')
            return (
                <PictureInputTask
                    key={task.idzad}
                    pitanje={task.pitanje}
                    tocan={task.tocanodgovor}
                    hint={task.hint}
                    novacZaPrikaz={task.novaczaprikaz}
                    idzadatka={task.idzad}
                    next={this.nextTask}
                />
            )
        if (task.vrsta === 'odabir')
            return (
                <MultipleChoiceTask
                    key={task.idzad}
                    pitanje={task.pitanje}
                    odg2={task.drugiodgovor}
                    odg3={task.treciodgovor}
                    odg4={task.cetvrtiodgovor}
                    tocan={task.tocanodgovor}
                    idzadatka={task.idzad}
                    hint={task.hint}
                    next={this.nextTask}
                />
            )
        if (task.vrsta === 'unos')
            return (
                <InputTask
                    key={task.idzad}
                    pitanje={task.pitanje}
                    tocan={task.tocanodgovor}
                    idzadatka={task.idzad}
                    hint={task.hint}
                    next={this.nextTask}
                />
            )
        if (task.vrsta === 'slikovnoOdabir')
            return (
                <PictureChoiceTask
                    key={task.idzad}
                    pitanje={task.pitanje}
                    tocan={task.tocanodgovor}
                    idzadatka={task.idzad}
                    hint={task.hint}
                    tipNovca={task.tipnovca}
                    valuta={vjezba.valuta}
                    next={this.nextTask}
                />
            )
    }

    updateTimer(hours, minutes, seconds){
        this.setState({
            hours: hours,
            minutes: minutes,
            seconds: seconds
        })
    }

    render() {
        if (this.state.stop) {
            sessionStorage.removeItem("playerToken")
            localStorage.removeItem("vjezba")
            return <Navigate to='/' />
        }
        var student = this.state.student
        var stud = student.map(s => s.ime + " " + s.prezime)

        var height15 = {
            height: `15vh`
        }
        var height85 = {
            height: `85vh`
        }

        const renderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                localStorage.removeItem('vjezba')
                this.setState({
                    stop: true
                })
                return null
            } else {
                //this.updateTimer(hours, minutes, seconds)
                return <span>{hours}:{minutes}:{seconds}</span>;
            }
        };

        const renderTask = this.renderTask()
        //console.log(this.state.minutes, this.state.seconds)
        return (
            <div className="container">
                <div className="row pozadina font" style={height15}>
                    <div className="col d-flex justify-content-between align-items-center">
                        <div className="">{stud}</div>
                        <div className="h3 w-50 text-center">{this.state.naziv}</div>
                        {/*<div><Countdown
                            date={Date.now() + 50000}
                            renderer={({ hours, minutes, seconds, completed }) => this.updateTimer(hours, minutes, seconds)} />
                        </div>*/}
                        <button className="btn btn-danger h-25 py-0" onClick={this.handleChange}>QUIT</button>
                    </div>
                </div>
                <div className="row" style={height85}>
                    {renderTask}
                </div>
            </div>
        );
    }
}
export default Exercise;