import React, { Component } from 'react'
import Thread from './Thread'
import logic from '../logic'

class Messages extends Component {

    state = { contactId: this.props.contactId, contactName: 'name', messages: [], text: '', flag: false }

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
                    

                    this.setState({ messages })

                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }
        // debugger
        // var objDiv = document.getElementById("messages__box")
        // objDiv.scrollTop = 9999
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

            <section>
                <h3 className='subtitle'>Messages with {this.state.contactName}</h3>
            </section>


            <section className='messages'>

                <div  id='messages__box'>
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