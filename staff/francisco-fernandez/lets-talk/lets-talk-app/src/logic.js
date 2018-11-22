const validate = require('./utils/validate')

const logic = {

    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

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

    addContact(id, idContact){
        debugger
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
                    debugger
                    if (res.error) throw Error(res.error)
    
                })
        
    },

    listContacts(id){
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