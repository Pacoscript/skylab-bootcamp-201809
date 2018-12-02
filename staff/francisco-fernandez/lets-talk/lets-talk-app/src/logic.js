const validate = require('./utils/validate')

const logic = {

    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    // url: 'NO-URL',

    url : 'http://localhost:5000/api',

    registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref) {

        validate([{ key: 'name', value: name, type: String },
        { key: 'surname', value: surname, type: String },
        { key: 'username', value: username, type: String },
        { key: 'password', value: password, type: String },
        { key: 'sex', value: sex, type: String },
        { key: 'age', value: age, type: Number },
        { key: 'city', value: city, type: String },
        { key: 'presentation', value: presentation, type: String },
        { key: 'minAgePref', value: minAgePref, type: Number },
        { key: 'maxAgePref', value: maxAgePref, type: Number }])

        if ((age < 18) || (minAgePref < 18)) throw Error('not for children under 18')
        if ((minAgePref > maxAgePref)) throw Error('minAgePref must be inferior to maxAgePref')
        
        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref })
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)
            })
    },

    updateUser(name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref) {

        validate([{ key: 'name', value: name, type: String, optional: true },
        { key: 'surname', value: surname, type: String, optional: true},
        { key: 'username', value: username, type: String, optional: true},
        { key: 'password', value: password, type: String },
        { key: 'newPassword', value: newPassword, type: String, optional: true },
        { key: 'newPassword2', value: newPassword2, type: String, optional: true },
        { key: 'sex', value: sex, type: String , optional: true},
        { key: 'age', value: age, type: Number , optional: true},
        { key: 'city', value: city, type: String , optional: true},
        { key: 'presentation', value: presentation, type: String , optional: true},
        { key: 'minAgePref', value: minAgePref, type: Number , optional: true},
        { key: 'maxAgePref', value: maxAgePref, type: Number , optional: true}])

        if ((age < 18) || (minAgePref < 18)) throw Error('not for children under 18')
        if ((minAgePref > maxAgePref)) throw Error('minAgePref must be inferior to maxAgePref')

        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref })
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)
            })


    },

    login(username, password) {
        validate([
            { key: 'username', value: username, type: String },
            { key: 'password', value: password, type: String }])

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },

    retrieveCandidates(id) {
        validate([
            { key: 'id', value: id, type: String }])

        return fetch(`${this.url}/users/${id}/candidates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })

    },

    retrieveUser(id) {

        validate([{ key: 'id', value: id, type: String }])

        return fetch(`${this.url}/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.data
            })


    },

    retrieveUserPhotos(id) {

        validate([{ key: 'id', value: id, type: String }])

        return fetch(`${this.url}/users/${id}/photos`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })


    },

    addContact(id, idContact) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'idContact', value: idContact, type: String }])

        return fetch(`${this.url}/users/${id}/contacts`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'

            },
            body: JSON.stringify({ id, idContact })
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)

            })

    },

    listContacts(id) {
        validate([
            { key: 'id', value: id, type: String }])

        return fetch(`${this.url}/users/${id}/contacts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })

    },

    addMessage(user, sentTo, text) {
        validate([
            { key: 'user', value: user, type: String },
            { key: 'sentTo', value: sentTo, type: String },
            { key: 'text', value: text, type: String }])

        return fetch(`${this.url}/users/${user}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ user, sentTo, text })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

            })


    },

    retrieveMessages(id, idContact) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'idContact', value: idContact, type: String }])

        return fetch(`${this.url}/users/${id}/messages/${idContact}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)

                return res.data
            })

    },

    checkMessages(id, idContact){

        validate([
            { key: 'id', value: id, type: String },
            { key: 'idContact', value: idContact, type: String }])

            return fetch(`${this.url}/users/${id}/messages/${idContact}/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this._token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(res => res.json())
                .then(res => {
    
                    if (res.error) throw Error(res.error)
    
                    return res.data
                })

    },

    checkNewMessages(id){

        validate([{ key: 'id', value: id, type: String }])

            return fetch(`${this.url}/users/${id}/newMessages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this._token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(res => res.json())
                .then(res => {
    
                    if (res.error) throw Error(res.error)
    
                    return res.data
                })

    },

    uploadUserPhoto(base64Image, photo) {

        validate([
            { key: 'base64Image', value: base64Image, type: String },
            { key: 'photo', value: photo, type: String }])

        return fetch(`${this.url}/upload`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'

            },
            body: JSON.stringify({ base64Image, photo })
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)


                return res.photo


            })

    },

    get loggedIn() {
        return !this._userId
    },

    logout() {

        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    }

}

// export default logic
module.exports = logic