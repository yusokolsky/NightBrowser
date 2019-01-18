var express = require('express');
var app = express();
var fs = require('fs');
var jsonfile = require('jsonfile');
app.use(express.static('static'));
app.set('port', process.env.PORT || 80);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var mongodb = require('mongodb');
var router = express.Router();
var path = require('path');
var url = 'mongodb://Admin:isojFyh79xcb6!84kdvk085gjbBLASlbcfdFdb7@ds056549.mlab.com:56549/nightbrowser';
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var crypto = require("crypto");
let MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var cookieParser = require('cookie-parser')
var clone = require('fast-clone');
var request = require('request');
var moment = require('moment');require('moment-timezone');
var ReactGA = require('react-ga');
ReactGA.initialize('UA-107706717-1');
app.use(cookieParser())
var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})
var upload = multer({  storage: storage  });


users=[];
SPBMessages=[];
MSCMessages=[];
Events=[];
Chats=[];
var scrape = require('website-scraper');                                                //OLD WEATHER SCRAP
var options = {
    urls: ['http://weather.rambler.ru/get_informer/?h=1&t=4&p1=1&p2=2&geo_id=29&rmd='],
    directory: './static/weatherParse/',
};
const del = require('del');
let server = app.listen(app.get('port'), function(){                                        //identification
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('users').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            users.push(doc);

        }, function() {
            db.close();
        });
    });
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('Events').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            Events.push(doc);
        }, function() {
            db.close();
        });
    });
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('Chats').find().sort( { Popularity: -1 } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            Chats.push(doc);
        }, function() {
            db.close();

        });
    });

    console.log('Сервер запущен на  http://localhost:' + app.get('port') + '  Ctrl-C to terminate');
});
var socket = require('socket.io');
io = socket(server);                                                                    // CHATS
UsrToken=[];
io.on('connection', (socket) => {

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('UsrNotice', function(UserData) {

        for (var i=0;i<users.length;i++){
            if (users[i].NBID==(parseInt(UserData.UsrId)) && md5(users[i].Password)==UserData.UsrPass){

                let Check= UsrToken.filter(function( obj ) {
                    if(obj.UserId == (parseInt(UserData.UsrId))){
                        socket.join(obj.Token);
                        mongo.connect(url, function (err, db) {
                        db.collection('users').findOne({"NBID": parseInt(UserData.UsrId)}, function(err, doc) {
                                    io.in(obj.Token).emit('UserMessagesUpdate', doc.Messages);
                        });
                        });
                    }
                    return obj.UserId == (parseInt(UserData.UsrId))
                });

                if (Check.toString()==""){
                    crypto.randomBytes(48, function(err, buffer) {
                        var token = buffer.toString('hex');
                        socket.join(UserData.UsrId+token);

                        UserPair={
                            UserId:(parseInt(UserData.UsrId)),
                            Token:UserData.UsrId+token
                        }
                        mongo.connect(url, function (err, db) {
                        db.collection('users').findOne({"NBID": parseInt(UserPair.UserId)}, function(err, doc) {
                            io.in(UserPair.Token).emit('UserMessagesUpdate', doc.Messages);
                        });
                        });
                        UsrToken.push(UserPair);
                    });
                }

            }
        }

    });
    socket.on('SEND_MESSAGE', function(data){
        if (data.Author) {
            mongo.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('Chats').updateOne({"ChatsId": parseInt(data.roomId)},
                    {
                        $push: {
                            "Messages": {
                                "Author": data.Author,
                                "Message": data.Message,
                                "Date": moment().locale('ru').format('lll'), //::TODO FIX TIME
                            }
                        }
                    })
            });

            for (var i = 0; i < Chats.length; i++) {
                if (Chats[i].ChatsId == (parseInt(data.roomId))) {
                    Message = {
                        "Author": data.Author,
                        "Message": data.Message,
                        "Date": moment().locale('ru').format('lll'),
                    }
                    Chats[i].Messages.push(Message);
                }
            }
            let MessageSend = clone(data);
            MessageSend.Author = getUserNameAndFam(MessageSend.Author);
            io.in(data.roomId).emit('RECEIVE_MESSAGE', MessageSend);

        }
    })
    socket.on('SEND_MESSAGEprivate', function(data){
        if(data.Author) {
           createPrivateDialog(data);
           addMessageToDB(data);
        }
        let MessageSend = clone(data);
        MessageSend.Author = getUserNameAndFam(MessageSend.Author);
        MessageSend.Date=moment().tz('Europe/Moscow').toISOString();
        io.in(data.roomId).emit('RECEIVE_MESSAGEPrivate', MessageSend);
        mongo.connect(url, function (err, db) {
            db.collection('users').findOne({"NBID": parseInt(data.DialogGoal)}, function (err, doc) {
                UsrToken.filter(function (obj) {
                    if (obj.UserId == (parseInt(data.DialogGoal))) {
                        io.in(obj.Token).emit('UserMessagesUpdate', doc.Messages);
                    }
                    return obj.UserId == (parseInt(data.DialogGoal))
                });
            });

        })
    })

    socket.on('UnTagReadedSMS', function(Read) {
        UntUgSMS(Read);
    });
});
function UntUgSMS(Read){
    mongo.connect(url, function (err, db) {
        db.collection('users').updateOne({
                "NBID": parseInt(Read.Author),
                "Messages.UsrID": parseInt(Read.DialogGoal)
            }, {$set: {"Messages.$.Unread": 0}}
        )

        db.close();
    })
}
function createPrivateDialog(data) {
    mongo.connect(url, function (err, db) {
        db.collection('PrivateChats').findOne({"ChatsId": data.roomId,}, function(err, doc) {
            assert.equal(null, err);

            if (doc) {
                db.close();
            }
            if (!doc) {
                NewChat={
                    ChatsId: data.roomId
                }
                console.log(NewChat)
                db.collection('PrivateChats').insertOne(NewChat, function(err, result) {
                    assert.equal(null, err);
                    console.log("Создан новый чат "+NewChat);
                    db.close();
                });
                db.close();
                addMessageToDB(data);
            }
            db.close();
        })
    })
}
function addMessageToDB(data) {
mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('PrivateChats').updateOne({"ChatsId": data.roomId},
        {
            $push: {
                "Messages": {
                    "Author": data.Author,
                    "Message": data.Message,
                    "Date": moment().tz('Europe/Moscow').toISOString(),
                }
            }
        }, function (err, doc) {

        })
        //::TODO dublicate in bd ?/????????
        db.collection('users').updateOne({
            "NBID": parseInt(data.Author)},
            { $addToSet: {
                Messages: {
                    UsrID: parseInt(data.DialogGoal)
                }
            }},{upsert:true}
        );
        db.collection('users').updateOne({
                "NBID": parseInt(data.DialogGoal)},
            { $addToSet: {
                Messages: {
                    UsrID: parseInt(data.Author)
                }
            }},{upsert:true}
        );
        db.collection('users').updateOne({
                "NBID": parseInt(data.Author),
                "Messages.UsrID": parseInt(data.DialogGoal)
            }, { $set: {"Messages.$.LastMessage": moment().tz('Europe/Moscow').toISOString()}}

        )
        db.collection('users').updateOne(
            {                "NBID": parseInt(data.DialogGoal),                "Messages.UsrID": parseInt(data.Author)            },
            { $set: {"Messages.$.LastMessage": moment().tz('Europe/Moscow').toISOString(),"Messages.$.Unread":1}}

        )
    db.close();
});
}
app.post('/getEventsCount/', function(req, res) {
    res.json(Events.length)
})
app.post('/EnterAdmin/', function(req, res) {

    var Login=true;
        if (("AdminNightBrowser"==req.body[0].value) && ("W}IzJ%4~usN6H|4F7X*yXUvfFuZAbgv4JWDRBenbMV9kgf~tLe7qQMkP$nX%"==req.body[1].value)){
            console.log("ВОШЕЛ АДМИН")
            Login= false;
            res.json("true");

        }
    if (Login){
        console.log("взлом?")
        res.json('fake')
    }
});
app.post('/SendAmdinEventsFull/',function(req,res){
    var Login=true;
    if (("AdminNightBrowser"==req.body[0].value) && ("W}IzJ%4~usN6H|4F7X*yXUvfFuZAbgv4JWDRBenbMV9kgf~tLe7qQMkP$nX%"==req.body[1].value)){
        console.log("вв")
        Login= false;
        var EventsToAdmin =[];
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            var cursor = db.collection('Events').find();
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                EventsToAdmin.push(doc);
            }, function() {
                db.close();
                res.json(EventsToAdmin);
            });
        });

    }
    if (Login){
        res.json('fake')
    }

});
app.post('/RemoveEventFromList/', function(req, res) {

    var Login=true;
    if (("AdminNightBrowser"==req.body[0].value) && ("W}IzJ%4~usN6H|4F7X*yXUvfFuZAbgv4JWDRBenbMV9kgf~tLe7qQMkP$nX%"==req.body[1].value)){
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('Events').updateOne({"EventId": parseInt(req.body[2].value)}, {$set:{ CoupleDateStart: "15 сент. 1970",CoupleDateEnd:"15 сент. 1970"}}, function(err, result) {
                    assert.equal(null, err);
                    console.log('Event removed');
                    db.close();
                    updateEventsArray();
                }
            )}
        );
        Login= false;
        res.json("true");

    }
    if (Login){
        console.log("взлом?")
        res.json('fake')
    }
});
app.post('/SendAmdinEventsCurrent/',function(req,res){
    var Login=true;
    if (("AdminNightBrowser"==req.body[0].value) && ("W}IzJ%4~usN6H|4F7X*yXUvfFuZAbgv4JWDRBenbMV9kgf~tLe7qQMkP$nX%"==req.body[1].value)){

        Login= false;
            let sendData=[];

            for (var i=0;i<Events.length;i++){


                if (moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true) || moment.utc(Events[i].SoloDate, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true)) {

                    sendData.push(Events[i])
                }}
            sendData.sort(function(a,b){

                var dt = new Date(moment.utc((a.CoupleDateStart || a.SoloDate), 'DD MMM YYYY', 'ru').toISOString());
                var dt1 = new Date(moment.utc((b.CoupleDateStart || b.SoloDate), 'DD MMM YYYY', 'ru').toISOString());
                return dt-dt1;
            }.bind(this));

            res.json(sendData.reverse());
    }
    if (Login){
        res.json('fake')
    }
});
setInterval(CheckPopularityChats,43200000)
function CheckPopularityChats() {
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('Chats').find({
            Private: 0});
        cursor.forEach(function(doc, err) {
            doc.Popularity = doc.Messages.length;
            db.collection('Chats').save(doc);
        }, function() {
            db.close();
        });
    });
}
setInterval(CheckUserLvl,43200000);
function CheckUserLvl() {
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('users').find({
            VIP: null});
            cursor.forEach(function(doc, err) {
                let Level=0;
                if (doc.UsrFirstName){Level++;}
                if (doc.UsrLastName){Level++;}
                if (doc.UsrPhotoBig){Level++;}
                if (doc.UsrDesc){Level+=5;}
                if (doc.Sex){Level+=3;}
                if (doc.DateofBirthday){Level+=4;}
                if (doc.FriendList){
                    Level+=doc.FriendList.length;}
                doc.Level=Level;
            db.collection('users').save(doc);
        }, function() {
                updateUsersArray();
            db.close();
        });
    });
}
setInterval(getEventsKuadGo,43200000)//
function getEventsKuadGo(){
    request.get({
        url: 'https://kudago.com/public-api/v1.3/events/?lang=&fields=id,title,description,dates,images&expand=&order_by=&text_format=&ids=&location=spb&text_format=text&actual_since='+moment().unix(),
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            //console.log(JSON.stringify(data));
            data.results.map(function(check) {
                var AddEvent = true;
                for (var i=0;i<Events.length;i++){
                    if (Events[i].KGID==(check.id)){
                        AddEvent=false;
                        break;
                    }
                }
                if (AddEvent){
                    var start =moment.unix(check.dates[0].start).locale('ru').format("DD MMM YYYY");
                    //console.log(check.dates[0].start)
                    var end =moment.unix(check.dates[0].end).locale('ru').format("DD MMM YYYY");

                    var time =moment.unix(check.dates[0].start).locale('ru').format("hh:mm");
                    var EventK={
                        KGID:check.id,
                        EventId: Events.length+1,
                        CreatorId: "1",
                        Category: "Разное",
                        Sex: "Любой",
                        Name:check.title,
                        Peoples: [
                            {
                                NBID: "1",
                                Status: 1
                            }
                        ],
                        CoupleDateStart:start,
                        CoupleDateEnd:end,
                        CoupleTimeStart: time,
                        Description:check.description,
                        PhotoURL:check.images[0].image
                    };
                     //console.log(' aded '+ EventK );
                    Events.push(EventK);
                    mongo.connect(url, function(err, db) {
                        assert.equal(null, err);
                        db.collection('Events').insertOne(EventK, function(err, result) {
                            assert.equal(null, err);
                            console.log('EventK inserted',EventK.Name);
                            db.close();
                        });
                    });
                }
            });
            updateEventsArray()
        }
    });

}
app.post('/UploadPhoto', upload.single('avatar'), function (req, res, next) {
    console.log("файл:"+req.file)
    console.log("имя:"+req.body.FirstName)
    console.log("фам:"+req.body.SecondName)
    console.log("ид:"+req.body.NBID)
    //console.log(req.body)
    let Usrphoto;
    if(req.body.AvatarURL){
        Usrphoto=req.body.AvatarURL
    }else{
        Usrphoto='../images/LogoProfile.jpg'
    }
    if(req.file){
        Usrphoto='/uploads/'+req.file.filename;
    }



   mongo.connect(url, function(err, db) {
            assert.equal(null, err);
       var cursor = db.collection('users').updateOne({"NBID": parseInt(req.body.NBID)}, {$set:{ UsrFirstName: req.body.FirstName,UsrLastName:req.body.SecondName,UsrPhotoBig: Usrphoto,UsrDesc:req.body.UserDescription,Sex:req.body.Sex,DateofBirthday:req.body.DateofBirthday}}, function(err, result) {
                    assert.equal(null, err);
                    console.log('User updated '+req.body.NBID);
                }
            );
            var cursor = db.collection('users').find({
                "NBID": parseInt(req.body.NBID)});
            cursor.forEach(function(doc, err) {
                let Level=0;
                if (doc.UsrFirstName){Level++;}
                if (doc.UsrLastName){Level++;}
                if (doc.UsrPhotoBig){Level++;}
                if (doc.UsrDesc){Level+=5;}
                if (doc.Sex){Level+=3;}
                if (doc.DateofBirthday){Level+=4;}
                if (doc.FriendList){
                    Level+=doc.FriendList.length;}
                doc.Level=Level;
                db.collection('users').save(doc);
            }, function() {

                updateUsersArray();
                db.close();
                res.redirect('./User/'+req.body.NBID);
            });
       }
    );



})

