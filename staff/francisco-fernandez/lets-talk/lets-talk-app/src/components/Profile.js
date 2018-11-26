import React, { Component } from 'react'
import logic from '../logic'
import FileBase64 from "react-file-base64"

class Profile extends Component {
    state = { name: '', surname: '', username: '', password: '', sex: '', age: '', city: '', presentation: '', minAgePref: '', maxAgePref: '', photo1: undefined, photo2: undefined, photo3: undefined, whichPhoto: 'photo1', loading: false }

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
                const photo1 = user.photo1
                const photo2 = user.photo2
                const photo3 = user.photo3
                this.setState({ name, surname, username, sex, age, city, presentation, minAgePref, maxAgePref, photo1, photo2, photo3 })
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

    handlePhotoChange = event => {
        event.preventDefault()

        const whichPhoto = event.target.value

        this.setState({ whichPhoto })
    }

    getFiles = files => {
        this.setState({
            loading: false
        })
        this.uploadUserPhoto(files.base64)
    }

    uploadUserPhoto(photo) {
        const whichPhoto = this.state.whichPhoto
        logic.uploadUserPhoto(photo, whichPhoto)
            .then(photo => {
                this.setState({
                    photo,
                    loading: true
                })
            })
            .catch(err => this.setState({ error: err.message }))

    }


    render() {
        return <main className='landing'>

            <section>
                <h1 className='subtitle'>Edit your profile</h1>
            </section>

            <section className='login'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <p>Name  <input value={this.state.name} onChange={this.handleNameChange} /></p>
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

                </form>
                <section>
                    <h3>Add photos</h3>
                    <div>
                        <p>Upload your photos <select onChange={this.handlePhotoChange}>
                            <option value="photo1">photo1</option>
                            <option value="photo2">photo2</option>
                            <option value="photo3">photo3</option>
                        </select> </p>
                        <div className="container-input">
                            <FileBase64 className="input" multiple={false} onDone={this.getFiles} />
                        </div>
                        <div className='img_container'>
                            <div>{this.state.photo1 ? <img className='contact__image' src={this.state.photo1}></img> : ""}</div>
                        </div>
                        <div className='img_container'>
                            <div>{this.state.photo2 ? <img className='contact__image' src={this.state.photo2}></img> : ""}</div>
                        </div>
                        <div className='img_container'>
                            <div>{this.state.photo3 ? <img className='contact__image' src={this.state.photo3}></img> : ""}</div>
                        </div>
                    </div>
                    
                </section>
            </section>
        </main>
    }
}


export default Profile