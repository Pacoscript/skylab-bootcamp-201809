import React, { Component } from 'react'
import Contact from './Contact'
import logic from '../logic'

class Contacts extends Component {

  state = { listContacts: [] }

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

    
  render() {
    return <main className='contacts'>

      <section>
        <h3 class='subtitle'>My contacts...</h3>
      </section>

      <section>
        {this.state.listContacts.map(contact => <Contact key={contact.id} id={contact.id} name={contact.name} photo={contact.photo} onGoContact={this.props.onGoContact} />)}
      </section>

    </main>
  }
}

export default Contacts