app.post('/SendChat', upload.single('ChatPhoto'), function (req, res, next) {
    let NewChat={
        ChatsId: Chats.length+1,
        CreatorId:req.body.NBID,
        Name:req.body.ChatName,
        Description:req.body.ChatDescription,
        Popularity:0,
        Messages:[{
            "Author": 1,
            "Message": "Добро пожаловать в ваш чат!",
            "Date": moment().locale('ru').format('lll'),
        }]
    };
    if(req.file){
        let Usrphoto='/uploads/'+req.file.filename;
        NewChat.PhotoURL=Usrphoto
        console.log("новый чат:"+NewChat.PhotoURL)
    }else{if(req.body.PhotoURL){
        NewChat.PhotoURL=req.body.PhotoURL
    }}
    if(req.body.PrivatetCheckBox) {
        NewChat.Private = parseInt(req.body.PrivatetCheckBox);
    }else{
        NewChat.Private =0;
    }
    if(NewChat.Private){
        NewChat.Peoples=[{
            NBID:req.body.NBID,
            Status:1,
        }]
    }
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('Chats').insertOne(NewChat, function(err, result) {
            assert.equal(null, err);
            console.log("Создан новый чат "+NewChat);
            Chats.push(NewChat)
            db.close();
            res.redirect('./Chats/'+NewChat.ChatsId)
        });
    });
});

