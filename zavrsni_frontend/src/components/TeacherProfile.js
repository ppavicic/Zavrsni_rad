import React from "react";
import '../styles/index.css'
import { Table, Button, Container } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class TeacherProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            students: [],
            exercises: [],
            tasks: [],
            logout: false,
            toAddingStudentForm: false,
            toAddingTaskForm: false,
            toAddingExerciseForm: false,
            toEditingForm: false,
            toStatisticsForm: false,
            showPopup: false
        }
        this.handleLogout = this.handleLogout.bind(this)
        this.handleStudent = this.handleStudent.bind(this)
        this.getStudents = this.getStudents.bind(this)
        this.getExercises = this.getExercises.bind(this)
        this.handlePopup = this.handlePopup.bind(this)
        this.handleExercise = this.handleExercise.bind(this)
        this.handleTask = this.handleTask.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleStats = this.handleStats.bind(this)
    }

    componentDidMount() {
        this.getStudents();
        this.getExercises();
        this.getTasks();
    }

    getExercises() {
        axios.get(URL + '/teacherProfile/getExercises', { withCredentials: false })
            .then(response => {
                this.setState({
                    exercises: response.data.exercises
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getTasks() {
        axios.get(URL + '/teacherProfile/getTasks', { withCredentials: false })
            .then(response => {
                this.setState({
                    tasks: response.data.tasks
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getStudents() {
        let username = sessionStorage.getItem('loginToken').split(',')[0].split(':')[1]
        username = username.slice(1, -1)
        let user = {
            username: username
        }
        axios.post(URL + '/teacherProfile/getStudents', user, { withCredentials: false })
            .then(response => {
                this.setState({
                    students: response.data.students
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleStudent() {
        this.setState({
            toAddingStudentForm: true
        });
    }

    handleTask() {
        this.setState({
            toAddingTaskForm: true
        });
    }

    handleExercise() {
        this.setState({
            toAddingExerciseForm: true
        });
    }

    handleLogout() {
        this.setState({
            logout: true
        })
    }

    handlePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    handleEdit(event) {
        localStorage.setItem('editValue', JSON.stringify(event.target.value))
        this.setState({
            toEditingForm: true,
        });
    }

    handleStats(event){
        localStorage.setItem('student', JSON.stringify(event.target.value))
        this.setState({
            toStatisticsForm: true,
        });
    }

    render() {
        if (this.state.logout) {
            sessionStorage.removeItem('loginToken')
            return (
                <Navigate to='/' />
            )
        }

        if (sessionStorage.getItem('loginToken') === null) {
            return <Navigate to='/' />
        }

        if (this.state.toAddingStudentForm) {
            return (
                <Navigate to='/teacherProfile/addStudent' />
            )
        }

        if (this.state.toAddingTaskForm) {
            return (
                <Navigate to='/teacherProfile/addTask' />
            )
        }

        if (this.state.toAddingExerciseForm) {
            return (
                <Navigate to='/teacherProfile/addExercise' />
            )
        }

        if (this.state.toEditingForm) {
            return (
                <Navigate to='/teacherProfile/edit' />
            )
        }

        if (this.state.toStatisticsForm) {
            return (
                <Navigate to='/teacherProfile/statistics' />
            )
        }

        const storage = sessionStorage.getItem('loginToken')
        var skola = storage.split(',')[2].split(':')[1]
        skola = skola.slice(1, -2)
        const exercises = this.state.exercises
        let i = 0
        const listExercises = exercises.map(exercise =>
            <tr key={i++}>
                <td>{exercise.idgrupe}</td>
                <td>{exercise.naziv}</td>
                <td>{exercise.namjena}</td>
                <td>{exercise.valuta}</td>
                <td>{exercise.zadaci}</td>
                <td>{exercise.pokreni}</td>
                <td><Button variant="info" className="inline- text-white" value={'vjezba:' + exercise.idgrupe} onClick={(e) => this.handleEdit(e, 'value')}>Uredi</Button></td>
            </tr>
        )

        const tasks = this.state.tasks
        let j = 0
        const listTasks = tasks.map(task =>
            <tr key={j++}>
                <td>{task.idzad}</td>
                <td>{task.vrsta}</td>
                <td>{task.pitanje}</td>
                <td>{task.tocanodgovor}</td>
                <td>{task.hint}</td>
                <td><Button variant="info" className="inline- text-white" value={'zadatak:' + task.idzad} onClick={(e) => this.handleEdit(e, 'value')}>Uredi</Button></td>
            </tr>
        )

        const students = this.state.students
        let k = 0
        const listStudents = students.map(student =>
            <tr key={k++}>
                <td>{student.iducenika}</td>
                <td>{student.ime}</td>
                <td>{student.prezime}</td>
                <td>{student.odjeljenje}</td>
                <td><Button variant="primary" className="inline-" value={student.iducenika} onClick={(e) => this.handleStats(e)}>Statistika</Button></td>
                <td><Button variant="info" className="inline- text-white" value={'student:' + student.iducenika} onClick={(e) => this.handleEdit(e, 'value')}>Uredi</Button></td>
            </tr>
        )
        return (
            <Container className="Margin-top">
                <br />
                <h1 className="text-center mb-3 font">MOJ PROFIL</h1>
                <div className="d-flex justify-content-around align-items-center font pozadina py-2">
                    <p>ŠKOLA: {skola}</p>
                    <Button variant="btn btn-outline-primary" className="btn-lg inline-" onClick={this.handlePopup}>OPCIJE</Button>
                </div>
                <hr />
                {this.state.showPopup &&
                    <div className="d-flex justify-content-around">
                        <Button variant="primary" className="inline-" onClick={this.handleStudent}>Dodaj učenika</Button>
                        <Button variant="primary" className="inline-" onClick={this.handleTask}>Dodaj zadatak</Button>
                        <Button variant="primary" className="inline-" onClick={this.handleExercise}>Dodaj vježbu</Button>
                        <Button variant="danger" className="inline-" onClick={this.handleLogout}>Odjava</Button>
                    </div>
                }
                <hr />
                <h3 className="text-center font">Vježbe</h3>
                <Table className="table-hover">
                    <thead className="font">
                        <tr>
                            <th>ID</th>
                            <th className="w-25">Naziv</th>
                            <th>Namjena</th>
                            <th>Valuta</th>
                            <th>Zadaci u vježbi</th>
                            <th>Pokreni</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listExercises}
                    </tbody>
                </Table>
                <br />
                <h3 className="text-center font">Zadaci</h3>
                <Table className="table-hover">
                    <thead className="font">
                        <tr>
                            <th>ID</th>
                            <th>Vrsta</th>
                            <th className="w-25">Pitanje</th>
                            <th>Točan odgovor</th>
                            <th className="w-25">Hint</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listTasks}
                    </tbody>
                </Table>
                <br />
                <h3 className="text-center font">Moji učenici</h3>
                <Table className="table-hover">
                    <thead className="font">
                        <tr>
                            <th>ID</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Razred</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listStudents}
                    </tbody>
                </Table>
                <br />

            </Container>
        )
    }
}

export default TeacherProfile;