import React, { Component } from 'react'

class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', sex: '', age: '', city: '', presentation: '', minAge: '', maxAge: '' }

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
                <h1 className='subtitle'>Register</h1>
            </section>

            <section className='login'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <p>Name  <input onChange={this.handleNameChange} /></p>
                    <p>Surname <input onChange={this.handleSurnameChange} /> </p>
                    <p>Username <input onChange={this.handleUsernameChange} /> </p>
                    <p>Password <input onChange={this.handlePasswordChange} type='password' /> </p>
                    <p>Sex <input onChange={this.handleSexChange} /> </p>
                    <p>Age <input onChange={this.handleAgeChange} /> </p>
                    <p>City <input onChange={this.handleCityChange} /> </p>
                    <p>Presentation <textarea onChange={this.handlePresentationChange}></textarea> </p>
                    <p>Min Age <input onChange={this.handleMinAgeChange} /> </p>
                    <p>Max Age <input onChange={this.handleMaxAgeChange} /> </p>

                    <p><button type='submit' className='button'>Register</button></p>
                </form>
            </section>
        </main>
    }
}


export default Register