app.post('/SendEvent', upload.single('EventPhoto'), function (req, res, next) {

    // console.log('ид '+req.body.NBID)
    // console.log('название '+req.body.NameofEvent)
    // console.log('категория '+req.body.SelectedCategory)
    // console.log('описание '+req.body.EventDescription)
    // console.log('урл картинки '+req.body.EventURL)
    // console.log('коордианты '+req.body.MapLocation)
    // console.log('дата при одном '+req.body.SoloDate)
    // console.log('начало даты '+req.body.CoupleDateStart)
    // console.log('конец даты '+req.body.CoupleDateEnd)
    // console.log('дата начала '+req.body.CoupleTimeStart)
    // console.log('дата конца '+req.body.CoupleTimeEnd)
    // console.log('выбор количества '+req.body.PeopleCountCheckBox) //1- количество undifined - неогр
    // console.log('количество при выборе '+req.body.PeopleCount)
    // console.log('пол '+req.body.Sex)
    // console.log('выбор возраста '+req.body.AgeType)          //1- количество undifined - любой
    // console.log('диапазон '+req.body.example_name)
    // console.log('ссылка '+req.body.URLtoEvent)
    let NewEvent={
        EventId: Events.length+1,
        CreatorId:req.body.NBID,
        DateofAdd:getDateTime(),
        Name:req.body.NameofEvent,
        Category:req.body.SelectedCategory,
        Location:req.body.MapLocation,
        Sex:req.body.Sex,
        Peoples:[{
            NBID:req.body.NBID,
            Status:1,
        }]
    }
    if(req.file){
        let Usrphoto='/uploads/'+req.file.filename;
        NewEvent.PhotoURL=Usrphoto
        console.log("новое событие:"+NewEvent.PhotoURL)
    }else{
        if(!req.body.EventURL){
            switch (req.body.SelectedCategory) {
                case "Прогулка":
                    NewEvent.PhotoURL="/images/fons/Walking.png"
                    break;
                case "Культурное":
                    NewEvent.PhotoURL="/images/fons/Cutlure.jpg"
                    break;
                case "Активный отдых":
                    NewEvent.PhotoURL="/images/fons/ACtive.jpg"
                    break;
                case "Кафе":
                    NewEvent.PhotoURL="/images/fons/Cafe.jpg"
                    break;
                case "Ночной клуб":
                    NewEvent.PhotoURL="/images/fons/nightclub.jpg"
                    break;
                case "Посиделки":
                    NewEvent.PhotoURL="/images/fons/home.jpg"
                    break;
            }
        }
    }
    if(req.body.EventDescription){
        NewEvent.Description=req.body.EventDescription
    }
    if(req.body.EventURL){
        NewEvent.PhotoURL=req.body.EventURL
    }
    if(req.body.SoloDate){
        NewEvent.SoloDate=moment(req.body.SoloDate, 'YYYY-MM-DD').locale('ru').format("DD MMM YYYY")
    }
    if(req.body.CoupleDateStart){

        NewEvent.CoupleDateStart=moment(req.body.CoupleDateStart, 'YYYY-MM-DD').locale('ru').format("DD MMM YYYY")
        NewEvent.CoupleDateEnd=moment(req.body.CoupleDateEnd, 'YYYY-MM-DD').locale('ru').format("DD MMM YYYY")
    }
    if(req.body.CoupleTimeStart){
        NewEvent.CoupleTimeStart=req.body.CoupleTimeStart
        NewEvent.CoupleTimeEnd=req.body.CoupleTimeEnd
    }
    if(req.body.PeopleCountCheckBox){
        NewEvent.PeopleCount=parseInt(req.body.PeopleCount)
    }else{
        NewEvent.PeopleCount=0
    }
    if(req.body.AgeType){
        NewEvent.AgeRange=req.body.example_name
    }else{
        NewEvent.AgeRange=0
    }
    if(req.body.URLtoEvent) {
        NewEvent.URLtoEvent = req.body.URLtoEvent
    }

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('Events').insertOne(NewEvent, function(err, result) {
            assert.equal(null, err);
            console.log('Event inserted');

            Events.push(NewEvent)
            db.close();
        });
    });
    mongo.connect(url, function (err, db) {
            assert.equal(null, err);

            db.collection('users').updateOne({"NBID": parseInt(req.body.NBID)}, {
                    $push: {
                        UserEvents: {
                            EventID: NewEvent.EventId,
                            Status: "1"
                        }
                    }
                }, function (err, result) {
                    assert.equal(null, err);
                    console.log('User updated событие создано');
                updateUsersArray();
                    db.close();
                res.redirect('./Event/'+NewEvent.EventId)
                }
            )

        }
    );



});


