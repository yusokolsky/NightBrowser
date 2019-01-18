
function ajaxReq(url, data, callback){
	$.ajax({
        url: url,
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(data),
        dataType:'json'
    }).done(callback);
}
function setBorder(a,b){
	a.style="border:1px solid white";
	b.style="border:none";
}

function setBorderRed(a){
	a.style="border:2px solid red";
}
function setBorderBlue(a){
	a.style="border:2px solid #4192bb";
}

 function digitalWatch(callback) {
	console.log(callback)
	if (callback===false){
    	clearInterval(Clock);
        console.log(callback)
	}else{
        console.log(callback)
     var Clock = setInterval(function(){
			var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;
		var Time=hours + ":" + minutes + ":" + seconds;
	if (callback) 
			callback(Time)
   }, 1000);}
    
  }

function checkFTON() {
    FTON=getCookie("FirstTimeOrNot");
    console.log(FTON)
    if (FTON != "") {
        return(false)
    }else{
      return(true);
    }
}

function getCookieMd5Pass() {
    return md5(getCookie("UserPass"));
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var id=getCookie("UserId");
var UserName;
function checkCookie(callback) {
    id=getCookie("UserId");
    pass=getCookie("UserPass");

    if (id != "") {

        ajaxReq("/loginCheck/", { UsrId: id,
            UsrPass: getCookieMd5Pass()}, function(userData){
			 UserName=userData.UsrFirstName;
			 if (callback) 
					callback(userData)
		});
    }else{
        if (callback)
            callback("")
	}
}

function checkCookieforEvent(callback) {
    id=getCookie("UserId");
    pass=getCookie("UserPass");

    if (id != "") {

        ajaxReq("/getEventUserAllData/", { UsrId: id,
            UsrPass: getCookieMd5Pass()}, function(userData){
            UserName=userData.UsrFirstName;
            if (callback)
                callback(userData)
        });
    }else{
        if (callback)
            callback("")
    }
}
function checkWeather(callback) {
    Weather=getCookie("Weather");
    if (Weather == "") {
        $.getJSON('http://api.sypexgeo.net/json/', function(data) {
            console.log(data)
            $.getJSON('http://api.worldweatheronline.com/premium/v1/weather.ashx?key=f275780884a54c638c9175705170711&q='+data.ip+'&format=json&num_of_days=1&lang=ru', function(weatherg) {
                console.log(weatherg.data.current_condition[0])
                createCookie("Weather", JSON.stringify(weatherg.data.current_condition[0]), 0.5);
                if (callback)
                    callback(weatherg.data.current_condition[0])
            });
        });

    }else{
        if (callback)
            callback(JSON.parse(Weather))
    }
}
function checkCity(callback) {
    city=getCookie("UserCity");
    if (city == "") {
        $.getJSON('http://api.sypexgeo.net/json/', function(data) {
                console.log(data)
            createCookie("UserCity", data.city.name_ru, 30);
            if (callback)
                callback(data.city.name_ru)
            });
    }else{
        if (callback)
            callback(city)
    }
}
function ClearCoockie(){

    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
        eraseCookie(cookies[i].split("=")[0]);
    if (i= cookies.length)location.reload();



}
function eraseCookie(name) {
    createCookie(name,"",-1);
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
    console.log(document.cookie);
}
function FindUsers(FindRequest,callback){
    var Search=FindRequest.split(/\s* \s*/);
    ajaxReq("/FindUsersAndEvent/", {FirstWord:Search[0],SecondWord:Search[1]}, function(usersFindResult){
        if (callback)
            callback(usersFindResult)
    });
}

Number.prototype.between  = function (a, b) {
    var min = Math.min(a,b),
        max = Math.max(a,b);
    return this >= min && this <= max;
};
function SendFriendRequest(FriendID) {
    id=getCookie("UserId");
    console.log(id)
    ajaxReq("/SendFriendRequest/", {Userid:id,FriendID:FriendID}, function(){

    });
}
function AddVk(UserData,callback){
	var error=false;
    console.log(UserData);
    VK.Auth.login(function(response) {
        if (response.session) {
            UserVK = {
            	NBID:UserData.NBID,
                VkID: response.session.user.id,
                UsrFirstName: response.session.user.first_name,
                UsrLastName:response.session.user.last_name,
                UsrHREF:response.session.user.href,
                vkapptocookie:"expire="+response.session.expire+"&mid="+response.session.mid+"&secret="+response.session.secret+"&sid="+response.session.sid+"&sig="+response.session.sig

        }
            createCookie("vk_app_", UserVK.vkapptocookie, 30);
			/* Пользователь успешно авторизовался */
            VK.Api.call('users.get', {user_ids: response.session.user.id, fields: 'photo_100'}, function(r) {
                if(r.response) {
                    UsrPhotoBig=r.response[0].photo_100;
                    UserVK.UsrPhotoBig=UsrPhotoBig;
                    ajaxReq("/VKadd/", UserVK, function(){});
                }
            });
            console.log(UserVK);


            if (response.settings) {
				/* Выбранные настройки доступа пользователя, если они были запрошены */
            }
        } else {
            error=true;

			/* Пользователь нажал кнопку Отмена в окне авторизации */
        }
    });
if (!error){


}
}
VK.Auth.getLoginStatus(function(response) {
    if(response.session){ // Пользователь авторизован
    }else { // Пользователь не авторизован
    }
})
function loginVK(userCity,callback){

				var UsrPhotoBig;
				var userid;
				var UserVK;
					VK.Auth.login((function(response) {
                            console.log(response)
						  if (response.session) {

                        var vkapptocookie="expire="+response.session.expire+"&mid="+response.session.mid+"&secret="+response.session.secret+"&sid="+response.session.sid+"&sig="+response.session.sig;
                        SendData={
                            vkapptocookie:vkapptocookie,
                            VkID: response.session.user.id,
                            UsrFirstName: response.session.user.first_name,
                            UsrLastName:response.session.user.last_name,
                            UsrHREF:response.session.user.href	,
                            UsrCity:userCity
                        }
                        createCookie("vk_app_", vkapptocookie, 30);
                        ajaxReq("/VKreq/", SendData, function(){});
                              UserName=SendData.UsrFirstName;
                              VK.Api.call('users.get', {user_ids: response.session.user.id, fields: 'photo_400_orig',v:'5.71'}, function(r) {

                                  if(r.response) {
                                      UsrPhotoBig=r.response[0].photo_400_orig;
                                      SendData.UsrPhotoBig=UsrPhotoBig;
                                      ajaxReq("/GetUserName/", {id:response.session.user.id,vkapptocookie:vkapptocookie}, function(userData){
                                          SendData.Level=userData.Level;
                                          SendData.NBID=userData.NBID;
                                          SendData.IncomingFriendReqest=userData.IncomingFriendReqest;
                                          createCookie("UserId", userData.NBID, 30);
                                          createCookie("UserPass", userData.Password, 30);
                                          if (callback)
                                              callback(SendData)
                                      });
                                      ajaxReq("/VKreq1/", {VkID: response.session.user.id,UsrPhotoBig: UsrPhotoBig,vkapptocookie:vkapptocookie}, function(){});

                                  }
                              });
						/**/

					/* Пользователь успешно авторизовался */
					if (response.settings) {
					 /* Выбранные настройки доступа пользователя, если они были запрошены */
					}
				  } else {
						var error=true;
						if (callback)
							callback(error)
				  	/* Пользователь нажал кнопку Отмена в окне авторизации */
				  }


				}

				));

}
function regUsr(username,userPass,userCity,callback) {

    if (username!='' && userPass!=''){
        var UsrCreate = {
            UsrLogin: username,
            UsrPass: userPass,
            UsrCity:userCity
        }
        ajaxReq("/registration/", UsrCreate, function(NBID) {
            if (NBID===true){
                alert("Логин Уже занят ")
            }else{
                createCookie("UserId", NBID, 30);
                createCookie("UserPass", UsrCreate.UsrPass, 30);
                if (callback)
                    callback(NBID)
			}
        });

    }
}


function SendPrivateMessage(author,Usrgoal,msg){

    if (msg.trim()!=''){
        var Time=curDateandTime();
        var UsrGoal=Usrgoal;
        var Message={
            UsrID:Usrgoal,
            LastMessage:Time,
            messageData:{
            author: author,
            Message: msg,
            Date: Time
        }
        };
        ajaxReq("/SendPrivateMessage/", Message, function(){})
    }
}
function logUsr(username,userPass,userCity,callback) {
    console.log(userCity)
    if (username!='' && userPass!=''){
        ajaxReq("/login/", {id:username,pass:userPass,UsrCity:userCity}, function(error) {
            if (error===0){
                alert("Неправильный логин или пароль")
            }else{
                console.log(error)
                createCookie("UserId", error.NBID, 30);
                createCookie("UserPass", error.Password, 30);

                if (callback)
                    callback(error)
            }
        });

    }
}

function SendMeassgesSpb(msg){

	if (msg.trim()!=''){
		if (msg.length>150)
		{var newmsg=msg.slice(0,150);
	msg=newmsg;
		}
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        var Time=hours + ":" + minutes;
        if(!UserName){
            UserName="Анонимно"
        }
		var messageData = {
			author: UserName,
			id:id,
			messageText: msg,
			dateTime: Time
		};
		 ajaxReq("/SendMeassgesSpb/", messageData, function(){})
	}
}

function SPBGetMeassges(callback) {
	var first=true;
    var prevmsgroom;
	roomMessageInterval = setInterval(function(){
		$.ajax({
        url: "/SPBGetMeassges/",
        type: 'POST',
        contentType:'application/json',
        dataType:'json'
    }).done( function(SPBMessages){
			if (JSON.stringify(prevmsgroom)!==JSON.stringify(SPBMessages)) {
				prevmsgroom = SPBMessages;

				if (callback)
					callback(SPBMessages)

					first=false;
					var objDiv = document.getElementById("divMessages");
					objDiv.scrollTop = objDiv.scrollHeight;

	}
		})
   }, 1000);
}

function GetAD(callback){
    var prevADs;
		$.ajax({
        url: "/getADList/",
        type: 'POST',
        contentType:'application/json',
        dataType:'json'
    }).done( function(Ads){
			if (JSON.stringify(prevADs)!==JSON.stringify(Ads)) {
				prevADs = Ads;
				if (callback) 
					callback(Ads)
					/* var objDiv = document.getElementById("divMessages");
					objDiv.scrollTop = objDiv.scrollHeight; */
				
	}
		})
}


function ADALERT(){
	alert("Пожалуйста, заполните все поля");
}
function CreateAD(AD){
	var Time=curDateandTime();
	AD.Time=Time;
	 ajaxReq("/SendAdtoList/", AD, function(){})
}
function stopInterval(){
	clearInterval(roomMessageInterval);
}
function SendMeassgesMSC(msg){

	if (msg.trim() !=''){
		
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		var Time=hours + ":" + minutes;
		var messageData = {
			author: UserName,
			id:id,
			messageText: msg,
			dateTime: Time
		};
		 ajaxReq("/SendMeassgesMSC/", messageData, function(){})
	}
}
function MSCGetMeassges(callback) {
	var first=true;
    var prevmsgroom;
	roomMessageInterval = setInterval(function(){  
		$.ajax({
        url: "/MSCGetMeassges/",
        type: 'POST',
        contentType:'application/json',
        dataType:'json'
    }).done( function(MSCMessages){
			if (JSON.stringify(prevmsgroom)!==JSON.stringify(MSCMessages)) {
				prevmsgroom = MSCMessages;
				
				if (callback) 
					callback(MSCMessages)
				
					first=false;
					var objDiv = document.getElementById("divMessages");
					objDiv.scrollTop = objDiv.scrollHeight;
				
	}
		})
   }, 1000);
}

function curDateDisp() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

        return day + "." + month + "." +  year;

}
function curDate(value) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    if (value) {
        year -= value
        return year + "-" + month + "-" + day;

    } else
        return year + "-" + month + "-" + day;

}

