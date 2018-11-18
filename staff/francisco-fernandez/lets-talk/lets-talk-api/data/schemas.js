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
        required: true
    },
    sentTo: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
    ,sentDate:{
        type: Date,
        required: true 
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
    sex: [{
        type: String,
        default: 'MALE',
        enum: ['MALE', 'FEMALE']
    }],
    age: [{
        type: Number
    }],
    City: [{
        type: String  
    }],
    Photos: [{
        type: Array  
    }],
    minAge: [{
        type: Number  
    }],
    maxAge: [{
        type: Number  
    }],
    contacts: [{
        type: Array  
    }],
    create: [{
        type: Date  
    }],
    lastView: [{
        type: Number,  
        type: ObjectId,
        ref: 'User'
    }],
    autorized: [{
        type: Boolean,
        default: false
    }]
    
})

module.exports = {
    Message,
    User
}