app.post('/SendFriendRequest/', function(req, res) {
    var newFriend=true;

    if(req.body.FriendID=="" || req.body.Userid==""){
        newFriend=false;
    }
    if(req.body.Userid==req.body.FriendID){
        newFriend=false;
    }
    for (var i=0;i<users.length;i++){
        if (users[i].NBID==(req.body.Userid) && users[i].FriendList){
            for (var j=0;j<users[i].FriendList.length;j++){
            if (users[i].FriendList[j].FriendNBID==req.body.FriendID){
                newFriend=false;

            }
            }
        }
    }
    console.log("новый друг ---"+newFriend)
    if (newFriend) {
        mongo.connect(url, function (err, db) {
                assert.equal(null, err);

                db.collection('users').updateOne({"NBID": parseInt(req.body.FriendID)}, {
                        $push: {
                            FriendList: {
                                FriendNBID: req.body.Userid.toString(),
                                Status: "1"
                            }
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        console.log('User updated 2');
                        db.close();
                    }
                )
                db.collection('users').updateOne({"NBID": parseInt(req.body.Userid)}, {
                        $push: {
                            FriendList: {
                                FriendNBID: req.body.FriendID.toString(),
                                Status: "2"
                            }
                        }
                    }, function (err, result) {

                        assert.equal(null, err);
                        console.log('User updated 1');
                        db.close();
                    updateUsersArray();
                    }
                )

            }
        );


    }
    res.end();
});

app.post('/AcceptFriendRequest/', function(req, res) {
        mongo.connect(url, function (err, db) {
                assert.equal(null, err);

                db.collection('users').updateOne({"NBID": parseInt(req.body.FriendID),"FriendList.FriendNBID":req.body.Userid.toString()}, {
                    $set: {"FriendList.$.Status": "0",
                        "FriendList.$.FriendsSince":req.body.FriendsSince
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        console.log('User updated '+req.body.FriendID);
                        db.close();
                    }
                )
                db.collection('users').updateOne({"NBID": parseInt(req.body.Userid),"FriendList.FriendNBID":req.body.FriendID.toString()}, {
                    $set: {"FriendList.$.Status": "0",
                        "FriendList.$.FriendsSince":req.body.FriendsSince
                        }
                    }, function (err, result) {
                        console.log('User updated '+req.body.Userid);
                        assert.equal(null, err);
                        db.close();
                    updateUsersArray();
                    res.json(true);
                    }
                )


        });

});

app.post('/DeleteFriend/', function(req, res) {
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('users').updateOne({"NBID": parseInt(req.body.FriendID)}, {
            $pull:{ "FriendList" : { "FriendNBID": req.body.Userid.toString() } }
            }, function (err, result) {
                assert.equal(null, err);

                db.close();
            }
        )
        db.collection('users').updateOne({"NBID": parseInt(req.body.Userid)}, {
            $pull:{ "FriendList" : { "FriendNBID": req.body.FriendID.toString() } }
            }, function (err, result) {

                assert.equal(null, err);
                db.close();
                updateUsersArray();
                res.json(true);
            }
        )


    });

});

app.post('/GetKudagoData', function(req, res) {
    request.get({
        url: 'https://kudago.com/public-api/v1.2/events-of-the-day/?expand=event&location=spb',
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, reponse, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (reponse.statusCode !== 200) {
            console.log('Status:', reponse.statusCode);
        } else {
            res.json(data);
        }
    });

});
app.get('/uploads/:filename', function(req, res) {

   res.sendFile(__dirname+'/uploads/'+req.params.filename)
});
app.get('/ChatData/:id', function(req, res) {
    if(req.params.id!="undefined"){
        if(req.params.id>Chats.length){
            error=true;
            res.json(error)
        }
        else
        {
            for (var i=0;i<Chats.length;i++){
                if (Chats[i].ChatsId==(req.params.id)){
                    if(Chats[i].Private==1){
                        res.json("Private");
                        break;
                    }else{
                    let sendUserData = clone( Chats[i]);
                    delete sendUserData._id;
                        delete sendUserData.Messages;
                    res.json(sendUserData);
                    break;
                    }
                }
            }

        }
    }else{

        res.sendFile(path.join(__dirname, 'static/index.html'));
    }});
app.get('/UserData/:id/edit', function(req, res) {

    if (req.params.id!="undefined") {
        var userdatafromDb;
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("users").findOne({"NBID": parseInt(req.params.id)}, function(err, doc) {
                if (err) console.log(err);
                userdatafromDb = clone(doc);
                delete userdatafromDb.Password;
                delete userdatafromDb._id;
                delete userdatafromDb.Messages;
                res.json(userdatafromDb);
                db.close();
            });
        });
    }else{
        res.redirect('back');
    }
});
var Style={ background: 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top,#D1B464 0%, #5d4a1f 62.5%, #5d4a1f 100%)'}
app.get('/UserData/:id', function(req, res) {

    if(req.params.id!="undefined"){
    if(req.params.id>users.length || users==[]){
        error=true;
        res.json(error)
    }
    else
    {
        if (users!=[]){
        for (var i=0;i<users.length;i++){
            if (users[i].NBID==(req.params.id)){
                let sendUserData = clone( users[i]);
               /* if (users[i].VIP==1){
                    sendUserData.VIPSTYLE=Style;
                }*/
                delete sendUserData.Password;
                delete sendUserData._id;
                delete sendUserData.Messages;
                res.json(sendUserData);
                break;
            }
        }}else{
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("users").findOne({"NBID": parseInt(req.params.id)}, function(err, doc) {
                if (err) console.log(err);
                userdatafromDb = clone(doc);
                delete userdatafromDb.Password;
                delete userdatafromDb._id;
                delete userdatafromDb.Messages;
                res.json(userdatafromDb);
                db.close();
            });
        });}

    }
}else{

        res.sendFile(path.join(__dirname, 'static/index.html'));
    }});
var ogs = require('open-graph-scraper');
app.get('/EventData/:id', function(req, res) {
    if(req.params.id!="undefined"){
    if(req.params.id>Events.length){
        error=true;

        res.json(error)
    }
    else
    {
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("Events").findOne({"EventId": parseInt(req.params.id)}, function(err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);
                if(doc){
                    let sendEventData = clone(doc);
                    delete sendEventData._id;
                    console.log("эвент :"+doc.EventId)
                    if (doc.URLtoEvent) {
                        var options = {'url': doc.URLtoEvent};
                        ogs(options, function (err, results) {
                            sendEventData.ogData=results.data;
                            res.json(sendEventData);

                        });
                    }else{
                        res.json(sendEventData);
                    }
                }
                db.close();
            });
        });

    }}else{
        res.sendFile(path.join(__dirname, 'static/index.html'));
    }
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});
app.post('/AcceptToEvent/', function(req, res) {

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('users').updateOne({"NBID": parseInt(req.body.requstToEvent.UserId),"UserEvents.EventID":parseInt(req.body.requstToEvent.EventId)}, {
                $set: {"UserEvents.$.Status": "1"
                }
            }, function (err, result) {
                assert.equal(null, err);
                db.close();
            updateUsersArray();
            }
        )
        db.collection('Events').updateOne({"EventId":parseInt(req.body.requstToEvent.EventId),"Peoples.NBID":req.body.requstToEvent.UserId.toString()}, {
                $set: {"Peoples.$.Status": "1"
                }
            }, function (err, result) {
                assert.equal(null, err);
                db.close();
                updateEventsArray()
            }
        )


    });
    res.end();
});


