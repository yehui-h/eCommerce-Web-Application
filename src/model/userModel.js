var mongoose = require('./db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: { //the first name of the user.
        type: String,
        required: true
    },
    lastname: { //the last name of the user.
        type: String,
        required: true
    },
    email: { //he email address of the user.
        type: String,
        required: true
    },
    password: { //the password of the user which is an encrypted by using MD5 (strong password only).
        type: String,
        required: true
    },
    code: { //code to verify if the email is valid
        type: Number,
        required: true
    },
    resetCode: { //code to verify for reset password
        type: Number,

    },
    isActive: { //Email is valid
        type: Boolean,
        required: true
    }


}, {
    versionKey: false
});

userSchema.index({ email: 1 }, { unique: true })

//update the user list information by id
userSchema.statics.updateUserInfo = function(data, callback) {
    return this.update({ '_id': data.id }, {
        $set: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            code: data.code,
            isActive: data.isActive
        }
    }, { multi: false }).exec(callback);
}

//change the password in a user list information by id
userSchema.statics.changePassword = function(data, callback) {
    return this.update({ '_id': data.id }, { $set: { password: data.newPassword } }, { multi: false }).exec(callback);
}

//add the resetCode in a user list information by email
userSchema.statics.addResetCode = function(data, callback) {
    return this.update({ 'email': data.email }, { $set: { resetCode: data.resetCode } }, { multi: 1 })
        .exec(callback);
}

//delete the resetCode in a user list information by email
userSchema.statics.deleteResetCode = function(data, callback) {
    return this.update({ 'email': data.email }, { $unset: { resetCode: data.resetCode } }, { multi: 1 })
        .exec(callback);
}

//gat the user list information by id
userSchema.statics.getUserInfo = function(id, callback) {
    return this.find({ '_id': id }).exec(callback);
}

//get all the user list information 
userSchema.statics.getUserList = function(data, callback) {
    return userModel.find({}).exec(callback);
}


// userSchema.statics.getFullName = function(data, callback) {
//     return userModel.find({}).exec(callback);
// }


var userModel = mongoose.model('users', userSchema, 'userlist');

module.exports = userModel;