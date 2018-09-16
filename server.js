const express =require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session  = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/UsersClass');
const {Global} = require('./helpers/Global');
const compression = require('compression');
const helmet = require('helmet');



const container = require('./container');


container.resolve(function(users,_,home,group,privatechat){    // resolve function resolves any files or modules added to dependable container
    mongoose.Promise = global.Promise;
    // mongodb://localhost/WebConnect
    // mongodb://<dbuser>:<dbpassword>@ds249092.mlab.com:49092/webconnect
   //  mongoose.connect('mongodb://adminwebconnect:aashna27@ds249092.mlab.com:49092/webconnect'/*,{useMongoClient: true}*/ ).then(res => console.log("Connected to DB"))
 //   .catch(err => console.log(err));
                            
 mongoose.connect(process.env.MONGODB_URI).then(res => console.log("Connected to DB"))
    .catch(err => console.log(err));
    const app = SetupExpress();

    function SetupExpress(){          // we setup the configurations
        const app = express();
        const server =http.createServer(app);
        const io = socketIO(server);  // socket io requires app and http both
        // there is a different file for server side socket.io for readability 
        server.listen(process.env.PORT || 3000 , function(){
            console.log('Listening on port 3000');
        });

        ConfigureExpress(app);
        require('./socket/groupchat')(io,Users); // io is passed so that it can be used in groupchat.js file
        require('./socket/friend')(io);
        require('./socket/globalroom')(io,Global,_);
        require('./socket/privatemessage-server')(io);
      
            // Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        privatechat.SetRouting(router);

        app.use(router);

        app.use(function(req,res){
            res.render('404');
        });

    }

    function ConfigureExpress(app){

        app.use(compression());
        app.use(helmet());

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');


        app.use(express.static('public'));
        app.use(cookieParser()); 
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            // secret: 'thisisasecretkey',
           secret: process.env.SECRET_KEY,
            resave: false,// Forces the session to be saved back to the session store, even if the session was never modified during the request. 
            saveUninitialized: true,
           store: new MongoStore({mongooseConnection: mongoose.connection})
        } ));
        app.use(flash());
        // mistakes ejs un-unsed and its saveUninitialised in session 
        app.use(passport.initialize());
        app.use(passport.session()); // the app.use for passport should be done after session or it wont function properly 
        app.locals._ = _; // this express method makes lodash a global variable to be used in  any file
                            // even in ejs format 
                            // cz using dependable _ can be used only in js files 

    
   
    }
});