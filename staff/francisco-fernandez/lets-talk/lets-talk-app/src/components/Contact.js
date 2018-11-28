import React, { Component } from 'react'
import logic from '../logic'
import Error from './Error'


class Contact extends Component {

    state = { error: null, photoFlag: false, contactPhotos: [] }

    componentDidMount() {

        const id = logic._userId

        const contactId = this.props.id

        try {
            logic.retrieveMessages(id, contactId)
                .then(messages => {

                    if (messages.length > 3) this.setState({ photoFlag: true })

                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

        try {
            logic.retrieveUserPhotos(contactId)

                .then(photos => {
                    this.setState({ contactPhotos: photos })
                    if (this.state.contactPhotos && photos.photo1 === '#') {
                        const contactPhotos = this.state.contactPhotos
                        contactPhotos.photo1 = "./images/blank-profile-picture-973461_640.png"
                        this.setState({ contactPhotos })
                    }
                })

        }
        catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {

        const error = this.state.error

        return <section className='contact' onClick={() => this.props.onGoContact(this.props.id, this.props.name)}>
            {error && <Error message={error} />}
            <h2 className='contact__name'>
                {this.props.name}
            </h2>
            <div className='contact__img__container'>
                {this.state.photoFlag && <img className='contact__image' src={this.state.contactPhotos && this.state.contactPhotos.photo1}></img>}
                {!this.state.photoFlag && <img className='contact__image' src="./images/blank-profile-picture-973461_640.png"></img>}
            </div>
        </section>

    }

}

export default Contact