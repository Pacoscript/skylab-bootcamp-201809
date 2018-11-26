import React, { Component } from 'react'
import logic from '../logic'


class Contact extends Component {

    state = { photoFlag: false, contactPhotos: [] }

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
        return <section className='contact' onClick={() => this.props.onGoContact(this.props.id, this.props.name)}>
            <h2 className='contact__name'>
                {this.props.name}
            </h2>
            <div className='img_container'>
                {this.state.photoFlag && <img className='contact__image' src={this.state.contactPhotos && this.state.contactPhotos.photo1}></img>}
                {!this.state.photoFlag && <img className='contact__image' src="./images/blank-profile-picture-973461_640.png"></img>}
            </div>
        </section>

    }

}

export default Contact