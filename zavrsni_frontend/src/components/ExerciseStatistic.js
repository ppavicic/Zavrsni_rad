import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import { Table, Button, Container } from 'react-bootstrap'
import Image from '../images/money.jpg';
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class ExerciseStatistic extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: [],
            exercise: [],
            totalTime: "",
            error: false,
            errorText: ""
        }
        this.getAnswers = this.getAnswers.bind(this)
        this.getColor = this.getColor.bind(this)
        this.setTimes = this.setTimes.bind(this)
    }

    componentDidMount() {
        this.getAnswers();
        setTimeout(function () {
            this.setTimes()
        }.bind(this), 300)
    }

    getAnswers() {
        const student = JSON.parse(localStorage.getItem('student'));
        const exercise = JSON.parse(localStorage.getItem('exercise'));
        let data = {
            exerciseId: exercise,
            studentId: student
        }
        axios.post(URL + '/teacherProfile/getAnswers', data, { withCredentials: false })
            .then(response => {
                this.setState({
                    answers: response.data.answers,
                    exercise: response.data.exercise
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getColor(tocanodgovor, odgovorKorisnika) {
        if (tocanodgovor == odgovorKorisnika) {
            return 'table-success'
        } else {
            return 'table-danger'
        }
    }

    setTimes() {
        var answers = this.state.answers
        /*var startVjezbe = answers[0].vrijeme
        var krajVjezbe = answers[answers.length - 1].vrijeme
        const startDate = new Date(startVjezbe)
        const krajDate = new Date(krajVjezbe)
        const ukupnoVrijeme = Math.round((krajDate - startDate) / 1000)

        var vremena = []
        for (let i = 1; i < answers.length; i++) {
            const start = new Date(answers[i - 1].vrijeme)
            const kraj = new Date(answers[i].vrijeme)
            const vrijemeRjesavanja = Math.round((kraj - start) / 1000)
            vremena[i] = vrijemeRjesavanja
        }*/

        var ukupnoVrijeme = 0
        for (let i = 1; i < answers.length; i++) {
            ukupnoVrijeme += parseFloat(answers[i].trajanje)
        }
        answers.shift()
        //ukupnoVrijeme = Math.round(ukupnoVrijeme)

        this.setState({
            answers: answers,
            totalTime: ukupnoVrijeme
        })
    }

    render() {
        const answers = this.state.answers
        let i = 0

        const listAnswers = answers.map(answer =>
            <tr key={i++} className={this.getColor(answer.tocan, answer.odgovor)}>
                <td>{answer.pitanje}</td>
                <td>{answer.tocan}</td>
                <td>{answer.odgovor}</td>
                <td>{answer.trajanje}s</td>
            </tr>
        )

        return (
            <Container className="Margin-top d-flex flex-column align-items-center font">
                <Table className="mt-2">
                    <thead className="thead-light">
                        <tr>
                            <th>PITANJE</th>
                            <th>TOČAN ODGOVOR</th>
                            <th>UČENIKOV ODGOVOR</th>
                            <th>VRIJEME (sec)</th>
                        </tr>
                    </thead>
                    <tbody >
                        {listAnswers}
                    </tbody>
                    <div className="d-flex my-2 align-items-center">
                        Vrijeme rješavanja vježbe: {this.state.totalTime}s
                    </div>
                </Table>
            </Container>
        );
    }
}
export default ExerciseStatistic;