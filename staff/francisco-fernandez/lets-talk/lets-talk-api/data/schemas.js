const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Message = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['PENDING', 'READED', 'RESPONDED'],
    },
    sentTo: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
    ,sentDate:{
        type: Date,
    }
})

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date
    },
    sex: {
        type: String,
        default: 'MALE',
        enum: ['MALE', 'FEMALE'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true  
    },
    presentation: {
        type: String,
        required: true 
    },
    contacts: {
        type: Array,
        required: true  
    },
    lastView: {
        type: Number,  
        type: ObjectId,
        ref: 'User'
    },
    minAgePref: {
        type: Number,
        required: true  
    },
    maxAgePref: {
        type: Number,
        required: true  
    },
    photos: {
        type: Array
    }
    
})

module.exports = {
    Message,
    User
}

