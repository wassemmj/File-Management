const express = require('express') ;
const app = express() ;
const http = require('http');
const path = require('path');

const server = http.createServer(app);

const user = require('./routes/user.route') ;
const group = require('./routes/group.route') ;
const file = require('./routes/file.route') ;

app.use(express.json()) ;
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api' , user) ;
app.use('/api' , group) ;
app.use('/api' , file) ;

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});