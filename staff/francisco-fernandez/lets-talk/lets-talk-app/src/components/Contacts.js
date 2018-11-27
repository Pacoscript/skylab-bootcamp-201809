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


  render() {

    const error = this.state.error

    return <main className='contacts'>
      {error && <Error message={error} />}
      <section>
        <h3 class='subtitle'>My contacts...</h3>
      </section>

      <section>
        {this.state.listContacts.map(contact => <Contact key={contact.id} id={contact.id} name={contact.name} onGoContact={this.props.onGoContact} />)}
      </section>

    </main>
  }
}

export default Contacts