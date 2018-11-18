const { User, Message } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
// const fs = require('fs')
// const path = require('path')

const logic = {
    registerUser(name, surname, username, password) {
        validate([{ key: 'name', value: name, type: String }, { key: 'surname', value: surname, type: String }, { key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, surname, username, password })

            await user.save()
        })()
    },

    authenticateUser(username, password) {
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

    updateUser(id, name, surname, username, newPassword, password) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: surname, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    }
}

module.exports = logic