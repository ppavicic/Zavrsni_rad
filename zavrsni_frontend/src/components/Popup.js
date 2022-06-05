import React from 'react'
import '../styles/popup.css'
import '../styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
axios.defaults.withCredentials = true;

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            content: this.props.content
        }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        this.props.handleClose()
    }

    render() {
        return (
            <div className="popup-box">
                <div className="box pozadina">
                    <span className="close-icon" onClick={this.handleClose}>x</span>
                    <div>
                        {this.state.content}
                    </div>
                </div>
            </div>
        )
    }
}

export default Popup;