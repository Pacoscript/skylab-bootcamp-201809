import React, { Component } from 'react'
import Thread from './Thread'
import logic from '../logic'

class Messages extends Component {

    state = { contactId: this.props.contactId, contactPhotos: undefined, contactName: 'name', messages: [], text: '', flag: true, photoFlag: false }

    componentDidMount() {

        const id = logic._userId

        const contactId = this.state.contactId

        try {
            logic.retrieveMessages(id, contactId)
                .then(messages => {
                    if (messages[messages.length - 1].user === id) {
                        this.setState({ flag: true })
                        this.setState({ contactName: messages[messages.length - 1].nameSentTo })

                    }

                    else
                        this.setState({ contactName: messages[messages.length - 1].nameUser })
                    if (messages.length > 3) this.setState({ photoFlag: true })


                    this.setState({ messages })

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

    handleTextChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleSubmit = event => {
        event.preventDefault()

        const id = logic._userId

        const contactId = this.state.contactId

        const text = this.state.text

        try {
            logic.addMessage(id, contactId, text)
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

        try {
            logic.retrieveMessages(id, contactId)
                .then(messages => {

                    this.setState({ messages })
                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }
    }


    render() {
        return <main className='messages__page'>

            <section className='messages__head'>
                {this.state.photoFlag && <div><img className='imgmini' src={this.state.contactPhotos && this.state.contactPhotos.photo1}></img></div>}
                {!this.state.photoFlag && <div><img className='imgmini' src="./images/blank-profile-picture-973461_640.png"></img></div>}
                <div><h1 className='messages__name'> {this.state.contactName}</h1></div>

            </section>


            <section className='messages'>

                <div id='messages__box'>
                    {this.state.messages.map(message => <Thread key={message.id} name={message.nameUser} id={message.id} photo={message.sentTo} text={message.text} />)}
                </div>
            </section>

            <form className='new-message' onSubmit={this.handleSubmit}>
                {this.state.flag && <textarea className='new-message__text' onChange={this.handleTextChange}>
                    You must wait to be responded until send a message again
                </textarea>}
                {!this.state.flag && <textarea className='new-message__text' onChange={this.handleTextChange}>

                </textarea>}
                <div className='button_send'>
                    {this.state.flag && <button disabled className='button' type='submit'>Send, good luck!</button>}
                    {!this.state.flag && <button disabled className='button' type='submit'>Send, good luck!</button>}
                    <button className='button'>Photos</button>
                </div>
            </form>




        </main>
    }
}

export default Messages