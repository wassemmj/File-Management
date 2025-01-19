const express = require('express') ;
const router = express.Router() ;

const userController = require('../controller/user.controller');
const auth = require('../middleware/auth.middleware')

router.post('/register' , userController.createUser) ;
router.post('/refreshToken' , userController.refreshToken) ;
router.post('/login' , userController.login) ;
router.post('/addUserGroup/:group_id' ,auth, userController.addUserGroup) ;
router.post('/sendRequest/:id' ,auth, userController.askToJoin) ;
router.post('/acceptRequest/:id/:groupId' ,auth, userController.acceptJoinRequest) ;

router.get('/getUsers' ,auth, userController.getUsers) ;
router.get('/getUsersInGroup/:groupId' , userController.getUsersInGroup) ;
router.get('/deleteUserInGroup/:userId' , userController.deleteUsersInGroup) ;


router.get('/getRequestNot' ,auth, userController.getNotificationAdd) ;

module.exports = router ;
