var userModel = require('../model/userModel');
var phoneModel = require('../model/phoneModel');
var Utils = require('../model/utils');
var md5 = require('md5-node');

//Update the User's information
module.exports.updateUserInfo = function(req, res) {
    //set a code for the method safety
    code = Math.floor(Math.random() * 100000);
    changeInfo = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: md5(req.body.password),
        code: code,
        isActive: false
    }

    //find the user list that needs to be modified
    userModel.find({ _id: req.body.id, password: changeInfo.password }).then((docs) => {
        //check the data if exists
        if (docs.length > 0) {
            // mail is not equal to its own mail
            if (docs[0].email != changeInfo.email) {
                //whether the email already exists
                userModel.find({ email: changeInfo.email }).then((docs) => {
                    // console.log(changeInfo.email)
                    // console.log(docs[0])
                    //The email already exists will return an error message
                    if (docs.length > 0) {
                        return res.json({ msg: 'fail', data: 'email already exists' });
                    } else {
                        //The email does not exist and an email will be sent to verify
                        title = 'Activate the email account';
                        html = "<p>Dear User</p><p>Activate the new email</p><p>Click the link below to activate your email：</p><p><a href='http://localhost:8080/mailactive?email=" + changeInfo.email + "&code=" + code + "'>Activate account link</a></p>";
                        text = 'Click to activate';

                        //send email
                        Utils.mail(changeInfo.email, title, text, html, function(err, data) {
                            if (err) {
                                return res.json({ msg: 'fail', data: 'Failed to send' });
                            }
                            // res.end();
                        });

                        //update the user list information
                        userModel.updateUserInfo(changeInfo, function(err, result) {
                            if (err) {
                                return res.json({ msg: 'fail', data: err });
                            } else {
                                console.log(code);
                                return res.json({
                                    msg: 'success',
                                    date: changeInfo
                                });
                            }
                        })
                    }
                })
            } else { //If it is equal to its own mailbox, it will only change other data
                changeInfo.isActive = true;
                //update the user list information
                userModel.updateUserInfo(changeInfo, function(err, result) {
                    if (err) {
                        return res.json({ msg: 'fail', data: err });
                    } else {
                        //console.log(code);
                        return res.json({
                            msg: 'success',
                            date: changeInfo
                        });
                    }
                })
            }
        } else {
            // email or password is wrong
            return res.json({ msg: 'fail', data: 'password is wrong' });
        }
    })
}

//Update the User's password
module.exports.changePassword = function(req, res) {
    changeInfo = {
        id: req.body.id,
        oldPassword: md5(req.body.oldPassword),
        newPassword: md5(req.body.newPassword),
    }

    //get the user list by id and oldPassword
    userModel.find({ _id: req.body.id, password: changeInfo.oldPassword }).then((docs) => {
        //validate input parameters
        if (changeInfo.oldPassword == changeInfo.newPassword) {
            return res.json({ msg: 'fail', data: 'New and old passwords cannot be the same' });
        }
        //Will change new password if there is data
        if (docs.length > 0) {
            userModel.changePassword(changeInfo, function(err, result) {
                if (err) {
                    return res.json({ msg: 'fail', data: err });
                } else {
                    return res.json({
                        msg: 'success',
                        id: changeInfo.id
                    });
                }
            })
        } else {
            //oldPassword is wrong
            return res.json({ msg: 'fail', data: 'Old Password is wrong' });
        }
    });
}



//get the list of phone list by id
module.exports.getUserInfo = function(req, res) {
    userModel.getUserInfo(req.body.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        }
    });
}

//get the list of phone list by id
module.exports.getPhoneListById = function(req, res) {
    phoneModel.getPhoneListById(req.body.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        }
    });
}

//get the user list by seller
module.exports.loadManageList = function(req, res) {
    phoneModel.getUserListings(req.body.seller, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        }
    });
}


