var express = require('express');
var fs = require("fs");

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser");


var app = express();

/**tell express to use body-parser so that it can read POST forms*/
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

/** session configuration **/
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));



/** tell expressJs to use the "app" folder to serve all the files */
app.use(express.static('public'));


/** handle "/signin" url */
app.post('/signin', function (request, response) {

    //write the logic to verify user email and password

    //var email = request.body.email;
    //var pwd = request.body.pwd;
    console.log(JSON.stringify(request.body));
    var data = request.body;
    var uName = data.userName;
    var pwd = data.password;

    console.log("uName=" + uName + " and pwd=" + pwd);

    //check in file data

    fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {

        var jsObjectForData = JSON.parse(data);
        var usersList = jsObjectForData.userList;
        var recordFound = false;
        var name = "";
        for (var i = 0; i < usersList.length; i++) {
            console.log("checking with uName =" + usersList[i].userName + "pwd=" + usersList[i].password);
            if ((uName == usersList[i].userName) && (pwd == usersList[i].password)) {
                recordFound = true;
                name = usersList[i].userName;
                console.log("Yeah!! its matched..");
            }

            if (recordFound) break;
        }



        if (recordFound) {

            request.session.isLoggedIn = true;
            request.session.username = uName;
            //  request.session.name = name;
            //response.send("Success");
            //response.redirect('/dashboard');
            var success = {};
            success.loginSuccess = true;
            success.userinfo = {};
            success.userinfo.name = name;

            response.send(success);

        } else {
            var failure = {};
            failure.loginSuccess = false;
            response.send(failure);
        }


    });



});

/** handle "/register" url */
app.post('/register', function (request, response) {

    console.log(JSON.stringify(request.body));

    var email = request.body.email;
    var userName = request.body.userName;
    //    var name = data.name;
    //
    //    var newUser = {};
    //    newUser.email = email;
    //    newUser.pwd = pwd;
    //    newUser.name = name;

    //console.log("email=" + email + " and pwd=" + password);

    fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {
        /**process the file data here
            may be validate incoming user data with existing data
        **/
        console.log('file data=' + data);
        var jsObjectForData = JSON.parse(data);
        // now verify in the json object, whether this user is already registred with the email or not
        //you have to make its not a duplicate email id

        var usersList = jsObjectForData.userList;
        var recordFound = false;
        var name = "";
        if (usersList.length == 0) {
            recordFound = false;
        } else {
            for (var i = 0; i < usersList.length; i++) {
                console.log("checking with email =" + usersList[i].email + "userName=" + usersList[i].userName);
                if ((email == usersList[i].email) && (userName == usersList[i].userName)) {
                    recordFound = true;
                    userName = usersList[i].userName;
                    console.log("Yeah!! its matched..");
                }

                if (recordFound) break;
            }
        }

        if (!recordFound) {
            jsObjectForData.userList.push(request.body);
            console.log(JSON.stringify(jsObjectForData));
            var stringFile = JSON.stringify(jsObjectForData);
            fs.writeFile(__dirname + "/data/userList.json", stringFile);

            var success = {};
            success.registerSuccess = true;
            success.userinfo = {};
            success.userinfo.name = userName;

            response.send(success);
        } else {
            var failure = {};
            failure.registerSuccess = false;
            response.send(failure);
        }
    });


});

app.get('/dashboard', function (request, response) {
    if (request.session.isLoggedIn) {
        var htmlText = `<!DOCTYPE html>
            <html>
            <head>
                <title>Dashboard</title>
            </head>
            <body>
                Welcome ` + request.session.name + ` <a href="/logout"> Logout </a>
            </body>
            </html>`;

        response.send(htmlText);
    } else {
        response.sendFile(__dirname + "/app/invalidSession.html");
    }
});