app.post('/DeclineToEvent/', function(req, res) {

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('users').updateOne({"NBID":parseInt(req.body.requstToEvent.UserId)}, {
                $pull:{ "UserEvents" : { "EventID": parseInt(req.body.requstToEvent.EventId) } }
            }, function (err, result) {
                assert.equal(null, err);

                db.close();
            updateUsersArray();
            }
        )
        db.collection('Events').updateOne({"EventId": parseInt(req.body.requstToEvent.EventId)}, {
                $pull:{ "Peoples" : { "NBID":req.body.requstToEvent.UserId.toString() } }
            }, function (err, result) {

                assert.equal(null, err);
                db.close();
            updateEventsArray()

            }
        )


    });
    res.end();
});
app.post('/SendRequestToEvent/', function(req, res) {

        mongo.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('users').updateOne({"NBID": parseInt(req.body.requstToEvent.UserId)}, {
                        $push: {
                            UserEvents: {
                                EventID: parseInt(req.body.requstToEvent.EventId),
                                Status: "2"
                            }
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        db.close();
                        updateUsersArray();
                    }
                )
                db.collection('Events').updateOne({"EventId": parseInt(req.body.requstToEvent.EventId)}, {
                        $push: {
                            Peoples: {
                                NBID: req.body.requstToEvent.UserId.toString(),
                                Status: "2"
                            }
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        db.close();
                    updateEventsArray()

                    }
                )

            }
        );
    res.end();
});

app.post('/SendDeclRequestToEvent/', function(req, res) {
    mongo.connect(url, function (err, db) {
            assert.equal(null, err);
                db.collection('users').updateOne({"NBID": parseInt(req.body.requstToEvent.UserId)}, {
                        $pull:{ "UserEvents" : { "EventID":  parseInt(req.body.requstToEvent.EventId) } }
                    }, function (err, result) {
                        assert.equal(null, err);
                        db.close();
                    updateUsersArray()
                    }
                )
                db.collection('Events').updateOne({"EventId": parseInt(req.body.requstToEvent.EventId)}, {
                        $pull:{ "Peoples" : { "NBID":  req.body.requstToEvent.UserId.toString() } }
                    }, function (err, result) {
                        assert.equal(null, err);
                        db.close();
                        updateEventsArray()

                    }
                )

        }
    );
    res.end();
});
function empty( mixed_var ) {
    return (
        mixed_var === '' ||
        mixed_var === 0 ||
        mixed_var === '0' ||
        mixed_var === null ||
        mixed_var === false ||
        mixed_var === 'false' ||
        mixed_var === undefined
    );
}
var ksort = require('ksort');
var md5 = require('md5');
function authOpenAPIMember(app_cookie) {
    var session;
    session = {};
    var member;
    member = false;
    var valid_keys;
    valid_keys = ["expire","mid","secret","sid","sig"];

    if (app_cookie) {
        var session_data;
        session_data = app_cookie.split("&");
        var _key_;
        __loop1:
            for (_key_ in session_data) {
                var pair;
                pair = session_data[_key_];
                var key, value, __LIST_VALUES__;
                __LIST_VALUES__ = pair.split("=");
                key = __LIST_VALUES__[0];
                value = __LIST_VALUES__[1];
                if (empty(key) || empty(value) || !valid_keys.includes(key)) {
                    continue;
                }
                session[key] = value;
            }
        __loop1:
            for (_key_ in valid_keys) {
                key = valid_keys[_key_];
                if (!(session[key])) {
                    return member;
                }
            }
        ksort(session);
        var sign;
        sign = "";
        __loop1:
            for (key in session) {
                value = session[key];
                if (key != "sig") {
                    sign += key + "=" + value;
                }
            }
        sign += "hnaTEBPPhGicbCJ0WfI5";
        sign = md5(sign);
        if (session["sig"] == sign && session["expire"] > (new Date() / 1000)) {
            member = {
                "id": session["mid"],
                "secret": session["secret"],
                "sid": session["sid"]
            };
        }
    }
    return member;
}

    app.post('/VKreq/', function(req, res) {
        let member = authOpenAPIMember(req.body.vkapptocookie);
        if (member !== false) {
            var NewUser=true;
            for (var i=0;i<users.length;i++){
                if (users[i].VkID===(req.body.VkID)){
                    NewUser=false;
                }
            }
            if (NewUser){
                var AddUser={
                    NBID: users.length+1,
                    VkID: req.body.VkID,
                    UsrFirstName: req.body.UsrFirstName,
                    UsrLastName:req.body.UsrLastName,
                    VkHREF:req.body.UsrHREF,
                    Password:Math.random().toString(36),
                    UsrPhotoBig:'',
                    DateOfReg:moment().locale('ru').format('lll'),
                    UsrCity:req.body.UsrCity,
                    Level:0
                };
                console.log("вк рег:"+AddUser.VkID)
                users.push(AddUser);

                mongo.connect(url, function(err, db) {
                    assert.equal(null, err);
                    db.collection('users').insertOne(AddUser, function(err, result) {
                        assert.equal(null, err);
                        console.log('User inserted');
                        db.close();
                    });
                });
            }else{

                mongo.connect(url, function(err, db) {
                    assert.equal(null, err);
                    db.collection('users').updateOne({"VkID": req.body.VkID}, {$set:{ UsrCity: req.body.UsrCity}}, function(err, result) {
                            assert.equal(null, err);
                            db.close();
                        }
                    )}
                );
            }
        } else {
            console.log(member)
        }
    /**/

    res.end();
})
app.post('/VKadd/', function(req, res) {
    let member = authOpenAPIMember(req.body.vkapptocookie);
    if (member !== false) {
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection('users').updateOne({"NBID": req.body.NBID},
                {
                    $set: {
                        "VkID": req.body.VkID,
                        "UsrFirstName": req.body.UsrFirstName,
                        "UsrLastName": req.body.UsrLastName,
                        "VkHREF": req.body.UsrHREF,
                        "UsrPhotoBig": req.body.UsrPhotoBig,
                    }
                }, function (err, result) {
                    assert.equal(null, err);

                    db.close();
                    updateUsersArray();
                });
        });


        console.log('User updated');
        res.end();
    }
})
app.post('/VKreq1/', function(req, res) {
    let member = authOpenAPIMember(req.body.vkapptocookie);
    if (member !== false) {
        for (var i = 0; i < users.length; i++) {

            if (users[i].VkID === (req.body.VkID)) {
                var pet = users[i]


                mongo.connect(url, function (err, db) {
                    assert.equal(null, err);
                    db.collection('users').updateOne({"VkID": pet.VkID}, {$set: {"UsrPhotoBig": req.body.UsrPhotoBig}}, function (err, result) {
                        assert.equal(null, err);
                        console.log('User updated Vk ' + pet.NBID);
                        db.close();
                        updateUsersArray();
                    });
                });
                break;
            }
        }
    }
    res.end();
})

