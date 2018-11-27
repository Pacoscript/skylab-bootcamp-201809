import React, { Component } from 'react'
import Error from './Error'

class Login extends Component {

    state = { username: '', password: '' }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.props.onLogin(username, password)
    }


    render() {

        const error = this.props.error

        return <main className='landing'>

            <section>
                <h1 className='subtitle'>Login</h1>
            </section>

            {error && <Error message={error} />}

            <section className='login'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <p>Username <input maxLength='16' onChange={this.handleUsernameChange}/> </p>
                    <p>Password <input  maxLength='16' onChange={this.handlePasswordChange} type='password'/> </p>

                    <p><button type='submit' className='button' >Login</button></p>
                </form>



            </section>

        </main>
    }
}


export default Login