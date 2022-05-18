import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/login.css'
import { Navigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import axios from 'axios'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class LoginStudent extends React.Component {
    constructor() {
        super()
        this.state = {
            ime: "",
            prezime: "",
            razred: "default",
            skola: "default",
            ucenik: "default",
            schools: [],
            razredi: [],
            ucenici: [],
            err: false,
            dohvaceno: false,
            loginError: false,
            errorText: ''
        }
        this.getSchools = this.getSchools.bind(this)
        this.handleSchoolChange = this.handleSchoolChange.bind(this)
        this.handleClassChange = this.handleClassChange.bind(this)
        this.handleStudentChange = this.handleStudentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getExercise = this.getExercise.bind(this)
        this.changeCurrency = this.changeCurrency.bind(this)
    }

    componentDidMount() {
        this.getSchools()
        //this.getExercise()
        setTimeout(function () {
            this.changeCurrency()
        }.bind(this), 200)
    }

    getSchools() {
        axios.get(URL + '/loginStudent/getSchools', { withCredentials: false })
            .then(response => {
                this.setState({
                    schools: response.data.schools
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getExercise() {
        axios.get(URL + '/loginStudent/getExercise', { withCredentials: false })
            .then(response => {
                if (response.data.err !== undefined) {
                    this.setState({
                        err: true,
                        errorText: response.data.exerciseError
                    })
                } else {
                    const vjezba = {
                        "idvjezbe": response.data.exercise[0].idgrupe,
                        "zadaci": response.data.tasks,
                        "valuta": response.data.exercise[0].valuta,
                        "naziv": response.data.exercise[0].naziv,
                        "brojRijesenih": 0
                    }
                    localStorage.setItem('vjezba2', JSON.stringify(vjezba))
                    this.setState({
                        err: false,
                        dohvaceno: true
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    changeCurrency() {
        let vjezba = JSON.parse(localStorage.getItem('vjezba2'))
        let zadaci = vjezba.zadaci

        if (vjezba.valuta.trim() === "EURO") {
            for (let i = 0; i < zadaci.length; i++) {
                zadaci[i].pitanje = zadaci[i].pitanje.replaceAll("kn", "eur")
                zadaci[i].pitanje = zadaci[i].pitanje.replaceAll("lp", "c")
                zadaci[i].pitanje = zadaci[i].pitanje.replaceAll("kuna", "eura")
                zadaci[i].pitanje = zadaci[i].pitanje.replaceAll("lipa", "centi")

                zadaci[i].tocanodgovor = zadaci[i].tocanodgovor.replaceAll("kn", "eur")
                zadaci[i].tocanodgovor = zadaci[i].tocanodgovor.replaceAll("lp", "c")
                zadaci[i].tocanodgovor = zadaci[i].tocanodgovor.replaceAll("kuna", "eura")
                zadaci[i].tocanodgovor = zadaci[i].tocanodgovor.replaceAll("lipa", "centi")

                if (zadaci[i].vrsta === 'slikovnoUnos') {
                    zadaci[i].novaczaprikaz = zadaci[i].novaczaprikaz.replaceAll("kn", "eur")
                    zadaci[i].novaczaprikaz = zadaci[i].novaczaprikaz.replaceAll("lp", "c")
                }
                if (zadaci[i].vrsta === 'odabir') {
                    zadaci[i].drugiodgovor = zadaci[i].drugiodgovor.replaceAll("kn", "eur")
                    zadaci[i].drugiodgovor = zadaci[i].drugiodgovor.replaceAll("lp", "c")
                    zadaci[i].treciodgovor = zadaci[i].treciodgovor.replaceAll("kn", "eur")
                    zadaci[i].treciodgovor = zadaci[i].treciodgovor.replaceAll("lp", "c")
                    zadaci[i].cetvrtiodgovor = zadaci[i].cetvrtiodgovor.replaceAll("kn", "eur")
                    zadaci[i].cetvrtiodgovor = zadaci[i].cetvrtiodgovor.replaceAll("lp", "c")
                }
            }
        }

        localStorage.setItem('vjezba', JSON.stringify(vjezba))
    }

    async handleSchoolChange(event) {
        event.preventDefault()
        //console.log("skola: " + event.target.value)
        var value = event.target.value
        let data = {
            idskole: value
        }
        this.setState({
            skola: value,
            razred: "default",
            ucenik: "default"
        })
        axios.post(URL + '/loginStudent/getClasses', data, { withCredentials: false })
            .then(response => {
                this.setState({
                    razredi: response.data.classes
                })
            })
            .catch((error) => {
                console.log(error)
            })

    }

    async handleClassChange(event) {
        event.preventDefault()
        //console.log("razred: " + event.target.value)
        if (event.target.value !== "default") {
            var value = event.target.value
            let data = {
                idskole: this.state.skola,
                idrazred: value
            }
            this.setState({
                razred: value,
                ucenik: "default"
            })
            axios.post(URL + '/loginStudent/getStudents', data, { withCredentials: false })
                .then(response => {
                    this.setState({
                        ucenici: response.data.students
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    async handleStudentChange(event) {
        event.preventDefault()
        var value = event.target.value
        this.setState({
            ucenik: value
        })
        //console.log("student: " + value)
    }

    async handleSubmit(event) {
        event.preventDefault()
        let vjezba = JSON.parse(localStorage.getItem('vjezba'))
        let user = {
            iducenik: this.state.ucenik,
            idrazred: this.state.razred,
            idskole: this.state.skola,
            idvjezbe: vjezba.idvjezbe
        }
        axios.post(URL + '/loginStudent', user, { withCredentials: false })
            .then(response => {
                if (response.data.loginError !== undefined) {
                    this.setState({
                        loginError: true,
                        errorText: response.data.loginError
                    })
                } else {
                    const student = {
                        "ucenik": this.state.ucenik,
                        "razred": this.state.razred,
                        "skola": this.state.skola
                    }
                    sessionStorage.setItem('playerToken', JSON.stringify(student))
                    this.setState({
                        loginError: false,
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        if (sessionStorage.getItem('playerToken') !== null) {
            var obj = JSON.parse(sessionStorage.getItem('playerToken'));
            if (obj.ucenik !== null)
                return <Navigate to='/exercise' />
        }

        const schools = this.state.schools
        const schoolsList = schools.map((school, i) => {
            return (
                <option key={i} value={school.idskole}>{school.imeskole}</option>
            )
        }, this
        )
        schoolsList.push(<option disabled key={-1} value={"default"}>Choose an option</option>)

        const razredi = this.state.razredi
        const classesList = razredi.map((razred, i) => {
            return (
                <option key={i} value={razred.idrazred}>{razred.odjeljenje}</option>
            )
        }, this
        )
        classesList.push(<option disabled key={-1} value={"default"}>Choose an option</option>)

        const ucenici = this.state.ucenici
        const studentsList = ucenici.map((ucenik, i) => {
            return (
                <option key={i} value={ucenik.iducenika}>{ucenik.ime + " " + ucenik.prezime}</option>
            )
        }, this
        )
        studentsList.push(<option disabled key={-1} value={"default"}>Choose an option</option>)

        var zindex = {
            zIndex: 1
        }

        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h1 className="my-4 font">VJEŽBALICA</h1>
                <div className="w-50 container d-flex flex-column justify-content-center align-items-center font pozadina">
                    <form onSubmit={this.handleSubmit} className="w-100 container d-flex flex-column justify-content-center align-items-center">
                        <h2 className="pt-1">Škola</h2>
                        <select value={this.state.skola} defaultValue={'default'} name="skola" className="form-select" aria-label="Default select example" onChange={(e) => this.handleSchoolChange(e, 'value')}>
                            {schoolsList}
                        </select>

                        <h2 className="pt-1">Razred</h2>
                        <select value={this.state.razred} defaultValue={'default'} name="razred" className="form-select" aria-label="Default select example" onChange={(e) => this.handleClassChange(e, 'value')}>
                            {classesList}
                        </select>

                        <h2 className="pt-1">Učenik</h2>
                        <select value={this.state.ucenik} defaultValue={'default'} name="ucenik" className="form-select" aria-label="Default select example" onChange={(e) => this.handleStudentChange(e, 'value')}>
                            {studentsList}
                        </select>

                        <button type="submit" className="btn btn-primary my-2">KRENI</button>
                    </form>
                </div>
                {this.state.loginError && <Alert style={zindex} className="alert-dismissible fade show mt-2" variant={'danger'}>{this.state.errorText}</Alert>}
            </div>
        );
    }
}

export default LoginStudent;