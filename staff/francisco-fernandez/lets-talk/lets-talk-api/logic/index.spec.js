const mongoose = require('mongoose')
const { User, Message } = require('../data')
const logic = require('.')
const { AlreadyExistsError, ValueError } = require('../errors')
const chunk = require('./test')
// const fs = require('fs-extra')
// const path = require('path')
// const hasha = require('hasha')
// const streamToArray = require('stream-to-array')
// const text2png = require('text2png')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/lets-talk-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Message.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password, sex, age, city, presentation, minAge, maxAge

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
                sex = 'MALE'
                age = 20
                city = 'Barcelona'
                presentation = 'Im a good guy'
                minAgePref = 20
                maxAgePref = 25
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref
                )

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
                expect(user.sex).to.equal(sex)
                expect(user.age).to.equal(age)
                expect(user.city).to.equal(city)
                expect(user.presentation).to.equal(presentation)
                expect(user.minAgePref).to.equal(minAgePref)
                expect(user.maxAgePref).to.equal(maxAgePref)
            })

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password, sex, age, city, presentation, minAge, maxAge)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', surname, username, password, sex, age, city, presentation, minAge, maxAge)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', surname, username, password, sex, age, city, presentation, minAge, maxAge)).to.throw(ValueError, 'name is empty or blank')
            })

            // TODO other test cases
        })

        describe('authenticate', () => {
            let user

            beforeEach(() => (user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20, maxAgePref: 25, created: Date.now()
            })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, surname, username, password, created } = _user
                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(created).to.exist
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                sex: 'MALE', age: 30, city: ' Barcelona', presentation: 'Im guay', minAgePref: 30, maxAgePref: 35,
            })).save())

            it('should update on correct data and password', async () => {
                const { id, name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`
                const newSex = 'FEMALE'
                const newAge = 35
                const newCity = 'Madrid'
                const newPresentation = 'not guay'
                const newMinAge = 25
                const newMaxAge = 30

                const res = await logic.updateUser(id, newName, newSurname, newUsername, newPassword, password,
                    newSex, newAge, newCity, newPresentation, newMinAge, newMaxAge)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
                expect(_user.sex).to.equal(newSex)
                expect(_user.age).to.equal(newAge)
                expect(_user.city).to.equal(newCity)
                expect(_user.presentation).to.equal(newPresentation)
                expect(_user.minAgePref).to.equal(newMinAge)
                expect(_user.maxAgePref).to.equal(newMaxAge)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                const res = await logic.updateUser(id, newName, null, null, null, password, null, null, null, null, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                const res = await logic.updateUser(id, null, newSurname, null, null, password, null, null, null, null, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({
                        name: 'John', surname: 'Doe', username: 'jd2', password: '123',
                        age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                        maxAgePref: 25, created: Date.now()
                    })

                    await user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, name, surname, username, password, sex, age, city, presentation, minAge, maxAge } = user2

                    const newUsername = 'jd'
                    const newSex = 'FEMALE'
                    const newAge = 35
                    const newCity = 'Madrid'
                    const newPresentation = 'not guay'
                    const newMinAge = 25
                    const newMaxAge = 30

                    try {
                        const res = await logic.updateUser(id, null, null, newUsername, null, password, newSex, newAge, newPresentation, newCity, newMinAge, newMaxAge)

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)
                    } finally {
                        const _user = await User.findById(id)

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                        expect(_user.age).to.equal(age)
                        expect(_user.sex).to.equal(sex)
                        expect(_user.city).to.equal(city)
                        expect(_user.presentation).to.equal(presentation)
                        expect(_user.minAgePref).to.equal(minAgePref)
                        expect(_user.maxAgePref).to.equal(maxAgePref)
                    }
                })
            })

        })

        describe('add contact', () => {
            let user
            let user2

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user2 = new User({
                    name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                    age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await Promise.all([user.save(), user2.save()])
            })


            it('should succed on correct data', async () => {
                const res = await logic.addContact(user.id, user2.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.id).to.equal(user.id)

                expect(_user.contacts.length).to.equal(1)

                const [contactId] = _user.contacts

                expect(contactId.toString()).to.equal(user2.id)
            })

            // TODO other test cases
        })

        describe('retrieve candidates', () => {
            let user
            let user2
            let user3
            let user4

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user2 = new User({
                    name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                    age: 22, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user3 = new User({
                    name: 'Sara', surname: 'Varas', username: 'sa', password: '123',
                    age: 25, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im another good girl', minAgePref: 20,
                    maxAgePref: 23, created: Date.now()
                })

                user4 = new User({
                    name: 'Loli', surname: 'Pili', username: 'mr', password: '123',
                    age: 40, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a third good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await Promise.all([user.save(), user2.save(), user3.save(), user4.save()])
            })

            it('should succed on correct data', async () => {

                const candidates = await logic.listCandidates(user.id)

                expect(candidates.length).to.equal(2)
                expect(candidates[0].name).to.equal(user2.name)
                expect(candidates[1].name).to.equal(user3.name)
                expect(candidates[0].presentation).to.equal(user2.presentation)
                expect(candidates[1].presentation).to.equal(user3.presentation)

            })
        })

        describe('add photo', () => {
            let user

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })
                await user.save()
            })
            it('should succed on correct data', async () => {

                const i = 0
               
                const res = await logic.insertPhoto(user.id, chunk, i)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.id).to.equal(user.id)
                
                expect(_user.photos.length).to.equal(1)

                const [photo] = _user.photos
                
                expect(photo).not.to.be.undefined
            })

        })

    })


    describe('messages', () => {
        let user
        let user2

        beforeEach(async () => {
            user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user2 = new User({
                name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user.contacts.push(user2.id)
            user2.contacts.push(user.id)

            await Promise.all([user.save(), user2.save()])
        })

        describe('add message', () => {


            it('should succed on correct data', async () => {
                const text = 'hola mundo'
                const res = await logic.addMessage(user.id, user2.id, text)

                expect(res).to.be.undefined

                const messages = await Message.find()

                expect(messages.length).to.equal(1)

                const [message] = messages

                expect(message.text).to.equal(text)
                expect(message.sentTo.toString()).to.equal(user2.id)
                expect(message.status).to.equal('PENDING')
                expect(message.user.toString()).to.equal(user.id)
                expect(message.sentDate).not.to.be.undefined


            })

        })

        describe('retrieve conversation', () => {

            beforeEach(async () => {
                message1 = new Message({
                    text: 'hello im Jhon', user: user.id, status: 'READED', sentTo: user2.id, sentDate: Date.now()
                })
                message2 = new Message({
                    text: 'hello im Mary', user: user2.id, status: 'READED', sentTo: user.id, sentDate: Date.now()
                })
                message3 = new Message({
                    text: 'lets talk!', user: user.id, status: 'READED', sentTo: user2.id, sentDate: Date.now()
                })

                await Promise.all([message1.save(), message2.save(), message3.save()])


            })


            it('should succed on correct data', async () => {

                const conversation = await logic.retrieveMessages(user.id, user2.id)

                expect(conversation.length).to.equal(3)

                expect(conversation[0].text).to.equal('hello im Jhon')

                expect(conversation[1].text).to.equal('hello im Mary')

                expect(conversation[2].text).to.equal('lets talk!')


            })

            // TODO other test cases
        })

    })

    afterEach(() => Promise.all([User.deleteMany(), Message.deleteMany()]))

    after(() => mongoose.disconnect())
})