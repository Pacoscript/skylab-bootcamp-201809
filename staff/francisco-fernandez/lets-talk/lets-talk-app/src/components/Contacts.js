import React, { Component } from 'react'
import logic from '../logic'

class Contacts extends Component {

  state = { listContacts: []}

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
    return     <main>

    <section>
      <h3 class= 'subtitle'>My contacts...</h3>
    </section>
 
    <div class='contacts__container'>
    <section class='contact'>
      <h2 class= 'contact__name'>
        Ana
      </h2>
      <div class= 'img_container'>
          <img class= 'contact__image' src="./images/blank-profile-picture-973461_640.png"></img>
      </div>
    </section>

    <section class='contact'>
        <h2 class= 'contact__name'>
          Ana
        </h2>
        <div class= 'img_container'>
            <img class= 'contact__image' src="./images/blank-profile-picture-973461_640.png"></img>
        </div>
      </section>

      <section class='contact'>
        <h2 class= 'contact__name'>
          Ana
        </h2>
        <div class= 'img_container'>
            <img class= 'contact__image' src="./images/blank-profile-picture-973461_640.png"></img>
        </div>
      </section>

      <section class='contact'>
        <h2 class= 'contact__name'>
          Ana
        </h2>
        <div class= 'img_container'>
            <img class= 'contact__image' src="./images/blank-profile-picture-973461_640.png"></img>
        </div>
      </section>
    </div>


  </main>
}
}

export default Contacts