//add a phone listings
module.exports.addManageList = function(req, res) {
    //change the image path
    image = "images/" + req.body.brand + ".jpeg"
    if (req.body.disabled = true) {
        req.body.disabled = ""
    }
    addData = {
            title: req.body.title,
            brand: req.body.brand,
            image: image,
            stock: req.body.stock,
            seller: req.body.seller,
            price: req.body.price,
            disabled: req.body.disabled
        }
        //Determine whether the current item exists in the database
    phoneModel.find({
        title: addData.title,
        brand: addData.brand,
        seller: addData.seller,
        price: addData.price
    }).then((docs) => {
        // if it doesn't exist, add to phone list
        if (docs.length < 1) {
            phoneModel.addNewPhoneList(addData, function(err, result) {
                if (err) {
                    return res.json({ msg: 'fail', data: err });
                } else {
                    // res.json(result);
                    return res.json({ msg: 'success', data: result });
                }
            });
        } else { // if it exist, the stock + 1 
            phoneModel.addStock(docs[0]._id, docs[0].stock, function(err, result) {
                if (err) {
                    return res.json({ msg: 'fail', data: err });
                } else {
                    // res.json(result);
                    return res.json({ msg: 'success', data: 'Current Phone stock + 1' });
                }
            });
        }
    })


}

//remove a phone list 
module.exports.removeManageList = function(req, res) {
    phoneModel.findByIdAndRemove(req.body.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        }
        if (result) {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        } else {
            return res.json({ msg: 'fail', data: 'No such phone' });
        }

    });
}

//change disable to true for a phone
module.exports.disableManageList = function(req, res) {
    phoneModel.disableManageList(req.body.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success' });
        }
    });
}

//change disable to false for a phone
module.exports.enableManageList = function(req, res) {
    phoneModel.enableManageList(req.body.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success' });
        }
    });
}

//update all the imageUrl for phone list
module.exports.updateImage = function(req, res) {
    phoneModel.updateImage(req.params.id, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', });
        }
    });
}

//get all the phone list
module.exports.loadAllComment = function(req, res) {
    phoneModel.getPhoneList(req.body.seller, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        }
    });
}

//get all the user list
module.exports.loadAllUser = function(req, res) {
    userModel.getUserList(req.body, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', data: result });
        }
    });
}

//check out of the cart
module.exports.checkOut = function(req, res) {
    list = JSON.parse(req.body.data)
    console.log(list);
    //reduce stock for each commodity
    for (let i = 0; i < list.length; ++i) {
        newStock = list[i].stock - list[i].num;
        //// find the corresponding phone list and change it
        phoneModel.findByIdAndUpdate(list[i]._id, { stock: newStock }, function(err) {
            if (err) {
                return res.json({ msg: 'fail', data: err })
            }
        });
    }
    return res.json({ msg: 'success' });
}

//add a comment for a review
module.exports.addComment = function(req, res) {
    // console.log(req.body);

    //set add parameters
    var reviewer = req.body.reviewer;
    var rating = parseInt(req.body.rating);
    var comment = req.body.comment;
    var id = req.body.id;
    var review = { reviewer: reviewer, rating: rating, comment: comment }
        // console.log(comment)
        // phoneModel.addReview(id, review, function(err, result) {
        //reviews = JSON.stringify(review)
        //reviews = JSON.parse(reviews)
        //console.log(review);
    phoneModel.addReview(id, review, function(err, result) {
        if (err) {
            return res.json({ msg: 'fail', data: err });
        } else {
            // res.json(result);
            return res.json({ msg: 'success', });
        }
    });
}






// function updateData(list) {
//     var phoneList = {
//         title: [],
//         brand: [],
//         image: [],
//         stock: [],
//         seller: [],
//         price: [],
//         disabled: [],
//         reviews: {
//             comments: [],
//             reviewers: [],
//             ratings: []
//         },
//         averageRating: [],
//         ratingNum: []
//     };

//     var userList = {
//         id: [],
//         name: []
//     };
//     for (var i = 0; i < list.length; i++) {
//         phoneList.title.push(list[i].title);
//         phoneList.brand.push(list[i].brand);
//         phoneList.stock.push(list[i].stock);
//         var sellerIdx = userList.id.indexOf(list[i].seller);
//         phoneList.seller.push(userList.name[sellerIdx]);
//         phoneList.price.push(parseFloat(list[i].price));
//         if ("disabled" in list[i]) {
//             phoneList.disabled.push("");
//         } else {
//             phoneList.disabled.push(0);
//         }

