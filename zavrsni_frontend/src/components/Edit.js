import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import Image from '../images/money.jpg';
import axios from 'axios'
import { Alert } from 'react-bootstrap'
import { URL } from './Constants'
axios.defaults.withCredentials = true;

class Edit extends React.Component {
    constructor() {
        super();
        this.state = {
            studentIdPlaceholder: "",
            taskIdPlaceholder: "",
            taskTypePlaceholder: "",
            exerciseIdPlaceholder: "",
            korisnickoime: "",
            ime: "",
            prezime: "",
            id: "",
            vrsta: "",
            pitanje: "",
            tocanOdg: "",
            tipNovca: "",
            odgovor2: "",
            odgovor3: "",
            odgovor4: "",
            novacZaPrikaz: "",
            hint: "",
            naziv: "",
            namjena: "",
            valuta: "",
            pokreni: "",
            idzadataka: "",
            student: [],
            task: [],
            exercise: [],
            back: false,
            showStudent: false,
            showVjezba: false,
            showZadatak: false,
            updateError: false,
            errorText: ""
        }
        this.return = this.return.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getStudent = this.getStudent.bind(this)
        this.getZadatak = this.getZadatak.bind(this)
        this.getVjezba = this.getVjezba.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event) {
        event.preventDefault()
        let data
        if (this.state.showStudent) {
            data = {
                data: "student",
                iducenika: this.state.studentIdPlaceholder,
                ime: this.state.ime,
                prezime: this.state.prezime
            }
        } else if (this.state.showZadatak) {
            data = {
                data: "zadatak",
                id: this.state.taskIdPlaceholder,
                vrsta: this.state.taskTypePlaceholder,
                pitanje: this.state.pitanje,
                tocanOdg: this.state.tocanOdg,
                hint: this.state.hint,
                tipNovca: this.state.tipNovca,
                odgovor2: this.state.odgovor2,
                odgovor3: this.state.odgovor3,
                odgovor4: this.state.odgovor4,
                novacZaPrikaz: this.state.novacZaPrikaz
            }
        } else if (this.state.showVjezba) {
            data = {
                data: "vjezba",
                id: this.state.exerciseIdPlaceholder,
                naziv: this.state.naziv,
                namjena: this.state.namjena,
                valuta: this.state.valuta,
                pokreni: this.state.pokreni,
                idzadataka: this.state.idzadataka,
            }
        }
        axios.post(URL + '/teacherProfile/edit', data, { withCredentials: false })
            .then(response => {
                if (response.data.updateError === undefined) {
                    console.log(response.status)
                    localStorage.removeItem('editValue');
                    window.location = "/teacherProfile"
                } else {
                    this.setState({
                        updateError: true,
                        errorText: response.data.updateError,
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        var item = localStorage.getItem('editValue');
        var dijelovi = item.split(':')
        var form = dijelovi[0].substring(1)
        var identifikator = dijelovi[1].substring(0, dijelovi[1].length - 1)
        if (form === 'student') {
            this.setState({
                showStudent: true
            })
            this.getStudent(identifikator)
        }
        else if (form === 'vjezba') {
            this.setState({
                showVjezba: true
            })
            this.getVjezba(identifikator)
        }
        else if (form === 'zadatak') {
            this.setState({
                showZadatak: true
            })
            this.getZadatak(identifikator)
        }
    }
    getVjezba(identifikator) {
        let exercise = {
            identifikator: identifikator
        }
        axios.post(URL + '/teacherProfile/getExercise', exercise, { withCredentials: false })
            .then(response => {
                this.setState({
                    exercise: response.data.exercise
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getZadatak(identifikator) {
        let task = {
            identifikator: identifikator
        }
        axios.post(URL + '/teacherProfile/getTask', task, { withCredentials: false })
            .then(response => {
                this.setState({
                    task: response.data.task
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getStudent(identifikator) {
        let user = {
            identifikator: identifikator
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

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }

    return() {
        this.setState({
            back: true
        })
    }

    render() {
        if (this.state.back) {
            localStorage.removeItem('editValue');
            return <Navigate to='/teacherProfile' />
        }

        var background = {
            backgroundImage: `url()`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }
        const student = this.state.student
        this.state.studentIdPlaceholder = student.map(student => student.iducenika)
        const studentFirstNamePlaceholder = student.map(student => student.ime)
        const studentLastNamePlaceholder = student.map(student => student.prezime)

        const task = this.state.task
        this.state.taskIdPlaceholder = task.map(task => task.idzad)
        this.state.taskTypePlaceholder = task.map(task => task.vrsta)
        const taskQuestionPlaceholder = task.map(task => task.pitanje)
        const taskCorrectAnswerPlaceholder = task.map(task => task.tocanodgovor)
        const taskHintPlaceholder = task.map(task => task.hint)
        const taskMoneyPlaceholder = task.map(task => task.novaczaprikaz)
        const taskSecondPlaceholder = task.map(task => task.drugiodgovor)
        const taskThirdPlaceholder = task.map(task => task.treciodgovor)
        const taskFourthPlaceholder = task.map(task => task.cetvrtiodgovor)
        const taskMoneyTypePlaceholder = task.map(task => task.tipnovca)

        const exercise = this.state.exercise
        this.state.exerciseIdPlaceholder = exercise.map(exercise => exercise.idgrupe)
        const exercisePurposePlaceholder = exercise.map(exercise => exercise.namjena)
        const exerciseNamePlaceholder = exercise.map(exercise => exercise.naziv)
        const exerciseCurrencyPlaceholder = exercise.map(exercise => exercise.valuta)
        const exerciseStartPlaceholder = exercise.map(exercise => exercise.pokreni)
        const exerciseTasksPlaceholder = exercise.map(exercise => exercise.zadaci)

        const typeOfMoney = []
        typeOfMoney.push(<option key={0} value={'NOVCANICA'}>NOVČANICA</option>)
        typeOfMoney.push(<option key={1} value={'KOVANICA'}>KOVANICA</option>)
        typeOfMoney.push(<option key={2} value={'OBOJE'}>OBOJE</option>)
        typeOfMoney.push(<option disabled key={3} value={'default'}>Odaberi tip novca</option>)

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

        return (
            <div className="d-flex flex-column justify-content-center">
                {this.state.showStudent &&  //student
                    <div className="w-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Uredi učenika</h3>
                        </div>
                        <p className="text-center font">ID UČENIKA: {this.state.studentIdPlaceholder} | IME: {studentFirstNamePlaceholder} | PREZIME: {studentLastNamePlaceholder}</p>
                        <form onSubmit={this.handleSubmit} className="w-100 container pozadina">
                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-3">
                                    <label>Ime</label>
                                    <input type="text" required name="ime" value={this.state.ime} className="form-control" placeholder={studentFirstNamePlaceholder} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-3">
                                    <label>Prezime</label>
                                    <input type="text" required name="prezime" value={this.state.prezime} className="form-control" placeholder={studentLastNamePlaceholder} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="my-2 col-md-12 text-center">
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Uredi</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                    </div>
                }
                {this.state.showZadatak &&  //zadatak
                    <div className="w-100 d-flex flex-column justify-content-center h-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Uredi zadatak</h3>
                        </div>
                        <p className="text-center font">ID: {this.state.taskIdPlaceholder} | VRSTA: {this.state.taskTypePlaceholder} | PITANJE: {taskQuestionPlaceholder}</p>
                        <p className="text-center font">TOČAN ODGOVOR: {taskCorrectAnswerPlaceholder} | HINT: {taskHintPlaceholder}</p>
                        <form onSubmit={this.handleSubmit} className="w-100 container pozadina my-2">
                            {this.state.taskTypePlaceholder == "slikovnoOdabir" &&
                                <p className="text-center font">
                                    KOD OVAKVIH PITANJA ĆE BITI PRIKAZANE SLIKE SVIH NOVČANICA I KOVANICA KOJE ĆE UČENIK MOĆI BIRAT DA UNESE TRAŽENU VRIJEDNOST
                                </p>
                            }

                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Pitanje</label>
                                    <textarea required name="pitanje" value={this.state.pitanje} className="form-control" placeholder={taskQuestionPlaceholder} onChange={this.handleChange}></textarea>
                                </div>
                            </div>

                            {this.state.taskTypePlaceholder[0] === "slikovnoOdabir" &&
                                <div className="form-group col-lg">
                                    <label>Tip novca za prikaz</label>
                                    <select required defaultValue={'default'} name="tipNovca" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                        {typeOfMoney}
                                    </select>
                                </div>
                            }

                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Točan odgovor</label>
                                    <textarea required name="tocanOdg" value={this.state.tocanOdg} className="form-control" placeholder={taskCorrectAnswerPlaceholder} onChange={this.handleChange}></textarea>
                                </div>
                            </div>

                            {this.state.taskTypePlaceholder == "odabir" &&
                                <div>
                                    <div className="row justify-content-md-center">
                                        <div className="form-group col-lg">
                                            <label>Drugi odgovor</label>
                                            <textarea required name="odgovor2" value={this.state.odgovor2} className="form-control" placeholder={taskSecondPlaceholder} onChange={this.handleChange}></textarea>
                                        </div>
                                    </div>

                                    <div className="row justify-content-md-center">
                                        <div className="form-group col-lg">
                                            <label>Treći odgovor</label>
                                            <textarea required name="odgovor3" value={this.state.odgovor3} className="form-control" placeholder={taskThirdPlaceholder} onChange={this.handleChange}></textarea>
                                        </div>
                                    </div>

                                    <div className="row justify-content-md-center">
                                        <div className="form-group col-lg">
                                            <label>Četvrti odgovor</label>
                                            <textarea required name="odgovor4" value={this.state.odgovor4} className="form-control" placeholder={taskFourthPlaceholder} onChange={this.handleChange}></textarea>
                                        </div>
                                    </div>
                                </div>
                            }

                            {this.state.taskTypePlaceholder == "slikovnoUnos" &&
                                <div className="row justify-content-md-center">
                                    <div className="form-group col-lg">
                                        <label>Novac za prikaz u obliku: brojValuta;</label>
                                        <input type="text" required name="novacZaPrikaz" value={this.state.novacZaPrikaz} className="form-control" placeholder={taskMoneyPlaceholder} onChange={this.handleChange} />
                                    </div>
                                </div>
                            }

                            <div className="row justify-content-md-center">
                                <div className="form-group col-lg">
                                    <label>Pomoć pri rješavanju (HINT)</label>
                                    <textarea required name="hint" value={this.state.hint} className="form-control" placeholder={taskHintPlaceholder} onChange={this.handleChange} ></textarea>
                                </div>
                            </div>

                            <div className="my-2 col-md-12 text-center">
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Uredi</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                    </div>
                }
                {this.state.showVjezba &&   //grupa zadataka
                    <div className="w-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Uredi vježbu</h3>
                        </div>
                        <p className="text-center font">ID: {this.state.exerciseIdPlaceholder} | NAZIV: {exerciseNamePlaceholder} | NAMJENA: {exercisePurposePlaceholder}</p>
                        <p className="text-center font">VALUTA: {exerciseCurrencyPlaceholder} | POKRENI: {exerciseStartPlaceholder} | ZADACI: {exerciseTasksPlaceholder}</p>
                        <form onSubmit={this.handleSubmit} className="w-100 container pozadina">
                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-4">
                                    <label>Naziv vježbe</label>
                                    <input type="text" required name="naziv" value={this.state.naziv} className="form-control" placeholder={exerciseNamePlaceholder} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-4">
                                    <label>Namjena</label>
                                    <select required defaultValue={'default'} name="namjena" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                        {purpose}
                                    </select>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-4">
                                    <label>Valuta u zadacima</label>
                                    <select required defaultValue={'default'} name="valuta" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                        {currency}
                                    </select>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-4">
                                    <label>Odabrat vježbu za rješavanje? (1-DA, 0-NE)</label>
                                    <select required defaultValue={'default'} name="pokreni" className="form-select" aria-label="Default select example" onChange={(e) => this.handleChange(e, 'value')}>
                                        {choose}
                                    </select>
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group col-xl-4">
                                    <label>Unesite ID zadataka koje želite u vježbi odvojene sa ","</label>
                                    <input type="text" required name="idzadataka" value={this.state.idzadataka} className="form-control" placeholder={exerciseTasksPlaceholder} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="col-md-12 text-center my-2">
                                <button type="submit" className="mx-2 ol btn btn-primary btn-block btn-success mt-2">Uredi</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                    </div>
                }
                {this.state.updateError &&
                    <div className="mt-3"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText}</Alert></div>}
            </div>

        );
    }
}

export default Edit;