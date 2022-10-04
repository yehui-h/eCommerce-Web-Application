var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var Utils = require('../model/utils');
var md5 = require('md5-node');
var mongoose = require('mongoose');
var router = express.Router();
let code = null;


// user register interface
router.post('/signup', function(req, res, next) {
    code = Math.floor(Math.random() * 1000);

    let { firstname, lastname, email, password, checkpassword } = req.body;
    // if(!(codes[email] === Number(eamilcode))){

    // }
    if (password != checkpassword) {
        return res.json({ msg: 'fail', data: 'May two passwords are not the same' });
        // console.log('May two passwords are not the same');
        // res.redirect('/register');
    } else
    if (email == '' || password == '') {
        return res.json({ msg: 'fail', data: 'email or password is empty' });
        // console.log('email or password is empty');
        // res.redirect('/register');
    }

    // MD5 encoding
    password = md5(password);
    // verify data first
    userModel.find({ email: email }).then((docs) => {
        if (docs.length > 0) {
            return res.json({ msg: 'fail', data: 'email already exists' });
            // res.send('email already exists');
        } else {
            // insert data to db
            // var id = new mongoose.Types.ObjectId();
            var id = new mongoose.Types.ObjectId();
            code = Math.floor(Math.random() * 100000); //save the verification code
            title = 'Activate the email account';
            // checkCode = "http://localhost:3000/checkCode?id=' + id + '&code=' + code + '";
            html = "<p>Dear User</p><p>thank you for registering</p><p>Click the link below to activate your account：</p><p><a href='http://localhost:8080/mailactive?email=" + email + "&code=" + code + "'>Activate account link</a></p>";
            text = 'Click to activate';

            userModel.insertMany({ _id: id, firstname, lastname, email: email, password, code: code, isActive: false }).then((data) => {
                Utils.mail(email, title, text, html, function(err, data) {
                    if (err) {
                        return res.json({ msg: 'fail', data: 'Failed to send' });
                    }
                    // res.end();
                });
                // sign up successfully and redirect to sign in page
                return res.json({
                    msg: 'success',
                    _id: id,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                    code: code
                });
            }).catch((err) => {
                return res.json({ msg: 'fail', data: err });
            })
        }
    });
});

// user login interface
router.post('/login', function(req, res, next) {
    let { email, password } = req.body;
    // limit input parameters
    if (email == '' || password == '') {
        return res.json({ msg: 'fail', data: 'email or password is empty' });
    }
    // MD5 encoding
    password = md5(password);

    //Check if there is data in the database
    userModel.find({ email: email, password: password }).then((docs) => {
        if (docs.length > 0) {
            //if inactive
            if (docs[0].isActive == false) {
                return res.json({ msg: 'fail', data: 'Account needs to be activated' });
            } else {
                //res.render('http://localhost:8080/main')
                return res.json({
                    msg: 'success',
                    id: docs[0]._id
                });
            }
        } else {
            // email or password is wrong
            return res.json({ msg: 'fail', data: 'email or password is wrong' });
        }
    })
});

// send reset password email
router.post('/sendResetEmail', function(req, res, next) {
    //Check if there is email in the database
    userModel.find({ email: req.body.email }).then((docs) => {
        if (docs.length < 1) {
            return res.json({ msg: 'fail', data: 'email not exist' });
            // res.send('email already exists');
        } else {
            //Add the parameters needed to send the email
            id = docs[0]._id;
            resetCode = Math.floor(Math.random() * 100000); //save the verification code
            title = 'Reset your password';
            // checkCode = "http://localhost:3000/checkCode?id=' + id + '&code=' + code + '";
            html = "<p>Dear User</p><p>thank you for Reset you password</p><p>Click the link below to Reset your password：</p><p><a href='http://localhost:8080/resetpassword?id=" + id + "&code=" + resetCode + "'>Activate account link</a></p>";
            text = 'Click to Reset Password';
            data = {
                    id: id,
                    email: req.body.email,
                    resetCode: resetCode
                }
                //Add verification code to database
            userModel.addResetCode(data, function(err, result) {
                if (err) {
                    return res.json({ msg: 'fail', data: err });
                } else {
                    Utils.mail(req.body.email, title, text, html, function(err, data) {
                        if (err) {
                            return res.json({ msg: 'fail', data: 'Failed to send' });
                        }
                    });
                    return res.json({
                        msg: 'success',
                        resetCode: resetCode,
                    });
                }
            });

        }

    });
});

//reset the password for a account
router.post('/resetPassword', function(req, res) {
    var id = req.body.id;
    var resetCode = req.body.resetCode;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    //MD5 encoding
    password = md5(password1);
    //check the two passwords
    if (password1 != password2) {
        return res.json({ msg: 'fail', data: 'The entered password is different' });
    }

    //// Verify that the code is correct
    userModel.find({ _id: id, resetCode: resetCode }).then((docs) => {
        if (docs.length < 1) {
            return res.json({ msg: 'fail', data: 'Security error, please send check email again' });
        } else {
            //If correct, modify the password
            userModel.findOneAndUpdate({ _id: id, resetCode: resetCode }, { 'password': password, }, function(err) {
                if (err) {
                    return res.json({ msg: 'fail', data: 'Reset password fail' });
                } else {
                    data = {
                            id: req.body.id,
                            resetCode: req.body.resetCode
                        }
                        //delete the code for the safety
                    userModel.deleteResetCode(data, function(err, result) {
                        if (err) {
                            return res.json({ msg: 'fail', data: err });
                        } else {
                            return res.json({
                                msg: 'success',
                                id: id
                            });
                        }
                    });
                }
            });
        }
    })







})

//Change account activation status
router.get('/mailactive', function(req, res) {
    var email = req.query.email;
    var code = req.query.code;
    // find and change
    userModel.findOneAndUpdate({ email: email, code: code }, { 'isActive': true }, function(err) {
        if (err) {
            // this.$router.push('http://localhost:8080/main')
            return res.json({ msg: 'fail', data: err });
        } else {
            // this.$router.push('http://localhost:8080/main')
            return res.json({ msg: 'success', email: email });
        }
    });

})

module.exports = router;