app.get('/logout', function (req, res) {
    console.log('/logout');
    req.session.destroy();
    res.end();



});
//app.get('/status',function(req,res){
//    if(request.session.isLoggedIn){
//        res.send(true);
//    }
//})
app.get('/getUserInfo', function (request, response) {
    if (request.session.isLoggedIn) {
        var session = {};
        session.log = request.session.isLoggedIn;
        console.log(session.log);
        //        var name = request.session.name;
        //        var data = {};
        //        data.name = name;
        response.send(session);
        response.end();
    } else {
        response.send(false);
        response.end();
    }
});

var selectUserFromDb = function (usersList, userName) {
    console.log('selectuserList', usersList);
    console.log('selectUser', userName);
    var userObject = null;
    var recordFound = false;
    for (var i = 0; i < usersList.length; i++) {
        console.log("checking with userName =" + usersList[i].userName);
        if ((userName == usersList[i].userName)) {
            recordFound = true;
            userObject = usersList[i];
            console.log("Yeah!! its matched..");
        }

        if (recordFound) break;
    }

    return userObject;
}
app.get('/contactsList', function (request, response) {
    console.log("entered contactlist");
    //response.sendFile(__dirname + "/data/contactList.json");
    console.log(request.session);
    if (request.session.isLoggedIn) {
        var username = request.session.username;
        console.log("userName contactlist", username);

        fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {

            var jsObjectForData = JSON.parse(data);
            var usersList = jsObjectForData.userList;
            console.log('usersList', usersList);

            var userObject = selectUserFromDb(usersList, username);


            if (userObject != null) {
                var success = {};
                success.success = true;
                success.contactList = userObject.contacts;
                console.log("success.contactList", success.contactList)
                response.send(success);

            } else {
                var failure = {};
                failure.sucess = false;
                response.send(failure);
            }


        });

    } else {
        var failure = {};
        failure.sucess = false;
        response.send(failure);
    }

});

app.post('/addContact', function (request, response) {
    console.log("entered add contact");
    if (request.session.isLoggedIn) {
        var userName = request.session.username;
        console.log("usename", userName);
        fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {

            var jsObjectForData = JSON.parse(data);
            var usersList = jsObjectForData.userList;

            var userObject = selectUserFromDb(usersList, userName);


            if (userObject != null) {

                console.log('file data' + data);
                var fileJsonData = JSON.parse(data);

                var newContact = request.body;

                newContact.id = userObject.contacts.length + 1;

                console.log("newContact=" + JSON.stringify(newContact));

                userObject.contacts.push(newContact);

                var stringFile = JSON.stringify(jsObjectForData);

                fs.writeFile(__dirname + "/data/userList.json", stringFile);
                //fs.close();


                var success = {};
                success.success = true;
                success.contactList = userObject.contacts;
                response.send(success);

            } else {
                var failure = {};
                failure.sucess = false;
                response.send(failure);
            }


        });

    } else {
        var failure = {};
        failure.sucess = false;
        response.send(failure);
    }

    console.log("incoming data=" + JSON.stringify(request.body));
});


app.post('/deleteContact', function (request, response) {

    console.log("incoming data=" + JSON.stringify(request.body));
    if (request.session.isLoggedIn) {
        var userName = request.session.username;

        fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {

            var jsObjectForData = JSON.parse(data);
            var usersList = jsObjectForData.userList;

            var userObject = selectUserFromDb(usersList, userName);


            if (userObject != null) {


                var deletedContact = request.body;
                var index = -1;
                for (var i = 0; i < userObject.contacts.length; i++) {
                    if (userObject.contacts[i].id == deletedContact.id) {
                        index = i;
                    }
                }
                console.log("index=" + index);
                if (index >= 0) {
                    var newContactsList = userObject.contacts.splice(index, 1);
                    var stringFile = JSON.stringify(jsObjectForData);
                    console.log("after Delete=" + stringFile);
                    fs.writeFile(__dirname + "/data/userList.json", stringFile);
                    //response.send(stringFile);

                    var success = {};
                    success.success = true;
                    //success.contactList = userObject.contacts;
                    response.send(success);

                } else {
                    response.send(JSON.stringify(jsObjectForData));
                }



            } else {
                var failure = {};
                failure.sucess = false;
                response.send(failure);
            }


        });

    } else {
        var failure = {};
        failure.sucess = false;
        response.send(failure);
    }


});

