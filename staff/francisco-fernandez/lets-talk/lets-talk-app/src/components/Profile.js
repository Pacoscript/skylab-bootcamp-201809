import React, { Component } from 'react'
import logic from '../logic'
import FileBase64 from "react-file-base64"
import Error from './Error'
import MDSpinner from "react-md-spinner"

class Profile extends Component {
    state = { name: '', surname: '', username: '', password: '', newPassword: '', newPassword2: '', sex: '', age: '', city: '', presentation: '', minAgePref: '', maxAgePref: '', photo1: undefined, photo2: undefined, photo3: undefined, whichPhoto: 'photo1', loading: true, error: null}

    componentDidMount = () => {

        const id = logic._userId

        logic.retrieveUser(id)
            .then(user => {

                const name = user.name
                const surname = user.surname
                const username = user.username
                const password = 'password'
                const newPassword = null
                const newPassword2 = null
                const sex = user.sex
                const age = user.age
                const city = user.city
                const presentation = user.presentation
                const minAgePref = user.minAgePref
                const maxAgePref = user.maxAgePref
                const photo1 = user.photo1
                const photo2 = user.photo2
                const photo3 = user.photo3
                this.setState({ name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref, photo1, photo2, photo3 })
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

    handleNewPasswordChange = event => {
        const newPassword = event.target.value

        this.setState({ newPassword })
    }

    handleRepeatPasswordChange = event => {
        const newPassword2 = event.target.value

        this.setState({ newPassword2 })
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
        // event.preventDefault()

        const { name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref } = this.state
        
        try {
            logic.updateUser(name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref)
        } catch (err) {
            
            this.setState({ error: err.message })
        }

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
                    [whichPhoto]: photo,
                    loading: true
                })


            })
            .catch(err => this.setState({ error: err.message }))

    }

    render() {

        const error = this.state.error

        return <main className='profile'>

            <section>
                <h1 className='subtitle'>Edit your profile</h1>
            </section>

            {error && <Error message={error} />}

            <section className='profile__section'>
                <form className='profile__form' onSubmit={this.handleSubmit}>
                    <label>Name  </label>
                    <input className='profile__input' maxLength='16' value={this.state.name} onChange={this.handleNameChange} />
                    <label>Surname </label>
                    <input className='profile__input' maxLength='16' value={this.state.surname} onChange={this.handleSurnameChange} />
                    <label>Username </label>
                    <input className='profile__input' maxLength='16' value={this.state.username} onChange={this.handleUsernameChange} />
                    <label>New Passw </label>
                    <input className='profile__input' maxLength='16' onChange={this.handleNewPasswordChange} type='password' />
                    <label>Repeat Passw </label>
                    <input className='profile__input' maxLength='16' onChange={this.handleRepeatPasswordChange} type='password' />
                    <label>Password</label>
                    <input className='profile__input' maxLength='16' onChange={this.handlePasswordChange} type='password' />
                    <label>Sex </label>
                    <input className='profile__input' value={this.state.sex} onChange={this.handleSexChange} />
                    <label>Age</label>
                    <input className='profile__input' maxLength='16' value={this.state.age} onChange={this.handleAgeChange} />
                    <label>City</label>
                    <input className='profile__input' maxLength='16' value={this.state.city} onChange={this.handleCityChange} />
                    <label>Presentation</label>
                    <textarea className='profile__textarea' maxLength='280' value={this.state.presentation} onChange={this.handlePresentationChange}></textarea>
                    <label>Min Age</label>
                    <input name='quantity' min='18' max='100' className='profile__input' maxLength='16' value={this.state.minAgePref} onChange={this.handleMinAgeChange} />
                    <label>Max Age</label>
                    <input name='quantity' min='18' max='100' className='profile__input' maxLength='16' value={this.state.maxAgePref} onChange={this.handleMaxAgeChange} />

                    <p><button type='submit' className='profile__button'>Update</button></p>

                </form>
                <section>
                    <h3>Add photos</h3>
                    <div>
                        <p>Upload your photos <select onChange={this.handlePhotoChange}>
                            <option value="photo1">photo1</option>
                            <option value="photo2">photo2</option>
                            <option value="photo3">photo3</option>
                        </select> </p>

                        <div className="spinner">{!this.state.loading ? <MDSpinner /> : ''}</div>

                        <div className="container-input">
                            <FileBase64 className="input" multiple={false} onDone={this.getFiles} />
                        </div>
                        <h3>Photo 1</h3>
                        <div className='profile__img__container'>
                            {(this.state.photo1 !== '#') ? <img alt='' className='profile__image' src={this.state.photo1}></img> : <img alt='' className='profile__image' src="./images/blank-profile-picture-973461_640.png"></img>}
                        </div>
                        <h3>Photo 2</h3>
                        <div className='profile__img__container'>
                            {(this.state.photo2 !== '#') ? <img alt='' className='profile__image' src={this.state.photo2}></img> : <img alt='' className='profile__image' src="./images/blank-profile-picture-973461_640.png"></img>}
                        </div>
                        <h3>Photo 3</h3>
                        <div className='profile__img__container'>
                            {(this.state.photo3 !== '#') ? <img alt='' className='profile__image' src={this.state.photo3}></img> : <img alt='' className='profile__image' src="./images/blank-profile-picture-973461_640.png"></img>}
                        </div>
                    </div>

                </section>
            </section>
        </main>
    }
}


export default Profile