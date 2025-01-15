const joi = require("joi");
const service = require('../services/file.service') ;

module.exports.addFile = async (req , res) => {
    const { filename } = req.file;
    try {
        await service.createFileService(filename , req.params.id , req.user.id) ;
        res.status(200).send({'message' : 'file created successfully'}) ;
    } catch(e) {
        res.status(404).send({'message' : e.message})
    }
}

module.exports.checksFile = async (req , res) => {
    const schema = joi.object({
        files : joi.array().items(joi.number()) ,
    }) ;

    const newChecks = req.body ;
    const { error } = schema.validate(newChecks) ;
    if (error) return res.status(404).send({'message' : error.details[0].message}) ;

    try {
        console.log(req.user) ;
        await service.checksFileService(newChecks.files , req.user.id) ;
        res.status(200).send({'message' : 'all files checked in' , 'files' : req.body.files}) ;
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : e.message}) ;
    }
}

module.exports.checkOutFile = async (req , res) => {
    try {
        const user = await service.checkoutFileService(req.params.id , req.user.id) ;
        res.status(200).send({'message' : 'check out this file'}) ;
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : e.message}) ;
    }
}

module.exports.downloadFile = async (req , res) => {
    try {
        const filePath = await service.downloadFileService(req.params.id , req.user.id) ;
        res.download(`public/${filePath}`, `output.pdf`, (err) => {
            if (err) {
                console.error('Error while sending the file:', err);
                res.status(500).send('Error generating PDF');
            } else {
                console.log('PDF file sent successfully');
            }
        });
    } catch (e) {
        console.log(e.message) ;
        res.status(404).send({'message' : e.message}) ;
    }
}

module.exports.updatetheFile = async (req,res) =>{
    const { filename } = req.file;
    try {
        await service.updatetheFileService(filename , req.params.id , req.user.id) ;
        res.status(200).send({'message' : 'file updated successfully'}) ;
    }catch (e){
        console.log(e.message) ;
        res.status(404).send({'message' : e.message}) ;
    }
}

module.exports.import = async (req , res) => {
    const { filename } = req.file;
    try {
        await service.importService(filename) ;
        res.status(200).send({'message' : 'file created successfully'}) ;
    } catch(e) {
        res.status(404).send({'message' : e.message})
    }
}

module.exports.getImportFile = async (req , res) => {
    try {
        const importsFile = await service.getImportFile() ;
        res.status(200).send({ importsFile }) ;
    } catch(e) {
        res.status(404).send({'message' : e.message})
    }
}

module.exports.export = async (req , res) => {
    try {
        return await service.exportService(req.body.type, req.body.id , req.body.fileType , res , req) ;
    } catch(e) {
        res.status(404).send({'message' : e.message})
    }
}


module.exports.getNot = async (req , res) => {
    try {
        const not = await service.getNot() ;
        res.status(200).send({Notification : not}) ;
    } catch(e) {
        res.status(404).send({'message' : e.message})
    }
}

module.exports.getFileHistory = async (req , res)=>{
    try{
        const fileId = req.params.id;
        const file = await service.getFileHistoryservice(fileId);
        res.status(200).send({'fileHistory' : file}) ;
    }catch(e){
        console.log(e.message) ;
        res.status(404).send({'message' : 'An error occurred while Getting the FileHistory'}) ;
    }
}