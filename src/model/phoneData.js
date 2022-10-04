// create model for MongoDB
const { query } = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectId;


// define the schema (data type) for phone list database
// schema defination is inspired from https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
var phoneSchema = new Schema({
    "title": String,
    "brand": String,
    "image": String,
    "stock": Number,
    "seller": String,
    "price": Number,
    "disabled": String,
    "reviews": [{ // Array data
        "reviewer": String,
        "rating": Number,
        "comment": String,
        "_id": false,
    }]
});


// the following indexes were added to improve the query performance
phoneSchema.index({ disabled: 1, stock: -1 });
phoneSchema.index({ price: -1 });
phoneSchema.index({ brand: 1, price: 1 });
phoneSchema.index({ seller: 1 });


// define the schema for user list database
// the unique email setting method is inspired from https://masteringjs.io/tutorials/mongoose/unique
var userSchema = new Schema({
    "firstname": String,
    "lastname": String,
    "email": {
        type: String,
        unique: true
    },
    "password": String,
});


// compiles the model
var phoneList = mongoose.model('phoneList', phoneSchema, 'phonelisting');


// find 5 "sold out soon" product
// the first 5 phones that are not disabled and have the lowest stock quantity, but the stock must be larger than 0
// this method shall use the index => { disabled: 1, stock: -1}
module.exports.soldOutSoon = function(callback) {
    var query = phoneList.aggregate([{
            $match: {
                $and: [
                    { disabled: { $exists: false } },
                    { stock: { $gt: 0 } }
                ]
            }
        },
        { $sort: { stock: 1 } },
        { $limit: 5 },
        {
            $project: {
                title: 1,
                brand: 1,
                image: 1,
                stock: 1,
                price: 1
            }
        }
    ]);
    query.exec(function(err, list) {
        callback(list)
    })
};


// find 5 "Best sellers" products
// the first 5 highest rating phones that are not disabled and have at least 2 rating, where ratings were calculated by average
// this method shall use the index => { disabled: 1, stock: -1}
module.exports.bestSeller = function(callback) {
    var query = phoneList.aggregate([{
            $match: {
                $and: [
                    { disabled: { $exists: false } },
                    { "reviews.1": { $exists: true } }
                ]
            }
        },
        {
            $project: {
                title: 1,
                brand: 1,
                image: 1,
                stock: 1,
                price: 1,
                ratingAvg: { $avg: "$reviews.rating" }
            }
        },
        { $sort: { ratingAvg: -1 } }
    ]);
    query.exec(function(err, list) {
        callback(list)
    })
};


// search function shall allow user to fuzzy search based on title
// and allow users to search by brand and maximum price
// this method shall use the index => { brand: 1, price: -1} or {price: 1}
module.exports.searchTitle = function(params, callback) {
    var title = params.title;
    var brand = params.brand;
    var price = parseFloat(params.price);

    if (brand == 'All') {
        var query = phoneList.aggregate([{
                $project: {
                    title: { $toLower: "$title" },
                    brand: 1,
                    image: 1,
                    stock: 1,
                    price: 1
                }
            },
            {
                $match: {
                    $and: [
                        { title: { $regex: title } },
                        { price: { $lte: price } }
                    ]
                }
            },
            { $sort: { price: -1 } }
        ])
    } else if (brand != 'All') {
        var query = phoneList.aggregate([{
                $project: {
                    title: { $toLower: "$title" },
                    brand: 1,
                    image: 1,
                    stock: 1,
                    price: 1
                }
            },
            {
                $match: {
                    $and: [
                        { title: { $regex: title } },
                        { brand: brand },
                        { price: { $lte: price } }
                    ]
                }
            },
            { $sort: { price: -1 } }
        ])
    }
    query.exec(function(err, list) {
        callback(list)
    })
};


