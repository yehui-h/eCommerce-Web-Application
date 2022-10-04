// set up inspired from https://expressjs.com/en/guide/routing.html & https://blog.csdn.net/hsany330/article/details/115001281
var express = require('express');
var router = express.Router();
var phoneCtr = require('../controller/phone');
var userCtr = require('../controller/userData');
module.exports = router;


// the following phone-related router were used to direct to controller for a specific methods
// method to get sold out soon phone list
router.get('/phone/soldOutSoon', phoneCtr.soldOutSoon);
// method to get best selling phone list
router.get('/phone/bestSeller', phoneCtr.bestSeller);
// method to get a title search result
router.get('/phone/searchTitle', phoneCtr.searchTitle);
// method to get phone's detail via phone id, method inspired from the 4th post in https://stackoverflow.com/questions/34095126/express-router-id
router.post('/phone/details/:id', phoneCtr.phoneIdMatch);
// method to get phone details in the checkout page
router.post('/phone/checkOutDetails', phoneCtr.checkOutDetails);
// method to update stock after user paid
router.post('/phone/checkedOut', phoneCtr.updateStocks);
// method to get phone list that associated with the user
router.get('/phone/phoneList', phoneCtr.getPhoneList);
// method to add comments to a specific phone
router.post('/phone/addComment', phoneCtr.addReview);
// method to change disable status
router.post('/phone/disabledStatus', phoneCtr.disabledStatus);
// method to delete phone
router.post('/phone/delete', phoneCtr.deletePhone);
// method to add phone


module.exports = router