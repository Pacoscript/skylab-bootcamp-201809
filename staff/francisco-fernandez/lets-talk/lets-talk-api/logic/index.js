const { User, Message } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
var cloudinary = require('cloudinary')
// const fs = require('fs')
// const path = require('path')

cloudinary.config({
    cloud_name: 'skylab-paco',
    api_key: '398374729263247',
    api_secret: '8QwEJKmVzZU8T3ptAXWxycxGDm4'
})

const logic = {
    /**
     * 
     * @param {string} base64Image 
     */
    _saveImage(base64Image) {
        return Promise.resolve().then(() => {
            if (typeof base64Image !== 'string') throw new LogicError('base64Image is not a string')

            return new Promise((resolve, reject) => {
                return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                    if (err) return reject(err)

                    resolve(data.url)
                })
            })
        })
    },

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

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            let created = Date.now()

            user = new User({ name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref, created })

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
            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

    updateUser(id, name, surname, username, newPassword, password, sex, age, city, presentation, minAgePref, maxAgePref) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: surname, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String },
            { key: 'sex', value: sex, type: String, optional: true },
            { key: 'age', value: age, type: Number, optional: true },
            { key: 'city', value: city, type: String, optional: true },
            { key: 'presentation', value: presentation, type: String, optional: true },
            { key: 'minAgePref', value: minAgePref, type: Number, optional: true },
            { key: 'maxAgePref', value: maxAgePref, type: Number, optional: true },
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
                sex != null && (user.sex = sex)
                age != null && (user.age = age)
                city != null && (user.city = city)
                presentation != null && (user.presentation = presentation)
                minAgePref != null && (user.minAgePref = minAgePref)
                maxAgePref != null && (user.maxAgePref = maxAgePref)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)
                sex != null && (user.sex = sex)
                age != null && (user.age = age)
                city != null && (user.city = city)
                presentation != null && (user.presentation = presentation)
                minAgePref != null && (user.minAgePref = minAgePref)
                maxAgePref != null && (user.maxAgePref = maxAgePref)

                await user.save()
            }
        })()
    },

    addContact(id, idContact) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'idContact', value: idContact, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const newContact = await User.findById(idContact)

            if (!newContact) throw new NotFoundError(`user with id ${idContact} not found`)

            if (user.id === newContact.id) throw new NotAllowedError('user cannot add himself as a collaborator')

            user.contacts.forEach(_contactId => {
                if (_contactId === newContact.id) throw new AlreadyExistsError(`user with id ${id} arleady has collaborator with id ${_contactId}`)
            })

            user.contacts.push(newContact._id)

            await user.save()
        })()
    },

    addMessage(user, sentTo, text) {
        validate([
            { key: 'user', value: user, type: String },
            { key: 'sentTo', value: sentTo, type: String },
            { key: 'text', value: text, type: String }
        ])
        return (async () => {

            const _user = await User.findById(user)

            if (!_user) throw new NotFoundError(`user with id ${user} not found`)

            const user2 = await User.findById(sentTo)

            if (!user2) throw new NotFoundError(`user with id ${sentTo} not found`)

            if (!_user.contacts.includes(user2.id)) throw new NotFoundError(`user with id ${sentTo} is not a contact of user with id ${user}`)

            let sentDate = Date.now()
            message = new Message({ text, user, sentTo, sentDate })

            await message.save()


        })()

    },

    retrieveMessages(user1, user2) {
        validate([
            { key: 'user1', value: user1, type: String },
            { key: 'user2', value: user2, type: String }
        ])
        return (async () => {

            const _user1 = await User.findById(user1)

            if (!_user1) throw new NotFoundError(`user1 with id ${user1} not found`)

            const _user2 = await User.findById(user2)

            if (!_user2) throw new NotFoundError(`user with id ${user2} not found`)

            if (!_user1.contacts.includes(_user2.id)) throw new NotFoundError(`user with id ${sentTo} is not a contact of user with id ${user}`)

            var ObjectId = require('mongoose').Types.ObjectId
            let messages = await Message.find({
                $or: [{ user: new ObjectId(user1), sentTo: new ObjectId(user2) },
                { user: new ObjectId(user2), sentTo: new ObjectId(user1) }]
            })

            messages.sort(function (a, b) {
                return (a.sentDate - b.sentDate)
            })

            return messages

        })()
    },

    listCandidates(user) {

        validate([
            { key: 'user', value: user, type: String }
        ])

        return (async () => {

            const _user = await User.findById(user)

            if (!_user) throw new NotFoundError(`user with id ${user} not found`)

            let sexSearch = ''

            if (_user.sex === 'MALE') sexSearch = 'FEMALE'
            else sexSearch = 'MALE'

            let candidates = await User.find({ sex: sexSearch, age: { $gte: _user.minAgePref, $lte: _user.maxAgePref } })

            candidates.sort(function (a, b) {
                return (a.created - b.created)
            })

            return candidates
        })()
    },

    insertPhoto(id, photo, index) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'photo', value: photo, type: String },
            { key: 'index', value: index, type: Number }
        ])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const imageCloudinary = await this._saveImage(photo)
            
            user.photos.push(imageCloudinary)
            debugger
            await user.save()
        })()

    }


}

module.exports = logic