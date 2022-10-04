// create model for MongoDB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create schema for user database
// email must be unique => {unique: true}. method inspired from https://masteringjs.io/tutorials/mongoose/unique
var userSchema = new Schema ({
    "firstname" : String,
    "lastname" : String,
    "email" : {
        type: String,
        unique: true
    },
    "password" : String,
});


// add floowing index to improve query performance
userSchema.index({email: 1});


// compiles the model
var userList = mongoose.model('userList', userSchema, 'userlist');


