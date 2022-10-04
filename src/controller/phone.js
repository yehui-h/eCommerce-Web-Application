var express = require('express');
var phoneData = require('../model/phoneData');


// get sold-out-soon list from database (direct to model layer)
module.exports.soldOutSoon = function(req, res) {
    phoneData.soldOutSoon(function(list) {
        res.json(list)
    })
}


// get the best selling list from database (direct to model layer)
module.exports.bestSeller = function(req, res) {
    phoneData.bestSeller(function(list) {
        res.json(list)
    })
}


// get the search title result from database (direct to model layer)
// change the 'price' data type to float, inspired from https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l
module.exports.searchTitle = function(req, res) {
    // var title = req.query.title;
    // var brand = req.query.brand;
    // var price = parseFloat(req.query.price);
    phoneData.searchTitle(req.query, function(list) {
        res.json(list)
    })
}



// get the phone details from database (direct to model layer)
// the method to get phone's id was inspired from https://stackoverflow.com/questions/34095126/express-router-id
module.exports.phoneIdMatch = function(req, res) {
    phoneData.phoneIdMatch(req.body, function(list) {
        return res.json({ msg: 'success', data: list });
    })
}


// get the phone details based on user's selection in the check out page
module.exports.checkOutDetails = function(req, res) {
    ids = [];
    let arr = req.body.id.split(',')
    for (i = 0; i < arr.length; i++) {
        ids.push(arr[i])
    };
    phoneData.checkOutDetails(ids, function(list) {
        res.json({ list })
    })
}


// update stocks after user paid
// some method was inspired from https://stackoverflow.com/questions/5289078/parse-json-from-jquery-ajax-success-data
module.exports.updateStocks = function(req, res) {
    purchased = [];
    for (i = 0; i < req.body.length; i++) {
        purchased.push(i)
    };
    phoneData.updateStocks(purchased, function(result) {
        res.json({ success: result })
    })
}

// get phone list that associated with the current user
module.exports.getPhoneList = function(req, res) {
    userId = req.query.seller
    phoneData.getPhoneList(userId, function(list) {
        res.json(list)
    })
}


// add review/comment to a specific phone
module.exports.addReview = function(req, res) {
    phoneData.addReview(req.body, function(result) {
        res.json({ success: result })
    })
}

// change the disabled status upon user's request
module.exports.disabledStatus = function(req, res) {
    // phoneId = req.body.id;
    // disabled = req.body.disable;
    phoneData.disabledStatus(req.body, function(result) {
        res.json({ success: result })
    })
}


// controller for user to delete phone that is created by him/her
module.exports.deletePhone = function(req, res) {
    //deletePhoneId = req.body.id;
    phoneData.deletePhone(req.body, function(result) {
        res.json({ success: result })
    })
}