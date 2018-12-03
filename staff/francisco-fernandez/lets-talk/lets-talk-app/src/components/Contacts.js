import React, { Component } from 'react'
import Contact from './Contact'
import logic from '../logic'
import Error from './Error'

class Contacts extends Component {

  state = { error: null, listContacts: [] }

  componentDidMount = () => {

    const id = logic._userId

    try {
      logic.listContacts(id)
        .then(listContacts => this.setState({ listContacts }))
        .catch(err => this.setState({ error: err.message }))
    }
    catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleBlock = (user1, user2) =>{
    
    logic.blockUser(user1, user2)

  }

  render() {

    const error = this.state.error

    return <main className='contacts'>
      {error && <Error message={error} />}
      <section className='presentation__header'>
        <h3 className='presentation__title'>My contacts...</h3>
      </section>


      <section className='contacts__section'>
        {this.state.listContacts.map(contact => <Contact key={contact.id} id={contact.id} name={contact.name} onGoContact={this.props.onGoContact} onBlockContact={this.handleBlock} />)}
        {(this.state.listContacts.length === 0) && `You don´t have any contact yet, what are you waiting for?`}
      </section>

    </main>
  }
}

export default Contacts