import React, { Component } from 'react'
import Thread from './Thread'
import logic from '../logic'
import Error from './Error'


class Messages extends Component {

    state = { error: null, contactId: this.props.contactId, contactPhotos: undefined, contactName: this.props.contactName, messages: [], text: '', flag: false, photoFlag: false }

    componentDidMount() {

        const id = logic._userId

        const contactId = this.state.contactId
        
        try {
            logic.retrieveMessages(id, contactId)
                .then(messages => {
                    if (messages.length > 0) {
                        if (messages[messages.length - 1].user === id) {
                            
                            this.setState({ flag: true })
                            this.setState({ contactName: messages[messages.length - 1].nameSentTo })
                        }

                        else
                            this.setState({ contactName: messages[messages.length - 1].nameUser })
                    }
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

        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView();
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
                    if (messages[messages.length - 1].user === id) this.setState({ flag: true })
                    this.setState({ messages })
                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

    }

    handlePhotos = () => {
        const contactId = this.state.contactId
        const contactName = this.state.contactName

        this.props.onGoPhotos(contactId, contactName)
    }


    render() {

        const error = this.state.error

        return <main className='messages__page'>
            {error && <Error message={error} />}
            <section className='messages__head'>
                {this.state.photoFlag && <div className='imgmini__container'><img alt="imgmini face" className='imgmini' src={this.state.contactPhotos && this.state.contactPhotos.photo1}></img></div>}
                {!this.state.photoFlag && <div className='imgmini__container'><img alt="imgmini face" className='imgmini' src="./images/blank-profile-picture-973461_640.png"></img></div>}
                <div><h1 className='messages__name'> {this.state.contactName}</h1></div>

            </section>


            <section className='messages'>

                <div id='messages__box'>
                    {this.state.messages.map(message => <Thread key={message.id} name={message.nameUser} id={message.id} photo={message.sentTo} text={message.text} />)}
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            </section>

            <form className='new-message' onSubmit={this.handleSubmit}>
                {this.state.flag && <textarea maxLength='280' className='new-message__text' onChange={this.handleTextChange}>
                    You must wait to be responded until send a message again
                </textarea>}
                {!this.state.flag && <textarea maxLength='280' className='new-message__text' onChange={this.handleTextChange}>

                </textarea>}
                <div className='button_send'>
                    {this.state.flag && <button disabled className='message__button' type='submit'>Send, good luck!</button>}
                    {!this.state.flag && <button className='message__button' type='submit'>Send, good luck!</button>}
                    <button className='message__button' onClick={this.handlePhotos}>Photos</button>
                </div>
            </form>

        </main>

    }
}

export default Messages