app.post('/FindUsers/', function(req, res) {

    if(!req.body.SecondWord){
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection("users").find({
            $or:
            [
                {"UsrFirstName": new RegExp(req.body.FirstWord, 'i')},
                {"UsrLastName": new RegExp(req.body.FirstWord, 'i')}
                ]}).toArray(function (err, doc) {
            assert.equal(null, err);
            if (err) console.log(err);
            userdatafromDb = doc;
            userdatafromDb.forEach(function(element) {
                delete element.Password;
                delete element._id;
                delete element.Messages;
                })

            res.json(userdatafromDb);
            db.close();
        });
    });
    }else{
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("users").find({$or:[{"UsrFirstName": new RegExp(req.body.FirstWord, 'i')},{"UsrLastName": new RegExp(req.body.SecondWord, 'i')}]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);
                userdatafromDb = doc;
                delete userdatafromDb.Password;
                delete userdatafromDb._id;
                delete userdatafromDb.Messages;
                res.json(userdatafromDb);
                db.close();
            });
        });
    }
})

//:TODO || character
app.post('/FindUsersAndEvent/', function(req, res) {
    var sendData=[];
    if(!req.body.SecondWord){
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("users").find({
                $or:
                    [
                        {"UsrFirstName": new RegExp(req.body.FirstWord, 'i')},
                        {"UsrLastName": new RegExp(req.body.FirstWord, 'i')}
                    ]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);
                userdatafromDb = doc;
                userdatafromDb.forEach(function(element) {
                    delete element.Password;
                    delete element._id;
                    delete element.Messages;
                })
                sendData[0]=userdatafromDb;
                db.close();
            });
            db.collection("Events").find({
                $or:
                    [
                        {"Name": new RegExp(req.body.FirstWord, 'i')},
                        {"Name": new RegExp(req.body.FirstWord, 'i')}
                    ]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);

                EventData = doc;
                EventData.forEach(function(element) {
                    if (element.CoupleDateEnd>=getDateTime(true) || element.SoloDate>=getDateTime(true)) {
                        delete element
                    }else{
                        delete element.CreatorId;
                        delete element.Peoples;
                        delete element.DateofAdd;
                        delete element.Location;
                        delete element.Sex;
                        delete element.Description;
                        delete element.AgeRange;
                        delete element.URLtoEvent;
                    }
                })

                sendData[1]=EventData;
                res.json(sendData)
                db.close();
            });
        });

    }else{
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("users").find({$or:[{"UsrFirstName": new RegExp(req.body.FirstWord, 'i')},{"UsrLastName": new RegExp(req.body.SecondWord, 'i')}]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);
                userdatafromDb = doc;
                delete userdatafromDb.Password;
                delete userdatafromDb._id;
                delete userdatafromDb.Messages;
                sendData[0]=userdatafromDb;
                db.close();
            });
            db.collection("Events").find({
                $or:[{
                    "Name": new RegExp(req.body.FirstWord, 'i')},
                    {"Name": new RegExp(req.body.SecondWord, 'i')}
                ]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);

                EventData = doc;
                EventData.forEach(function(element) {
                    if (element.CoupleDateEnd>=getDateTime(true) || element.SoloDate>=getDateTime(true)) {
                        delete element;
                    }else{
                        delete element.CreatorId;
                        delete element.Peoples;
                        delete element.DateofAdd;
                        delete element.Location;
                        delete element.Sex;
                        delete element.Description;
                        delete element.AgeRange;
                        delete element.URLtoEvent;
                    }
                })

                sendData[1]=EventData;
                res.json(sendData)
                db.close();
            });
        });
    }


})


app.post('/getPrivateMessages/', function(req, res) {
    for (var i=0;i<users.length;i++){
        if (users[i].NBID==(parseInt(req.body.UsrId)) && md5(users[i].Password)==req.body.UsrPass) {
            if (req.body.currentDialog != "undefined") {
                let userdatafromDb;
                mongo.connect(url, function (err, db) {
                    assert.equal(null, err);
                    console.log(req.body.currentDialog)
                    db.collection("PrivateChats").findOne({"ChatsId": req.body.currentDialog}, (function (err, doc) {
                        if (doc) {
                            userdatafromDb = doc.Messages;
                            if (req.body.Items < userdatafromDb.length + 15) {
                                let clonefake = clone(userdatafromDb);
                                clonefake.reverse();
                                let sendUserData = clonefake.slice(parseInt(req.body.Items) - parseInt(req.body.CountOfLoad), parseInt(req.body.Items));
                                sendUserData.forEach(function (datax) {
                                    datax.Author = getUserNameAndFam(datax.Author);
                                })

                                res.json(sendUserData)
                            }
                        } else {
                            res.json()
                        }
                        db.close();
                    }))
                    ;
                });


            }
        }
        }
    });

app.post('/FindChats/', function(req, res) {

    if(req.body.KeyWorld!==""){
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection("Chats").find({
                $or:
                    [
                        {"Name": new RegExp(req.body.KeyWorld, 'i')}
                    ]}).toArray(function (err, doc) {
                assert.equal(null, err);
                if (err) console.log(err);
                userdatafromDb = doc;
                userdatafromDb.forEach(function(datax) {
                    delete datax.Messages;
                    delete datax._id;
                })

                res.json(userdatafromDb);
                db.close();
            });
        });
    }
})

app.post('/GetChats/', function(req, res) {
    if(req.body.Items<Chats.length+10){
        let sendUserData =  clone(Chats.slice(parseInt(req.body.Items)-parseInt(req.body.CountOfLoad), parseInt(req.body.Items)));
        sendUserData.forEach(function (datax) {
            delete datax.Messages;
            delete datax._id;
        })
            res.json(sendUserData)}
    else{res.json("End")}

})

app.post('/ChatDataMessages/', function(req, res) {
    if(req.body.id!="undefined"){
        if(req.body.id>Chats.length){
            error=true;
            res.json(error)
        }
        else
        {
            for (var i=0;i<Chats.length;i++){
                if (Chats[i].ChatsId==parseInt(req.body.id)){
                    if(Chats[i].Private==1){
                        res.json("Private");
                        break;
                    }else{
                        if(req.body.Items<Chats[i].Messages.length+15){
                             let clonefake = clone(Chats[i].Messages);
                             clonefake.reverse();
                            let sendUserData =  clonefake.slice(parseInt(req.body.Items)-parseInt(req.body.CountOfLoad), parseInt(req.body.Items));
                            sendUserData.forEach(function (datax) {
                                datax.Author=getUserNameAndFam(datax.Author);
                            })

                            res.json(sendUserData)
                                            }

                        else{
                            res.json("End")
                        }
                        break;
                    }
                }
            }

        }
    }else{

        res.sendFile(path.join(__dirname, 'static/index.html'));
    }});

app.post('/GetUser/', function(req, res) {

    for (var i=0;i<users.length;i++){
        if (users[i].NBID==(parseInt(req.body.id))){
            let sendUserData = clone( users[i]);
            sendDataUserData={
                NBID: sendUserData.NBID,
                UsrFirstName: sendUserData.UsrFirstName,
                UsrLastName: sendUserData.UsrLastName,
                UsrPhotoBig: sendUserData.UsrPhotoBig,

            }

            res.json(sendDataUserData);
            break;
        }
    }
    /*mongo.connect(url, function (err, db) {               Очень медленно
        assert.equal(null, err);
        db.collection("users").findOne({"NBID": parseInt(req.body.id)},(function(err, doc) {
            assert.equal(null, err);
            if (err) console.log(err);
            userdatafromDb=doc;
            delete userdatafromDb.Password;
            delete userdatafromDb._id;
            res.json(userdatafromDb);
            db.close();
        }))
        ;
    });*/
})


