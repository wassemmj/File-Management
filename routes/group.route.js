const express = require('express') ;
const router = express.Router() ;

const groupController = require('../controller/group.controller');

const auth = require('../middleware/auth.middleware')

router.post('/create' , auth , groupController.createGroup) ;

router.get('/getGroups' , groupController.getGroups) ;
router.get('/getMyGroups' , auth, groupController.getMyGroups) ;
router.get('/getFilesByGroup/:id' , groupController.getFileByGroup) ;
router.put('/EditGroupName/:id' ,auth, groupController.EditGroupName) ;

module.exports = router ;