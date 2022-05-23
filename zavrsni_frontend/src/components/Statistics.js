import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import { Table, Button, Container, Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            exercises: [],
            student: [],
            toStatistics: false,
            error: false,
            errorText: ""
        }
        this.getExercises = this.getExercises.bind(this)
        this.handleExercise = this.handleExercise.bind(this)
        this.getStudent = this.getStudent.bind(this)
    }

    componentDidMount() {
        this.getExercises();
        this.getStudent()
    }

    getStudent() {
        const student = JSON.parse(localStorage.getItem('student'));
        let user = {
            identifikator: student
        }
        axios.post(URL + '/teacherProfile/getStudent', user, { withCredentials: false })
            .then(response => {
                this.setState({
                    student: response.data.student
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getExercises() {
        const student = JSON.parse(localStorage.getItem('student'));
        let user = {
            studentId: student
        }
        axios.post(URL + '/teacherProfile/getSolvedExercises', user, { withCredentials: false })
            .then(response => {
                if (response.data.exercises.length == 0) {
                    this.setState({
                        error: true,
                        errorText: "Učenik nije radio nijednu vježbu"
                    })
                } else {
                    this.setState({
                        exercises: response.data.exercises
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleExercise(event) {
        localStorage.setItem('exercise', JSON.stringify(event.target.value))
        this.setState({
            toStatistics: true,
        });
    }

    render() {
        if (this.state.toStatistics) {
            return (
                <Navigate to='/teacherProfile/statistics/exercise' />
            )
        }
        
        const exercises = this.state.exercises
        let i = 0
        const listExercises = exercises.map(exercise =>
            <tr key={i++}>
                <td>{exercise.idgrupe}</td>
                <td>{exercise.naziv}</td>
                <td><Button variant="primary" className="inline-" value={exercise.idgrupe} onClick={(e) => this.handleExercise(e)}>Vidi statistiku</Button></td>
            </tr>
        )

        var student = this.state.student
        var stud = student.map(s => s.ime + " " + s.prezime)

        return (
            <Container className="Margin-top d-flex flex-column align-items-center overflow-auto">
                <div className="my-4 w-75 d-flex justify-content-center align-items-center font pozadina">Statistika za učenika: {stud}</div>
                {!this.state.error && <Table className="table-hover font">
                    <thead className="font">
                        <tr>
                            <th>ID vježbe</th>
                            <th>Naziv vježbe</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listExercises}
                    </tbody>
                </Table>}
                {this.state.error && <div className="mt-4 w-100"><Alert className="alert-dismissible fade show" variant={'danger'}>{this.state.errorText}</Alert></div>}
            </Container>
        );
    }
}

export default Statistics;