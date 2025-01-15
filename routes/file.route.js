const express = require('express') ;
const router = express.Router() ;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const fileController = require ('../controller/file.controller') ;

const auth = require('../middleware/auth.middleware') ;

router.post('/addFile/:id' , auth, upload.single('file') , fileController.addFile) ;
router.post('/importFile' , auth, upload.single('file') , fileController.import) ;
router.get('/getImportFile' , auth , fileController.getImportFile) ;
router.post('/exportFile' , auth, fileController.export) ;
router.post('/updateFile/:id' , auth, upload.single('file') , fileController.updatetheFile) ;
router.post('/checkFile' , auth , fileController.checksFile) ;
router.post('/checkoutFile/:id' , auth , fileController.checkOutFile) ;
router.post('/downloadFile/:id' , auth , fileController.downloadFile) ;
router.get('/getFileHistory/:id' , auth , fileController.getFileHistory) ;


router.get('/notification' , auth , fileController.getNot) ;

module.exports = router ;
