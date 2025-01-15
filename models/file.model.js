const knex = require('../db') ;

class File {
    constructor(data) {
        this.fileName = data.fileName ;
        this.groupID = data.groupID ;
    }

    save() {
        return knex('files').insert(this) ;
    }
}

module.exports.File = File ;