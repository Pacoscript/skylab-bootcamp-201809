import React, {Component} from 'react'
import Thread from './Thread'
import logic from '../logic'

class Messages extends Component{
    
    state = {contactId: this.props.contactId, messages: [], text: ''}

    componentDidMount(){
        
        const id = logic._userId

        const contactId = this.state.contactId
     
        try {
            logic.retrieveMessages(id, contactId)
                .then (messages =>{
                    
                    this.setState({messages})})
                .catch(err => this.setState({ error: err.message }))
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
                .then (messages =>this.setState({messages}))
                .catch(err => this.setState({ error: err.message }))
          }
          catch (err) {
            this.setState({ error: err.message })
          }
    }
    


    render (){
    return     <main className='messages__page'>

    <section>
        <h3 className='subtitle'>Messages with...</h3>
    </section>


    <section className='messages'>
       
        <div>
        {this.state.messages.map(message => <Thread key={message.id} name= {message.nameUser} id={message.id} photo={message.sentTo} text={message.text}/>)}
        </div>
    </section>

    <form className='new-message' onSubmit={this.handleSubmit}>
        <textarea className='new-message__text' onChange={this.handleTextChange}>
                
            </textarea>
            <div className='button_send'>
    <button className='button' type= 'submit'>Send, good luck!</button>
    <button className='button'>Photos</button>
    </div>
    </form>
    



</main>
}
}

export default Messages