app.post('/GetEventDataForSearch/', function(req, res) {
    let sendData=[];
    for (var i=0;i<Events.length;i++){
        if (moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true) || moment.utc(Events[i].SoloDate, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true)) {

            data = {
                EventId: Events[i].EventId,
                Name: Events[i].Name,
                Category: Events[i].Category,
                Location: Events[i].Location,
                PhotoURL: Events[i].PhotoURL,
                CreatorId: Events[i].CreatorId,
                AgeRange: Events[i].AgeRange,
                Sex: Events[i].Sex,
                PeopleCount:Events[i].Peoples.length
            }
            if(!Events[i].AgeRange){
                data.AgeRange=0;
            }
            if(Events[i].PeopleCount!=0 && Events[i].PeopleCount){
                data.PeopleCount=Events[i].Peoples.length+"/"+Events[i].PeopleCount
            }
            for(var j=0;j<users.length;j++){
                if(Events[i].CreatorId==users[j].NBID){
                    data.CreatorNameF=users[j].UsrFirstName;
                    data.CreatorNameS=users[j].UsrLastName;
                    break;
                }
            }
            if(Events[i].SoloDate){
                data.date=[];
                data.date[0]=Events[i].SoloDate
            }
            if(Events[i].CoupleDateEnd){
                data.date=[];
                data.date[0]=Events[i].CoupleDateStart
                data.date[1]=Events[i].CoupleDateEnd
            }
            sendData.push(data)
        }}
    sendData.sort(function(a,b){

        var dt = new Date(moment.utc(a.date[0], 'DD MMM YYYY', 'ru').toISOString());
        var dt1 = new Date(moment.utc(b.date[0], 'DD MMM YYYY', 'ru').toISOString());
        return dt-dt1;
    }.bind(this));

    res.json(sendData.reverse());

})


app.post('/GetEventDataForMap/', function(req, res) {

    let sendData=[];
    for (var i=0;i<Events.length;i++){

        if (moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true) || moment.utc(Events[i].SoloDate, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true)) {
            data = {
                EventId: Events[i].EventId,
                Name: Events[i].Name,
                Category: Events[i].Category,
                Location: Events[i].Location
            }
            sendData.push(data)
        }}
    res.json(sendData);

})
app.post('/GetClosetEvent/', function(req, res) {

    let sendData=[];
    for (var i=0;i<Events.length;i++){
        //console.log(moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString())
        if(Events[i].CoupleDateStart) {
            var date = moment.utc(Events[i].CoupleDateStart, 'DD MMM YYYY', 'ru').toISOString();
        }else{
            var date = moment.utc(Events[i].SoloDate, 'DD MMM YYYY', 'ru').toISOString();
        }
        var datenow =moment.utc(getDateTime(true)).toISOString();
        if (moment(date).isAfter(datenow) ) {

            data = {
                EventId: Events[i].EventId,
                Name: Events[i].Name,
                Category: Events[i].Category,
                PhotoURL: Events[i].PhotoURL,
                Desc:Events[i].Description,
                date:[]
            }
            if(Events[i].SoloDate){
                data.date[0]=Events[i].SoloDate
            }
            if(Events[i].CoupleDateEnd){
                data.date[0]=Events[i].CoupleDateStart
                data.date[1]=Events[i].CoupleDateEnd
            }
            if(Events[i].CoupleTimeStart){
                data.Time=Events[i].CoupleTimeStart;
            }

            sendData.push(data)
        }}
    sendData.sort(function(a,b){
        var dt = new Date(moment.utc(a.date[0], 'DD MMM YYYY', 'ru').toISOString());
        var dt1 = new Date(moment.utc(b.date[0], 'DD MMM YYYY', 'ru').toISOString());
        return dt-dt1;
    }.bind(this));
    if(sendData[0])
    sendData[0].date[0]= new Date(moment.utc(sendData[0].date[0], 'DD MMM YYYY', 'ru'));
    res.json(sendData[0]);

})
app.post('/GetEventEasy/', function(req, res) {

    let sendData=[];
    for (var i=0;i<Events.length;i++){
        //console.log(moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString())

        if (moment.utc(Events[i].CoupleDateEnd, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true) || moment.utc(Events[i].SoloDate, 'DD MMM YYYY', 'ru').toISOString()>=getDateTime(true)) {

            data = {
                EventId: Events[i].EventId,
                Name: Events[i].Name,
                Category: Events[i].Category,
                PhotoURL: Events[i].PhotoURL,
                Desc:Events[i].Description,
                date:[]
            }
            for(var j=0;j<users.length;j++){
                if(Events[i].CreatorId==users[j].NBID){
                    data.CreatorPhoto=users[j].UsrPhotoBig;
                    break;
                }
            }
            if(Events[i].SoloDate){
                data.date[0]=Events[i].SoloDate
            }
            if(Events[i].CoupleDateEnd){
                data.date[0]=Events[i].CoupleDateStart
                data.date[1]=Events[i].CoupleDateEnd
            }
            sendData.push(data)
        }}
    sendData.sort(function(a,b){

        var dt = new Date(moment.utc(a.date[0], 'DD MMM YYYY', 'ru').toISOString());
        var dt1 = new Date(moment.utc(b.date[0], 'DD MMM YYYY', 'ru').toISOString());
        return dt-dt1;
    }.bind(this));

    res.json(sendData.reverse());

})

app.post('/GetEventData/', function(req, res) {


    for (var i=0;i<Events.length;i++){
        if (Events[i].EventId==(parseInt(req.body.id))){

            for(var j=0;j<users.length;j++){

                if(Events[i].CreatorId==users[j].NBID){
                    let sendUserData = clone( Events[i]);
                    sendUserData.CreatorNameF=users[j].UsrFirstName;
                    sendUserData.CreatorNameS=users[j].UsrLastName;
                    sendUserData.CreatorPhoto=users[j].UsrPhotoBig;
                    delete sendUserData._id;
                    res.json(sendUserData);

                    break;
                }
            }
            break;


        }
    }

})

app.post('/GetUserName/', function(req, res) {
    let member = authOpenAPIMember(req.body.vkapptocookie);
    if (member !== false) {
    for (var i=0;i<users.length;i++){
        if (users[i].VkID==(req.body.id)){
            userdatafromDb = clone(users[i]);
            delete userdatafromDb._id;
            let IncomingFriendReqest=0;
            if(userdatafromDb.FriendList)
            userdatafromDb.FriendList.map(function(Friend) {
                if (Friend.Status==="1"){
                    IncomingFriendReqest++;
                }
            });
            userdatafromDb.IncomingFriendReqest=IncomingFriendReqest;
           // delete userdatafromDb.Password;
            delete userdatafromDb.FriendList;
            delete userdatafromDb.Messages;
            res.json(userdatafromDb);
            break;
        }
    }
    }
})

