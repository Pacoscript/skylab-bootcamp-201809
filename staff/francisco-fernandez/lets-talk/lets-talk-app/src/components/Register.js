import React, { Component } from 'react'
import Error from './Error'

class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', sex: '', age: '', city: '', presentation: '', minAgePref: '', maxAgePref: '', error: undefined }

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
        let minAgePref = event.target.value

        minAgePref = Number(minAgePref)

        this.setState({ minAgePref })
    }

    handleMaxAgeChange = event => {
        let maxAgePref = event.target.value

        maxAgePref = Number(maxAgePref)

        this.setState({ maxAgePref })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = this.state

        this.props.onRegister(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)

    }



    render() {

        const error = this.props.error

        return <main className='landing'>
            
            <section>
                <h1 className='subtitle'>Register</h1>
            </section>
            {error && <Error message={error} />}
            <section className='register'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <p>Name  <input maxLength='16' onChange={this.handleNameChange} /></p>
                    <p>Surname <input maxLength='16' onChange={this.handleSurnameChange} /> </p>
                    <p>Username <input maxLength='16' onChange={this.handleUsernameChange} /> </p>
                    <p>Password <input maxLength='16' onChange={this.handlePasswordChange} type='password' /> </p>
                    <p>Sex <select defaultValue="" onChange={this.handleSexChange}>
                        <option value="">CHOSE YOUR SEX</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                    </select> </p>
                    <p>Age <input maxLength='16' onChange={this.handleAgeChange} /> </p>
                    <p>City <input maxLength='16' onChange={this.handleCityChange} /> </p>
                    <p>Presentation <textarea maxLength='280' onChange={this.handlePresentationChange}></textarea> </p>
                    <p>Min Age <input maxLength='16' onChange={this.handleMinAgeChange} /> </p>
                    <p>Max Age <input maxLength='16' onChange={this.handleMaxAgeChange} /> </p>

                    <p><button type='submit' className='button'>Register</button></p>
                </form>
            </section>
        </main>
    }
}


export default Register