app.get('/getContact', function (request, response) {

    var id = request.query.id;
    console.log("id=" + id);
    if (request.session.isLoggedIn) {
        var userName = request.session.username;


        fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {
            var jsObjectForData = JSON.parse(data);
            var usersList = jsObjectForData.userList;

            var userObject = selectUserFromDb(usersList, userName);


            if (userObject != null) {

                console.log('file data' + data);

                var foundContact = {};

                for (var i = 0; i < userObject.contacts.length; i++) {
                    if (userObject.contacts[i].id == id) {
                        foundContact = userObject.contacts[i];
                    }
                }


                var stringFile = JSON.stringify(foundContact);
                response.send(stringFile);
            } else {
                var failure = {};
                failure.sucess = false;
                response.send(failure);
            }


        });
    } else {
        var failure = {};
        failure.sucess = false;
        response.send(failure);
    }



});


app.post('/updateContact', function (request, response) {

    console.log("incoming data=" + JSON.stringify(request.body));

    if (request.session.isLoggedIn) {
        var userName = request.session.username;

        fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {


            console.log('file data' + data);
            var fileJsonData = JSON.parse(data);

            var usersList = fileJsonData.userList;

            var userObject = selectUserFromDb(usersList, userName);
            if (userObject != null) {

                var updatedContact = request.body;

                for (var i = 0; i < userObject.contacts.length; i++) {
                    if (userObject.contacts[i].id == updatedContact.id) {
                        userObject.contacts[i] = updatedContact;
                        break;
                    }
                }
                var stringFile = JSON.stringify(fileJsonData);

                fs.writeFile(__dirname + "/data/userList.json", stringFile);
                //fs.close();


                response.send(userObject.contacts);
            } else {
                response.send({});
            }


        });
    } else {
        response.send({});
    }

});
app.get('/forgotPswd', function (request, response) {

    var email = request.query.email;
    console.log("entered forgotPswd", email);
    fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {
        var fileJsonData = JSON.parse(data);
        var recordFound = false;
        var usersList = fileJsonData.userList;
        for (var i = 0; i < usersList.length; i++) {
            console.log("checking with email =" + usersList[i].email);
            if ((email == usersList[i].email)) {
                recordFound = true;
                var userObject = usersList[i];
                console.log("Yeah!! its matched..");
            }

            if (recordFound) break;
        }

        if (recordFound) {
            var success = {};
            success.status = true;
            success.username = userObject.userName;
            console.log("successObj", success);
            response.send(success);
            response.end();
        } else {
            var failure = {};
            failure.status = false;
            response.send(failure);
            response.end();
        }
    });


});
app.post('/updatePswd', function (req, res) {
    console.log("entered updatePswd", req.body);
    var username = req.body.username;
    fs.readFile(__dirname + "/data/userList.json", 'utf-8', function (err, data) {


        console.log('file data' + data);
        var fileJsonData = JSON.parse(data);

        var usersList = fileJsonData.userList;

        var userObject = selectUserFromDb(usersList, username);
        if (userObject != null) {
            console.log("userObj", userObject);

            userObject.password = req.body.pswd;
            console.log("afterchange", userObject);
            console.log(JSON.stringify(fileJsonData));
            var updated = JSON.stringify(fileJsonData);

            fs.writeFile(__dirname + "/data/userList.json", updated);


            res.send("success");
            res.end();
        } else {
            res.send("failed to change");
        }


    });
});

app.listen(3001, function () {
    console.log("server started at port 3000");
});