app.post('/SPBGetMeassges/', function(req, res) {
    res.json(SPBMessages);
})


app.post('/registration/', function(req, res) {
    var newuser = true;
    for (var i=0;i<users.length;i++){
        if (users[i].Login==(req.body.UsrLogin)){
            newuser=false;
            NBID=true;
            res.json(NBID);
            break;
        }
    }
    if (newuser){

        var AddUser={
            NBID: users.length+1,
            Login :req.body.UsrLogin,
            Password:req.body.UsrPass,
            UsrPhotoBig:"../images/LogoProfile.jpg",
            UsrCity:req.body.UsrCity,
            DateOfReg:moment().locale('ru').format('lll'),
            Level:0
        };
        users.push(AddUser);
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('users').insertOne(AddUser, function(err, result) {
                assert.equal(null, err);
                console.log('User inserted');
                db.close();
            });
        });
        res.json(AddUser.NBID);
    }
    else console.log(' user already exist '+ req.body.UsrLogin );

    res.end();
});

app.post('/login/', function(req, res) {
var Login=true;

    for (var i=0;i<users.length;i++){
        if ((users[i].Login==req.body.id) && (users[i].Password==req.body.pass)){
            console.log("вход :"+users[i].Login)
            userdatafromDb = clone(users[i]);
            Login= false
            let IncomingFriendReqest=0;
            if(userdatafromDb.FriendList)
			userdatafromDb.FriendList.map(function(Friend) {
                if (Friend.Status==="1"){
                    IncomingFriendReqest++;
                }
            });
            userdatafromDb.IncomingFriendReqest=IncomingFriendReqest;
            delete userdatafromDb._id;
            delete userdatafromDb.Messages;
            res.json(userdatafromDb);
            break;
            }

        }
    if (Login){
            res.json(0)
    }

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('users').updateOne({"Login": req.body.id}, {$set:{ UsrCity: req.body.UsrCity}}, function(err, result) {
                assert.equal(null, err);
                console.log(err)
                console.log('User updated');
                db.close();
                updateUsersArray();
            }
        )}
    );
   /* mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection("users").findOne({"Login": req.body.UsrLogin,"Password":req.body.UsrPass}, function(err, doc) {
            assert.equal(null, err);
            if (err) console.log(err);
            if(doc){
            userdatafromDb = doc;
            Login= false;
            delete userdatafromDb.Password;
            delete userdatafromDb._id;
                delete userdatafromDb.Messages;
            res.json(userdatafromDb);}else{
                res.json(0)
            }
            db.close();
        });
    });*/


    //updateUsersArray();


});
function getNumberofUnredaddMessages(data){


}
app.post('/GetUserUnreadedMessages/', function(req, res) {
    let countofUnreaded=0;
    data=req.body;
    for (var A=0;A<users.length;A++){
        if (users[A].NBID===(parseInt(data.UsrId)) && md5(users[A].Password)===data.UsrPass){
            mongo.connect(url, function (err, db) {
                db.collection("users").findOne({"NBID": (parseInt(data.UsrId))}, (function (err, doc) {
                        if (doc.Messages) {
                            let x=0;
                            doc.Messages.map(function(item) {
                                x++;
                                if (item.Unread===1)
                                    countofUnreaded++;
                            });
                            if (x===doc.Messages.length) {
                                res.json(countofUnreaded);
                            console.log(countofUnreaded)
                            }                    
							}
                    }
                ));
                db.close();
            })
        }
    }
})
app.post('/loginCheck/', function(req, res) {
    var Login = true;
    for (var i = 0; i < users.length; i++) {
        if ((users[i].NBID==(parseInt(req.body.UsrId)) && md5(users[i].Password)==req.body.UsrPass)) {
            mongo.connect(url, function (err, db) {
                db.collection("users").findOne({"NBID": (parseInt(req.body.UsrId))}, (function (err, doc) {
                        let IncomingFriendReqest=0;
                        let countofUnreaded=0;
                        userdatafromDb = clone(doc);
                        if(userdatafromDb.FriendList)
                        userdatafromDb.FriendList.map(function(Friend) {
                            if (Friend.Status==="1"){
                                IncomingFriendReqest++;
                            }
                        });
                        if( doc.Messages)
                        doc.Messages.map(function(item) {
                            if (item.Unread===1)
                                countofUnreaded++;
                        });
                        userdatafromDb.countofUnreaded=countofUnreaded;
                            userdatafromDb.IncomingFriendReqest=IncomingFriendReqest;
                        delete userdatafromDb.Password;
                        delete userdatafromDb._id;
                        delete userdatafromDb.Messages;
                        delete userdatafromDb.UserEvents;
                            res.json(userdatafromDb);
                    }
                ));
                db.close();
            })
            Login = false
            break;
        }

    }
    if (Login) {
        res.json(0)
    }
});

app.post('/getEventUserAllData/', function(req, res) {
    var Login = true;
    for (var i = 0; i < users.length; i++) {
        if ((users[i].NBID==(parseInt(req.body.UsrId)) && md5(users[i].Password)==req.body.UsrPass)) {
            mongo.connect(url, function (err, db) {
                db.collection("users").findOne({"NBID": (parseInt(req.body.UsrId))}, (function (err, doc) {

                        userdatafromDb = clone(doc);

                        delete userdatafromDb.Password;
                        delete userdatafromDb._id;
                        delete userdatafromDb.Messages;
                        delete userdatafromDb.FriendList;
                        res.json(userdatafromDb);
                    }
                ));
                db.close();
            })
            Login = false
            break;
        }

    }
    if (Login) {
        res.json(0)
    }
});


app.post('/SendPrivateMessage', function(req, res) {



    res.end();
});



app.post('/SendMeassgesSpb', function(req, res) {

    SPBMessages.push({
        author :req.body.author,
        id:req.body.id,
        messageText:req.body.messageText,
        dateTime:req.body.dateTime
    })

    res.end();
});

app.post('/MSCGetMeassges/', function(req, res) {
    res.json(MSCMessages);
})

app.post('/SendMeassgesMSC', function(req, res) {

    MSCMessages.push({
        author :req.body.author,
        id:req.body.id,
        messageText:req.body.messageText,
        dateTime:req.body.dateTime
    })

    res.end();
});

app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});

function updateUsersArray(){
    users=[];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('users').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            users.push(doc);
        }, function() {
            db.close();
        });
    });
}

function updateEventsArray(){
    Events=[];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('Events').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            Events.push(doc);
        }, function() {
            db.close();
        });
    });

}

function getUserNameAndFam(id) {
    for (var i=0;i<users.length;i++){
        if (users[i].NBID==(parseInt(id))){
            if(users[i].UsrFirstName || users[i].UsrLastName){
            let sendUserData = {Name:users[i].UsrFirstName,Fam:users[i].UsrLastName, Id:users[i].NBID,Photo:users[i].UsrPhotoBig}
                return(sendUserData);}
            else{
                let sendUserData ={Name:users[i].NBID,Photo:users[i].UsrPhotoBig}
                return(sendUserData);
            }

            break;
        }
    }

}

function getDateTime(date) {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    if(date){
        return year + "-" + month + "-" + day;
    }
    else
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;


}

