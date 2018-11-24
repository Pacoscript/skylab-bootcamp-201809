const { User, Message } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const cloudinary = require('cloudinary')
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

            if (id === idContact) throw new NotAllowedError('user cannot add himself as a contact')

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const newContact = await User.findById(idContact)

            if (!newContact) throw new NotFoundError(`user with id ${idContact} not found`)


            debugger
            user.contacts.forEach(_contactId => {
                debugger
                if (_contactId.toString() === newContact._id.toString()) throw new AlreadyExistsError(`user with id ${id} arleady has contact with id ${_contactId}`)
            })

            user.contacts.push(newContact._id)
            newContact.contacts.push(user._id)

            await user.save()
            await newContact.save()
        })()
    },

    listContacts(userId) {
        validate([
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const contacts = await Promise.all(user.contacts.map(async contactId => await User.findById(contactId)))

            return contacts.map(({ id, name, presentation, photo1 }) => ({ id, name, presentation, photo1 }))
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

            if (!_user.contacts.includes(user2.id).toString()) throw new NotFoundError(`user with id ${sentTo} is not a contact of user with id ${user}`)

            let sentDate = Date.now()
            message = new Message({ text, user, nameUser: _user.name, sentTo, nameSentTo: user2.name, sentDate })

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

            if (!_user1.contacts.includes(_user2.id).toString()) throw new NotFoundError(`user with id ${user2} is not a contact of user with id ${user1}`)

            var ObjectId = require('mongoose').Types.ObjectId
            let messages = await Message.find({
                $or: [{ user: new ObjectId(user1), sentTo: new ObjectId(user2) },
                { user: new ObjectId(user2), sentTo: new ObjectId(user1) }]
            })

            messages.sort(function (a, b) {
                return (a.sentDate - b.sentDate)
            })

            if (messages.length > 0)
                if (messages[messages.length - 1].status === 'PENDING' && messages[messages.length - 1].user.toString() === user2) {
                    let message = await Message.findById(messages[messages.length - 1].id.toString())
                    let message2 = await Message.findById(messages[messages.length - 2].id.toString())
                    message.status = 'READED'
                    message2.status = 'RESPONDED'
                    await message.save()
                    await message2.save()
                }
            debugger
            if (messages.length > 0) return messages
            else return ([])

        })()
    },

    listCandidates(user) {

        validate([
            { key: 'user', value: user, type: String }
        ])

        const candidatesFiltered = []

        let flag = false


        return (async () => {

            const _user = await User.findById(user)

            if (!_user) throw new NotFoundError(`user with id ${user} not found`)

            let sexSearch = ''

            if (_user.sex === 'MALE') sexSearch = 'FEMALE'
            else sexSearch = 'MALE'

            const contacts = _user.contacts

            let candidates = await User.find({ sex: sexSearch, age: { $gte: _user.minAgePref, $lte: _user.maxAgePref } }).lean()

            candidates.forEach(candidate => {
                contacts.forEach(contact => {
                    debugger
                    if (candidate._id.toString() === contact._id.toString()) {
                        flag = true
                    }
                    
                })
                if (flag === true) flag = false
                    else {
                        candidatesFiltered.push(candidate)
                        flag = false
                    }

            })

            candidatesFiltered.sort(function (a, b) {
                return (a.created - b.created)
            })

            candidatesFiltered.forEach(candidate => {
                candidate.id = candidate._id.toString()

                delete candidate.__v
                delete candidate._id
                delete candidate.contacts
                delete candidate.city
                delete candidate.created
                delete candidate.surname
                delete candidate.username
                delete candidate.password
                delete candidate.sex
                delete candidate.age
                delete candidate.maxAgePref
                delete candidate.minAgePref
                delete candidate. photo1
                delete candidate. photo2
                delete candidate. photo3
                
            })


            if (candidatesFiltered.length > 0) return candidatesFiltered
            else return false

        })()
    },

    insertPhoto(id, chunk, photo) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'chunk', value: chunk, type: String },
            { key: 'photo', value: photo, type: String }
        ])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const imageCloudinary = await this._saveImage(chunk)

            user.photo1 = imageCloudinary

            await user.save()

        })()

    }


}

module.exports = logic