//         var ratingSum = 0;
//         var ratingCnt = 0;
//         var ratingAvg = 0;
//         var comments = [];
//         var reviewers = [];
//         var ratings = [];

//         if (list[i].reviews.length > 0) {
//             for (var j = 0; j < list[i].reviews.length; j++) {
//                 var reviewerIdx = userList.id.indexOf(list[i].reviews[j].reviewer);
//                 reviewers.push(userList.name[reviewerIdx]);
//                 comments.push(list[i].reviews[j].comment);
//                 ratings.push(list[i].reviews[j].rating);
//                 ratingSum += parseInt(list[i].reviews[j].rating);
//                 ratingCnt += 1;
//             }
//             ratingAvg = (parseFloat(ratingSum / ratingCnt)).toFixed(2);
//         }

//         phoneList.reviews.comments.push(comments);
//         phoneList.reviews.reviewers.push(reviewers);
//         phoneList.reviews.ratings.push(ratings);

//         phoneList.ratingNum.push(ratingCnt);
//         phoneList.averageRating.push(ratingAvg);
//     }
//     minPrice = Math.min(...phoneList.price);
//     maxPrice = Math.max(...phoneList.price);
//     console.log(phoneList);
//     return phoneList;
//     // console.log(phoneList);
// }




// module.exports.updatePhoneList = async function(req, res) {
//     phoneModel.getPhoneList({}, function(err, result) {
//         if (err) {
//             return res.json({ msg: 'fail', data: err });
//         } else {
//             //console.log(result[0])
//             //return res.json({ msg: 'fail', data: result[0].reviews.reviewer });
//             // let fullName = ""
//             let jsonArray = eval(JSON.stringify(result));
//             //const fullname = await
//             // console.log(jsonArray)
//             let fullName = ""
//             for (let i = 0; i < jsonArray.length; ++i) {
//                 //console.log(result[i].reviews.length)
//                 for (let j = 0; j < jsonArray[i].reviews.length; ++j) {

//                     userModel.findById(jsonArray[i].reviews[j].reviewer).then(docs => {
//                         // List = eval(JSON.stringify(docs));
//                         // List = JSON.parse(List);
//                         //console.log(docs.firstname);
//                         fullName = docs.firstname + " " + docs.lastname;
//                         //console.log(fullName)
//                     });
//                     console.log(fullName)

//                     // userModel.getUserInfo(jsonArray[i].reviews[j].reviewer).then(docs => {
//                     //     console.log(docs[0].firstname);
//                     //         // fullName = docs[0].firstname + " " + docs[0].lastname;
//                     //         // console.log(fullName)
//                     // });

//                     // console.log(fullName)
//                     // userlist = userModel.getUserInfo(jsonArray[i].reviews[j].reviewer, function(err, resolve) {
//                     //     fullName = resolve[0].firstname + " " + resolve[0].lastname; // Use this if we want to save full name instead of id
//                     // })
//                     //fullName = userList[0].firstname + " " + userList[0].lastname;
//                     //jsonArray[i].reviews[j].reviewer = fullName;

//                 }
//                 // console.log(fullName)
//             }
//             //console.log(jsonArray[0].reviews[0])
//             return res.json({ msg: 'success', data: jsonArray[0].reviews[0] });
//         }

//     });
// }

// // //change disable to false for a phone
// // module.exports.updateDisable = function(req, res) {
// //     phoneModel.changeDisabled(req.body.id, function(err, result) {
//         if (err) {
//             return res.json({ msg: 'fail', data: err });
//         } else {
//             phoneModel.addDisabled(req.body.id, function(err, result) {
//                 if (err) {
//                     return res.json({ msg: 'fail', data: err });
//                 } else {


//                     return res.json({ msg: 'success' });
//                 }
//             });

//         }
//     });
// }