const knex = require('../db') ;
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function duplicateFile(sourceFile, destinationFile) {
    fs.access(sourceFile, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Source file does not exist: ${sourceFile}`);
            return;
        }
        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) {
                console.error('Error occurred while copying the file:', err);
            } else {
                console.log(`File was duplicated and renamed to `);
            }
        });
    });
}

module.exports.createFileRepo = async (fileName , groupId , id) => {
    try {
        const group = await knex('userGroups').where('user_id' , id).andWhere('group_id' , groupId) ;

        console.log(fileName , groupId , id)
        console.log(group)

        if (group.length > 0) {
            return await knex('files').insert({
                'fileName' : fileName ,
                'groupID' : groupId
            }) ;
        }else {
             throw new Error('can not add file to this group') ;
        }


    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.importRepo = async (fileName) => {
    try {
        return await knex('imports').insert({
            'fileName' : fileName
        }) ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.getImportFile = async () => {
    try {
        return await knex('imports') ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.getNot = async () => {
    try {
        return await knex('notifications') ;
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.getFileHistoryRepo = async (fileId) => {
    try {
        console.log('5')
        const File =  await knex('fileLogs').where('fileId' , fileId);
        console.log(File)
        return File;
    } catch (e) {
        throw new Error(e.message) ;
    }
}


module.exports.exportRepo = async (type , id , fileType , res , req) => {
    try {
        let data = null ;
        if (type === 'user')
            data = await knex('fileLogs').where('userId' , id) ;
        else
            data = await knex('fileLogs').where('fileId' , id) ;
        const doc = new PDFDocument();
        const filePath = `public/output_${id}.${fileType}`;
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.fontSize(16).text('transaction information', { align: 'center' });
        doc.moveDown();
        // Add some space

        // console.log(examinationPdf) ;
        for(let i =0 ; i<data.length ;i++){
            Object.keys(data[i]).forEach(keys => {
                doc.fontSize(12).text(`${keys}: ${data[i][keys]}`);
            })
            doc.moveDown(2);
        }

        doc.end();
        // doc.save();
        writeStream.on('finish', () => {
            return res.download(filePath, `output_${id}.pdf`, (err) => {
                if (err) {
                    console.error('Error while sending the file:', err);
                    return res.status(500).send('Error generating PDF');
                } else {
                    console.log('PDF file sent successfully');
                }
            });
        });
        // res.status(200).send({status : 200 , file : filePath}) ;
        // res.download(filePath) ;
        writeStream.on('error', (err) => {
            console.error('Error while writing the PDF file:', err);
            return res.status(500).send('Error generating PDF');
        });
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.updatetheFileRepo = async (fileName , fileId , id) => {
    try {
            const file = await knex('files').select('fileName').where('id',fileId).andWhere('status' , true)
                .andWhere('userCheckIn' , id).first();
            if (file){
                fs.unlink(`public/${file.fileName}`, (err) => {
                    if (err) {
                        console.error(`Error occurred while deleting the file: ${err}`);
                    } else {
                        console.log(`File ${fileName} was successfully deleted.`);
                    }
                });
                return await knex('files').update({
                    'fileName' : fileName ,
                })
                    .where('id' , fileId);
            }else {
                throw new Error("wertyu") ;
            }
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.checksFilesRepo = async (files , id) => {
    try {
        await knex.transaction(async (trx) => {
            for (let i = 0; i < files.length; i++) {
                const file1 = await trx('files').where('id' , files[i]).andWhere('status' , true).first() ;
                if (file1) {
                    trx.rollback() ;
                }
                const file = await trx('files').where('id' , files[i]).andWhere('status' , false).first() ;
                console.log(file) ;
                const { name } = await knex('users').where('id' , id).first() ;
                await trx('backupsFiles').insert({
                    'fileName' : id + Date.now() + file.fileName,
                    'userName' : name ,
                    'fileId' : file.id
                }) ;
                await trx('fileLogs').insert({
                    'fileId' : files[i],
                    'userId' : id,
                    'logs' : `The File with the id${files[i]} has been Checked in by the user with the id ${id}`,
                    'date' : Date.now()
                })
                const users = await trx('userGroups').where('group_id' , file.groupID) ;
                for (let i = 0 ; i < users.length ; i++) {
                    await trx('notifications').insert({
                        'message' : `the user ${users[i].id} check in the file ${file.id} to himself `,
                        'userId' : users[i].id,
                    }) ;
                }
                duplicateFile(`public/${file.fileName}`, `public/${id + Date.now() + file.fileName}`)
                await trx('files').where('id' , files[i]).update({'status' : true , 'userCheckIn' : id}) ;
            }
        }) ;
    } catch (e) {
        throw new Error(e.message) ;
    }
}

module.exports.checkOutRepo = async (fileId , id) => {
    try {
        const file = await knex('files')
            .where('id' , fileId)
            .andWhere('status' , true)
            .andWhere('userCheckIn' , id)
            .first() ;
        console.log(file) ;
        if (!file) {
            throw new Error('You can not un check this file') ;
        }
        console.log(file) ;
        const users = await knex('userGroups').where('group_id' , file.groupID) ;
        for (let i = 0 ; i < users.length ; i++) {
            await knex('notifications').insert({
                'message' : `the user ${users[i].id} check out the file ${file.id} to himself `,
                'userId' : users[i].id,
            }) ;
        }
        await knex('fileLogs').insert({
            'fileId' : fileId,
            'userId' : id,
            'logs' : `The File with the id ${fileId} has been Checked out by the user with the id ${id}`,
            'date' : Date.now()
        })
        return await knex('files').where('id' , fileId).update({'status' : false , 'userCheckIn' : null}) ;
    } catch (e) {
        console.log(e);
        throw new Error(e.message) ;
    }
}

module.exports.downloadFileRepo = async (fileId , id) => {
    try {
        const file = await knex('files')
            .where('id' , fileId)
            .andWhere('status' , true)
            .andWhere('userCheckIn' , id)
            .first() ;
        if (!file) {
            throw new Error('You can not un check this file') ;
        }
        return file.fileName ;
    } catch (e) {
        throw new Error(e.message) ;
    }
}