function CalculateDate(value) {
    var year = value.getFullYear();
    var month = value.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = value.getDate();
    day = (day < 10 ? "0" : "") + day;
        return year + "-" + month + "-" +  day;

}

function curDateandTime() {
    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var Minutes =date.getMinutes();
    var Seconds = date.getSeconds();
    Minutes = (Minutes < 10 ? "0" : "") + Minutes;
    Seconds = (Seconds < 10 ? "0" : "") + Seconds;
        return year + "-" + month + "-" +  day+ " " + hour+":"+Minutes+":"+Seconds;

}

function plural(n,str1,str2,str5){return n + ' ' + ((((n%10)==1)&&((n%100)!=11))?(str1):(((((n%10)>=2)&&((n%10)<=4))&&(((n%100)<10)||((n%100)>=20)))?(str2):(str5)))}


function scrollint(){
    var trueDivHeight = $('#MessagesContent')[0].scrollHeight;
    var divHeight = $('#MessagesContent').height();
    var scrollLeft = trueDivHeight - divHeight;

    document.getElementById('MessagesContent').scrollTop = scrollLeft;
}
function scrollint1(){
    var trueDivHeight = $('#DisplayMessages')[0].scrollHeight;
    var divHeight = $('#DisplayMessages').height();
    var scrollLeft = trueDivHeight - divHeight;
    document.getElementById('DisplayMessages').scrollTop = scrollLeft;
}
function texttodate(text){
    console.log(text)
    var date = new Date(text);
    console.log(date)
    return date
}
;




