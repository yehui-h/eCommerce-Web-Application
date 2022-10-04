var mongoose = require('./db');
const Schema = mongoose.Schema;
var userModel = require('../model/userModel');

var review = new Schema({
    reviewer: { //the id of the user who posted the review/comment;
        type: String,
        required: true
    },
    rating: { //the rating of the phone or the phone listing.
        type: Number,
        required: true
    },
    comment: { // the text or review of the phone listing.
        type: String,
        required: true
    },
});

var phoneSchema = new Schema({
    title: { //the title of the phone listing.
        type: String,
        required: true
    },
    brand: { //the brand name of the phone
        type: String,
        required: true
    },
    image: { //the URL to the image of this phone listing 
        type: String,
        required: true
    },
    stock: { //the quantity of available item that can be sold.
        type: Number,
        required: true
    },
    seller: { //the id of the user who created this phone listing.
        type: String,
        required: true
    },
    sellerName: { //the id of the user who created this phone listing.
        type: String

    },
    price: { //the price of each item
        type: Number,
        required: true
    },
    disabled: { //the presence of the field indicates that the phone listing is disabled and will not be shown
        type: String,
    },
    reviews: { //the list of reviews made by users regarding the phone listing
        // reviewer: String, 
        // rating: Number,
        // comment: String
        type: [review]


    }
}, {
    versionKey: false
});

//get the phone list by seller
phoneSchema.statics.getUserListings = function(data, callback) {
    return this.find({ 'seller': data }).exec(callback);
}

//add the new phone list 
phoneSchema.statics.addNewPhoneList = function(data, callback) {
    return this.create({
        title: data.title,
        brand: data.brand,
        image: data.image,
        stock: data.stock,
        seller: data.seller,
        price: data.price,
        disabled: data.disabled,
        reviews: []
    }, callback);
}

//update the imageURl for all the phone list
phoneSchema.statics.updateImage = function(data, callback) {
    return this.updateMany({}, [{ $set: { image: { $concat: ["images/", "$brand", ".jpeg"] } } }], { multi: true }, callback);
}


// phoneSchema.statics.getPhoneList = function(data, callback) {
//     return JSON.stringify(phoneModel.find({}).exec(callback));
// }

//get all the phone list 
phoneSchema.statics.getPhoneList = function(data, callback) {
    return phoneModel.find({}).exec(callback);
}

//get the phone list by id
phoneSchema.statics.getPhoneListById = function(data, callback) {
    return phoneModel.findById({ '_id': data }).exec(callback);
}

//update the reviews in a phone list by seller
phoneSchema.statics.updatePhoneInfo = function(data, callback) {
    return this.updateMany({ '_id': data.id }, {
        $set: {
            reviews: data.reviews,
        }
    }, { multi: 1 }).exec(callback);
}

//change the disable state in the phone list by id
phoneSchema.statics.disableManageList = function(data, callback) {
    return this.update({ _id: data }, { $set: { disabled: "" } }, { multi: 1 })
        .exec(callback);
}

//change the disable state in the phone list by id
phoneSchema.statics.enableManageList = function(data, callback) {
    return this.update({ _id: data }, { $unset: { disabled: "" } }, { multi: 1 }).exec(callback);
}

//update the reviews in a phone list by id
phoneSchema.statics.updateReviews = function(id, data, callback) {
    return this.updateMany({ _id: id }, { $set: { reviews: data } }, { multi: 1 }).exec(callback);
}

//update the reviews in a phone list by id
phoneSchema.statics.changeReviewer = function(id, data, callback) {
    return this.updateMany({ _id: id }, {
        $set: {
            reviewer: data
        }
    }, { multi: 1 }).exec(callback);
}

//add the Stock in a phone list by id
phoneSchema.statics.addStock = function(id, data, callback) {
    return this.updateMany({ _id: id }, {
        $set: {
            stock: data + 1
        }
    }, { multi: 1 }).exec(callback);
}

//reduce the Stock in a phone list by id
phoneSchema.statics.reduceStock = function(id, data, callback) {
    return this.updateMany({ _id: id }, {
        $set: {
            stock: data - 1
        }
    }, { multi: 1 }).exec(callback);
}


//add the review  in a phone list by id
phoneSchema.statics.addReview = function(id, reviews, callback) {

    // reviews = JSON.parse(review)
    // console.log(reviews)
    return phoneModel.findByIdAndUpdate({
        '_id': id
    }, {
        $push: {
            'reviews': reviews
        }
    }, {
        new: true
    }, ).exec(callback);
}



var phoneModel = mongoose.model('phones', phoneSchema, 'phonelisting');
module.exports = phoneModel;