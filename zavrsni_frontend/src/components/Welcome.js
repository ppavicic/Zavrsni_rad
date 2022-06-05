import React from 'react'
import image from '../images/monopoly.png'
import '../styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate, Link } from 'react-router-dom'
import { URL } from './Constants'
import axios from 'axios'
axios.defaults.withCredentials = true;

class Welcome extends React.Component {

    constructor() {
        super();
        this.state = {
            loginRedirect: false,
            loginTeacherRedirect: false,
        }
        this.login = this.login.bind(this)
        this.loginTeacher = this.loginTeacher.bind(this)
        this.getExercise = this.getExercise.bind(this)
    }

    componentDidMount() {
        this.getExercise()
    }

    login() {
        this.setState({
            loginRedirect: true
        })
    }

    loginTeacher() {
        this.setState({
            loginTeacherRedirect: true
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
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        if (this.state.loginRedirect) {
            return <Navigate to='/login' />
        }

        if (this.state.loginTeacherRedirect) {
            return <Navigate to='/loginTeacher' />
        }

        if (sessionStorage.getItem('loginToken') !== null) {
            var obj = JSON.parse(sessionStorage.getItem('loginToken'));
            if (obj.role == 'ucitelj') {
                return <Navigate to='/TeacherProfile' />

            } else {
                return <Navigate to='/' />
            }
        }
        var imageRender = {
            imageRendering: `-webkit-optimize-contrast`,
            maxWidth: `100%`,
            maxHeight: `100%`
        }
        return (
            <div className='d-flex flex-column align-items-center'>
                <h1 className='container text-center py-2 naslov'>DOBRODOŠLI NA VJEŽBALICU!</h1>
                <div className='w-25 container text-center font pozadina'>Za početak vježbe pritisni START</div>
                <div className='my-2 w-50 h-25 d-flex justify-content-center'>
                    <img alt='monopoly guy' style={imageRender} src={image}></img>
                </div>
                <div className='container mt-2 w-50 d-flex flex-column justify-content-center align-items-center font pozadina'>
                    <div className='mt-2'>
                        <Link to="/loginStudent" className="btn btn-primary btn-lg">START</Link>
                    </div>
                    <div className="mt-1">
                        <span className=''>Nastavnik/ica? </span> <Link to="/loginTeacher">Prijavi se!</Link>
                    </div>
                </div>
            </div >
        )
    }

}

export default Welcome;