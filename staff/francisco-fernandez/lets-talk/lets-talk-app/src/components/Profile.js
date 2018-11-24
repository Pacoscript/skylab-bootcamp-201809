import React, { Component } from 'react'
import logic from '../logic'

class Profile extends Component {
    state = { name: '', surname: '', username: '', password: '', sex: '', age: '', city: '', presentation: '', minAgePref: '', maxAgePref: '' }

    componentDidMount = () => {

        const id = logic._userId

        logic.retrieveUser(id)
            .then(user => { 
                
                const name = user.name
                const surname = user.name
                const username = user.name
                const sex = user.sex
                const age = user.age
                const city = user.city
                const presentation = user.presentation
                const minAgePref = user.minAgePref
                const maxAgePref = user.maxAgePref
                this.setState({ name, surname, username, sex, age, city, presentation, minAgePref, maxAgePref})
             })
       

    }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSexChange = event => {
        const sex = event.target.value

        this.setState({ sex })
    }

    handleAgeChange = event => {
        let age = event.target.value

        age = Number(age)

        this.setState({ age })
    }

    handleCityChange = event => {
        const city = event.target.value

        this.setState({ city })
    }

    handlePresentationChange = event => {
        const presentation = event.target.value

        this.setState({ presentation })
    }

    handleMinAgeChange = event => {
        let minAge = event.target.value

        minAge = Number(minAge)

        this.setState({ minAge })
    }

    handleMaxAgeChange = event => {
        let maxAge = event.target.value

        maxAge = Number(maxAge)

        this.setState({ maxAge })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, sex, age, city, presentation, minAge, maxAge } = this.state

        this.props.onRegister(name, surname, username, password, sex, age, city, presentation, minAge, maxAge)
    }
    render() {
        return <main className='landing'>

            <section>
                <h1 className='subtitle'>Edit your profile</h1>
            </section>

            <section className='login'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <p>Name  <input  value={this.state.name} onChange={this.handleNameChange} /></p>
                    <p>Surname <input value={this.state.surname} onChange={this.handleSurnameChange} /> </p>
                    <p>Username <input value={this.state.username} onChange={this.handleUsernameChange} /> </p>
                    <p>Password <input onChange={this.handlePasswordChange} type='password' /> </p>
                    <p>Sex <input value={this.state.sex} onChange={this.handleSexChange} /> </p>
                    <p>Age <input value={this.state.age} onChange={this.handleAgeChange} /> </p>
                    <p>City <input value={this.state.city} onChange={this.handleCityChange} /> </p>
                    <p>Presentation <textarea value={this.state.presentation} onChange={this.handlePresentationChange}></textarea> </p>
                    <p>Min Age <input value={this.state.minAgePref} onChange={this.handleMinAgeChange} /> </p>
                    <p>Max Age <input value={this.state.maxAgePref} onChange={this.handleMaxAgeChange} /> </p>

                    <p><button type='submit' className='button'>Update</button></p>

                    <section>
                        <h3>Add photos</h3>
                        <button>photo 1</button>
                        <button>photo 2</button>
                        <button>photo 3</button>
                    </section>
                </form>
            </section>
        </main>
    }
}


export default Profile