var express = require('express')
var controller = require('../controller/server.controller.js')
var router = express.Router()


//Update Database
// method to Update ImageUrl
router.get('/userPage/updateImageUrl', controller.updateImage);
// router.get('/userPage/updatePhoneList', controller.updatePhoneList);

//User Page function
// method to get user list
router.post('/userPage/getUserInfo', controller.getUserInfo);
// method to get phone list by id
router.post('/userPage/getPhoneListById', controller.getPhoneListById);
// method to update User list information
router.post('/userPage/updateUserInfo', controller.updateUserInfo);
// method to change user's password
router.post('/userPage/changePassword', controller.changePassword);
// method to get manage list
router.post('/userPage/loadManageList', controller.loadManageList);
// method to add a manage list
router.post('/userPage/addManageList', controller.addManageList);
// method to remove a manage list
router.post('/userPage/removeManageList', controller.removeManageList);
// method to update disable in manage list
router.post('/userPage/disableManageList', controller.disableManageList);
// method to update disable in manage list
router.post('/userPage/enableManageList', controller.enableManageList);
// method to get All phone list
router.post('/userPage/loadAllComment', controller.loadAllComment);
// method to get All user list
router.post('/userPage/loadAllUser', controller.loadAllUser);


// method to update User list information
router.post('/checkOut', controller.checkOut);
// method to add a comment to reviews
router.post('/addComment', controller.addComment);




// router.post('/userPage/updateDisable', controller.testMethod);
//router.post('/register', userController.register);
//router.post('/Login', userController.Login);
//router.get('/logout', userController.logout)


module.exports = router