// get phone's detail when user click the phone
// details include seller's full name by concatenating first name and last name
// some method were inspired from https://stackoverflow.com/questions/34095126/express-router-id
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.phoneIdMatch = function(params, callback) {
    var query = phoneList.aggregate([
        { $match: {} },
        { $addFields: { "sellerId": { "$toObjectId": "$seller" } } },
        {
            $lookup: {
                from: "userlist",
                localField: "sellerId",
                foreignField: "_id",
                as: "sellerList"
            }
        },
        { $unwind: "$sellerList" },
        { $unwind: "$reviews" },
        { $addFields: { "reviewerId": { "$toObjectId": "$reviews.reviewer" } } },
        {
            $lookup: {
                from: "userlist",
                localField: "reviewerId",
                foreignField: "_id",
                as: "reviewList"
            }
        },
        { $unwind: "$reviewList" },
        {
            $project: {
                title: 1,
                brand: 1,
                image: 1,
                stock: 1,
                seller: { $concat: ["$sellerList.firstname", " ", "$sellerList.lastname"] },
                price: 1,
                reviews: {
                    reviewer: { $concat: ["$reviewList.firstname", " ", "$reviewList.lastname"] },
                    rating: "$reviews.rating",
                    comment: "$reviews.comment",
                }
            }
        }
    ]);
    query.exec(function(err, list) {
        callback(list)
    })
};


// get phones' detail based on user's selection in the checkout page
// details include title, brand, price and stock
// use a for loop to query
// async function inspired from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.checkOutDetails = async function(ids, callback) {
    let lists = [];
    for (let i = 0; i < ids.length; i++) {
        let phoneId = new ObjectId(ids[i])
        var query = phoneList.aggregate([
            { $match: { _id: phoneId } },
            {
                $project: {
                    title: 1,
                    brand: 1,
                    stock: 1,
                    price: 1
                }
            }
        ])
        let listFound = async function() {
            return new Promise((resolve, reject) => {
                query.exec(function(err, list) {
                    if (err) {
                        reject(err)
                    }
                    resolve(list)
                })
            })
        }
        let list = await listFound()
        lists.push(list)
    }
    callback(lists)
};


// update stock quantities (qty) after user paid
// some method was inspired from https://stackoverflow.com/questions/5289078/parse-json-from-jquery-ajax-success-data
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.updateStocks = function(list, callback) {
    for (i = 0; i < purchased.length; i++) {
        var query = phoneList.updateOne([
            { _id: purchased.id },
            {
                $subtract: [
                    $stock, purchased.qty
                ]
            }
        ]);
    }
    query.exec(function(err, result) {
        if (err) {
            result = false;
        }
    })
    callback(result)
};



// get phone list that associated with the current user based on his/her user id
// the list contains all information including reviews
// this method shall use the default index on '_id' field on userlist collection
module.exports.getPhoneList = function(userId, callback) {
    //   userId = new ObjectId(params.seller);
    var query = phoneList.aggregate([
        { $match: { seller: userId } },
        {
            $project: {
                title: 1,
                brand: 1,
                image: 1,
                stock: 1,
                price: 1,
                disabled: 1,
                reviews: 1
            }
        }
    ]);
    query.exec(function(err, list) {
        callback(list)
    })
}


// method to add review for a specific phone
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.addReview = function(params, callback) {
    reviewId = new ObjectId(params.id);
    reviewerId = params.reviewer;
    reviewRate = parseFloat(params.rating);
    reviewContent = params.comment;
    var query = phoneList.updateOne({ _id: reviewId }, {
        $push: {
            reviews: {
                reviewer: reviewerId,
                rating: reviewRate,
                comment: reviewContent
            }
        }
    });
    query.exec(function(err, result) {
        if (err) {
            callback(false)
        } else {
            callback(result)
        }
    })
}


// allow users to change disabled status for a specific phone
// if disabled = true, add a 'disabled' field and give empty string
// if disabled = false, delete (unset) 'disabled' field
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.disabledStatus = function(params, callback) {
    phoneId = new ObjectId(params.id);
    disabled = params.disable;
    if (disabled == "true") {
        var query = phoneList.updateOne({ _id: phoneId }, { $set: { disabled: "" } });
        query.exec(function(err, result) {
            if (err) {
                callback(false);
            } else {
                callback(result);
            }
        })
    } else if (disabled == 'false') {
        var query = phoneList.updateOne({ _id: phoneId }, { $unset: { disabled: "" } });
        query.exec(function(err, result) {
            if (err) {
                callback(false)
            } else {
                callback(result)
            }
        })
    }
}


// allow user to delete phone from his/her list based on phone's id
// this method shall use the default index on '_id' field on phonelisting collection
module.exports.deletePhone = function(params, callback) {
    deleteId = new ObjectId(params.id)
    var query = phoneList.deleteOne({ _id: deleteId });
    query.exec(function(err, result) {
        if (err) {
            callback(false);
        } else {
            callback(result);
        }
    })
}