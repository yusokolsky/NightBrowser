import React from 'react'
import  style from './css/Messages.css';
import io from "socket.io-client";
const Loading = () => <div className="loadingState">        <div className="sk-folding-cube" >
    <div className="sk-cube1 sk-cube"></div>
    <div className="sk-cube2 sk-cube"></div>
    <div className="sk-cube4 sk-cube"></div>
    <div className="sk-cube3 sk-cube"></div>
</div>
    <div className="loadinglabel">Загружаю...</div></div>;

export default class Messages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            ShowSearch:false,
            ShowDialogs:false,
            MessageValue:"",
            Searchvalue: '',
            FindResults:[],
            FriendList:[],
            LastMessages:[],
            UserDialogGoal:{},
            UserData: {},
            updatemessage:false,
            currentDialog:"",
            messages:[],
            LoadItems:15,
            EvrethingIsLoaded:false
        }
        this.loaddata = this.loaddata.bind(this);
        this.ShowSearch = this.ShowSearch.bind(this);
        this.CloseSearch = this.CloseSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.DisplayFindResults = this.DisplayFindResults.bind(this);
        this.OpenDialog = this.OpenDialog.bind(this);
        this.UncheckUnread = this.UncheckUnread.bind(this);

        this.ConnectToRoom = this.ConnectToRoom.bind(this);
        this.Keypress1 = this.Keypress1.bind(this);
        this.openDialogByID = this.openDialogByID.bind(this);

        this.GetMessages = this.GetMessages.bind(this);
    }

    componentWillMount() {
        checkCookie(this.loaddata);
    }

    loaddata(getUserData) {
        let arrayvar = this.state.FindResults.slice()
        if(getUserData.FriendList)
        for (let i =0;i<getUserData.FriendList.length;i++)
            $.when( $.ajax({
                url: "/GetUser/",
                type: 'POST',
                contentType:'application/json',
                data: JSON.stringify({id: getUserData.FriendList[i].FriendNBID}),
                dataType:'json'
            }) ).then(function( data, textStatus, jqXHR ) {
                arrayvar.push(data)
                if (getUserData.FriendList.length == arrayvar.length) {
                    this.setState({FriendList: arrayvar})
                    this.setState({FindResults: this.state.FriendList})
                }

            }.bind(this));
        this.setState({UserData: getUserData});
        this.setState({Loading: false});
        this.socket = io('https://nightbrobeta.herokuapp.com:80');
        this.socket.emit('UsrNotice',  {'UsrId':this.state.UserData.NBID ,"UsrPass":getCookieMd5Pass()});
        this.socket.on('UserMessagesUpdate', function(Messages){
            if (Messages) {

                Messages.sort(function(a,b){

                    return moment.utc(b.LastMessage).diff(moment.utc(a.LastMessage))
                }.bind(this));

                this.setState({LastMessages: Messages});
            }
        }.bind(this));
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    ShowSearch(){
        this.setState({ShowSearch: true});
    }
    CloseSearch(){
        this.setState({ShowSearch: false});
    }
    handleChange(event) {
        this.setState({Searchvalue: event.target.value,ShowSearch: true});
        if (event.target.value!=''){
            let Search=event.target.value.split(/\s* \s*/);
            ajaxReq("/FindUsers/", {FirstWord:Search[0],SecondWord:Search[1]}, function(usersFindResult){
                    this.DisplayFindResults(usersFindResult)
            }.bind(this));

    }else{
            this.setState({FindResults: this.state.FriendList})
        }
    }
    DisplayFindResults(Results){
        this.setState({FindResults: Results});
    }
    GetMessages(){

        $.when( $.ajax({
            url: "/getPrivateMessages/",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify({currentDialog:this.state.currentDialog,Items:this.state.LoadItems,CountOfLoad:15,UsrId:this.state.UserData.NBID ,UsrPass:getCookieMd5Pass()}),
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {

            if (data!=="End") {
                this.setState({messages: this.state.messages.reverse()});
                this.setState({messages: this.state.messages.concat(data)});
                this.setState({LoadItems: this.state.LoadItems + 15})
                this.setState({messages: this.state.messages.reverse()});
            }else{
                this.setState({EvrethingIsLoaded: true})
            }
            if (this.state.LoadItems==30){

                this.refs.MessagesContent.scrollImidiatly()
            }
            if (data.length<15){
                this.setState({EvrethingIsLoaded: true})
            }

        }.bind(this));
    }

    ConnectToRoom(){
        this.socket = io('https://nightbrobeta.herokuapp.com:80');
        this.socket.on('connect', function() {
            // Connected, let's sign-up for to receive messages for this room
            if(this.state.UserData.NBID<this.state.UserDialogGoal.NBID) {
                this.setState({                        currentDialog: 'PrivateRoom' + this.state.UserData.NBID + "a" + this.state.UserDialogGoal.NBID                    })
                this.socket.emit('room', 'PrivateRoom' + this.state.UserData.NBID + "a" + this.state.UserDialogGoal.NBID);
            }else{
                this.setState({                        currentDialog: 'PrivateRoom' + this.state.UserDialogGoal.NBID + "a" + this.state.UserData.NBID                 })
                this.socket.emit('room', 'PrivateRoom' + this.state.UserDialogGoal.NBID + "a" + this.state.UserData.NBID);
            }



            this.refs.MessagesContent.scrollToDown()
            this.socket.emit('UnTagReadedSMS', {'Author':this.state.UserData.NBID ,"DialogGoal":this.state.UserDialogGoal.NBID});

            this.GetMessages();
        }.bind(this));

        this.socket.on('RECEIVE_MESSAGEPrivate', function(data){
            addMessage(data);
            this.refs.MessagesContent.scrollToDown()
        }.bind(this));
        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };
        this.sendMessage = ev => {
            ev.preventDefault();
            if(this.state.Message!=="")
                this.socket.emit('SEND_MESSAGEprivate', {
                    Author: this.state.UserData.NBID,
                    Message: this.state.MessageValue,
                    roomId:this.state.currentDialog,
                    DialogGoal:this.state.UserDialogGoal.NBID
                })
            this.setState({MessageValue: ''});
            this.state.LastMessages.map(function(Mess) {

                if (Mess.UsrID==this.state.UserDialogGoal.NBID){
                    Mess.LastMessage=curDateandTime()

                }
        }.bind(this));
        }


    }
    OpenDialog(UserDialog) {

        if (UserDialog.NBID != this.state.UserDialogGoal.NBID){

            this.setState({
                ShowSearch: false, UserDialogGoal: UserDialog, ShowDialogs: true, updatemessage: true
            }, () => {
                this.UncheckUnread(this.state.UserDialogGoal.NBID);
                this.setState({LoadItems: 15, messages: []})
                this.ConnectToRoom();
            });
    }
    }
    UncheckUnread(Id){
        console.log("go");
        console.log(Id);
        this.state.LastMessages.map(function(UserS) {
            console.log(UserS);
            if(UserS.UsrID==Id){
                console.log("Changed");
                UserS.Unread=0;
            }});
    }
    openDialogByID(openDialogByID){

        if(openDialogByID.UsrID!=this.state.UserDialogGoal.NBID)
        ajaxReq("/GetUser/", {id:openDialogByID.UsrID}, function(userData){

            this.setState({
                ShowSearch: false,UserDialogGoal: userData,ShowDialogs:true,updatemessage: true,

            }, () => {

                this.setState({LoadItems:15,messages:[],
                    MessageValue:"",
                    Searchvalue: '',
                    FindResults:[],
                    currentDialog:"",
                    EvrethingIsLoaded:false
                })
                this.UncheckUnread(this.state.UserDialogGoal.NBID);
               this.ConnectToRoom();
            });


    }.bind(this));
    }
    componentDidUpdate(){

    }
    Keypress1(event){
        if(event.keyCode == 13){
            this.sendMessage(event);
            if(event.preventDefault) event.preventDefault(); // This should fix it
            return false; // Just a workaround for old browsers
        }

    }


    render() {
        if (!this.state.UserDialogGoal.UsrPhotoBig){
            this.state.UserDialogGoal.UsrPhotoBig='../images/LogoProfile.jpg'

        }
        let divStyle = {
            backgroundImage: 'url(' + this.state.UserDialogGoal.UsrPhotoBig + ')'

        }


        if (this.state.Loading == true) {
            return <Loading />
        }
        else {
            if(this.props.DisplayType=="OnPage"){
            return (<div className="Messagesblock">
                <div className="MessagesLeftSideBlock">         {/*ЛЕВАЯ ЧАСТЬ СООБЩЕНИЙ*/}
                    <div className="MessagesSearchBlock">           {/*БЛОК С ПОИСКОМ*/}
                        <div className="SearchInput" >
                            <input type="text" value={this.state.Searchvalue} onChange={this.handleChange} className="SearchInputInChats WFixMes"/>
                            {!this.state.ShowSearch &&  <div className="SearchPoint ColorFixMes"  onClick={this.ShowSearch}><i className="fa fa-search poisk  " aria-hidden="true"/></div> }
                            {this.state.ShowSearch &&  <div className="SearchPoint ColorFixMes1"  onClick={this.CloseSearch}><i className="fa fa-times poisk  timesFix" aria-hidden="true"/></div> }
                        </div>
                    </div>

                    {
                        this.state.ShowSearch && <div className="LastMessagesBlock">
                        <SearchResult Results={this.state.FindResults} openDialog={this.OpenDialog}/>
                    </div>
                    }
                    {!this.state.ShowSearch &&
                        <div className="LastMessagesBlock">{/*БЛОК С ПОСЛЕДНИМИ ДИАЛОГАИ*/}
                            <LastMessages LastMessages={this.state.LastMessages}
                                          openDialogByID={this.openDialogByID}/>{/*БЛОК С ПОСЛЕДНИМИ ДИАЛОГАМИ ИСКАТЬ ВНИЗУ ЕГО*/}
                        </div>
                    }
                </div>
                <div className="MessagesRightSideBlock">
                    {this.state.ShowDialogs &&
                    <div >{/*ПРАВАЯ ЧАСТЬ СООБЩЕНИЙ*/}
                        <a href={`/User/${this.state.UserDialogGoal.NBID}`} target="_blank"><div className="MessagesTopBar">{/*ВЕРХНЯЯ ЧАСТЬ ПРАВАОГО БЛОКА*/}
                        <div className="userpic searchresultuserpic" style={divStyle}/>
                            <p className="dialogcaption">{this.state.UserDialogGoal.UsrFirstName} {this.state.UserDialogGoal.UsrLastName}</p>
                        </div></a>
                        <div>{/*БЛОК С СООБЩЕНИЯМИ*/}

                            <MessagesContent ref="MessagesContent" EvrethingIsLoaded={this.state.EvrethingIsLoaded} GetMessages={this.GetMessages} UserDialogGoal={this.state.UserDialogGoal} messages={this.state.messages} UserData={this.state.UserData}/>{/*БЛОК С СООБЩЕНИЯМИ ИСКАТЬ ВНИЗУ*/}

                        </div>
                        <div className="MessageBottomBarSend">{/*БЛОК С ОТПРАВЛЕНИЕМ СООБЩЕНИЯ*/}
                            <textarea  id="Message"  placeholder="Введите сообщение..." value={this.state.MessageValue} onChange={ev => this.setState({MessageValue: ev.target.value})} onKeyDown={this.Keypress1}></textarea>
                            <div onClick={this.sendMessage} className="sendMessageButton"><i className="fab fa-avianex" ></i></div>
                        </div>
                    </div>
                        }
                    {!this.state.ShowDialogs && <div className="MessagesContentNoSelected"> Выберите Диалог </div>}
                </div>


            </div>)
            }
        }
    }
}
export class SearchResult extends React.Component{
    render() {
        let FindResultsComponents = this.props.Results.map(function(UserFind) {
            if (!UserFind.UsrPhotoBig){
                UserFind.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'url(' + UserFind.UsrPhotoBig + ')'

            }
            return (
                <div className="FindResultsUserBlock" key={UserFind.NBID} onClick={() => this.props.openDialog(UserFind)}><hr/>
                  <a href={`/User/${UserFind.NBID}`} target="_blank" className="userpic userpic_xs searchresultuserpic" style={divStyle}></a>
                    <div className='FindResultsUserName' >{UserFind.UsrFirstName} {UserFind.UsrLastName}</div>
                </div>
            );
        }.bind(this));
        return <div>{FindResultsComponents}</div>;

    }

};
const initalState={
    LastMessages: [],
    RenderMesse:[]
}
export class LastMessages extends React.Component{
    constructor(props) {
        super(props);
        this.state = initalState;
        this.CompilateMet=this.CompilateMet.bind(this);
    }
    componentWillMount(){
        this.CompilateMet(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.CompilateMet(nextProps);
    }
    CompilateMet(nextProps){
        console.log(nextProps.LastMessages);

        if(nextProps.LastMessages!==this.state.LastMessages) {
            this.setState(initalState);
            this.setState({
                LastMessages: nextProps.LastMessages
            }, () => {
                this.props.LastMessages.map(function (UserS) {

                    if (UserS.LastMessage) {

                        $.when($.ajax({
                            url: "/GetUser/",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({id: UserS.UsrID}),
                            dataType: 'json'
                        })).then(function (data, textStatus, jqXHR) {
                            UserS.UsrPhotoBig = data.UsrPhotoBig;
                            UserS.UsrFirstName = data.UsrFirstName;
                            UserS.UsrLastName = data.UsrLastName;
                            this.setState({RenderMesse: [...this.state.RenderMesse, UserS]});
                        }.bind(this));
                    }
                }.bind(this))
            });
        }
    }
    render() {

        let LastMessagesComponents = this.state.RenderMesse.map(function(UserS) {

            if (!UserS.UsrPhotoBig){
                UserS.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'url(' + UserS.UsrPhotoBig + ')'
            }
            let foo;
            if (UserS.Unread===1){
                foo='#504646';
            }else{
                foo='';
            }
            let divStyle1 = {
                backgroundColor: foo
            }

            let dt = new Date(Date.parse(UserS.LastMessage));
            let lastmessagedate;
            let monthl=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];

            if (CalculateDate(dt)==curDate()){
                let hour = dt.getHours();
                hour = (hour < 10 ? "0" : "") + hour;
                let Minutes =dt.getMinutes();
                Minutes = (Minutes < 10 ? "0" : "") + Minutes;
                lastmessagedate=hour+":"+Minutes;

            }else {
                let month = dt.getMonth();
                let day  = dt.getDate();
                lastmessagedate=day+" "+monthl[month];
                //console.log(lastmessagedate)
            }

            return (
                <div className="FindResultsUserBlock" style={divStyle1} key={Math.random()*100} onClick={() => this.props.openDialogByID(UserS)}>
                    {UserS.Unread!==1 && <a className="userpic userpic_xs searchresultuserpic"  style={divStyle} href={`/User/${UserS.UsrID}`} target="_blank"></a>}
                    {UserS.Unread===1 && <a className="userpic userpic_xs searchresultuserpic UnreadedMessageBox"  style={divStyle} href={`/User/${UserS.UsrID}`} target="_blank"></a>}

                    <p className='FindResultsUserName' >{UserS.UsrFirstName} {UserS.UsrLastName}</p>
                    <p className='FindResultsUserTime'> {lastmessagedate}</p>
                </div>);
        }.bind(this));
        return <div>{LastMessagesComponents}</div>;

    }

};
export class MessagesContent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            firstTime:true,
            NewMessage:false
        }
        this.scrollToDown = this.scrollToDown.bind(this);
        this.scrollImidiatly = this.scrollImidiatly.bind(this);
        this.Scroll = this.Scroll.bind(this);

    }
    componentDidUpdate(){


    }
    componentWillUnmount(){

    }
    componentDidMount(){

        this.setState({firstTime: true})
        this.scrollToDown();
        this.scrollImidiatly()

    }
    scrollToDown(){

        var el = this.refs.DisplayMessages;

        if(el.scrollHeight-850<el.scrollTop || this.state.firstTime){

            el.scrollTop = el.scrollHeight;

            setTimeout(function() {

                this.setState({firstTime: false})
            }.bind(this), 1000);
        }else{
            this.setState({NewMessage: true}
            )}
    }
    scrollImidiatly(){
        var el = this.refs.DisplayMessages;


        el.scrollTop = el.scrollHeight;
        this.setState({NewMessage: false})
    }
    Scroll(){
        var el = this.refs.DisplayMessages;

        if (el.scrollTop+800>el.scrollHeight){
            this.setState({NewMessage: false})
        }
    }
    render() {
        //console.log(this.props.messages)
        let i=0;
        let MessagesComponents = this.props.messages.map(function(messageData) {

            if (!messageData.Author.Photo){
                messageData.Author.Photo='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'url(' + messageData.Author.Photo + ')'

            }
            let MessageAuthor=messageData.Author.Name || messageData.Author.Fam

            var dt = new Date(messageData.Date);
            //console.log(moment(messageData.Date).locale('ru').format("DD MMM YYYY"));

            let lastmessagedate;
            let monthl=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];

            if (CalculateDate(dt)==curDate()){
                let hour = dt.getHours();
                hour = (hour < 10 ? "0" : "") + hour;
                let Minutes =dt.getMinutes();
                Minutes = (Minutes < 10 ? "0" : "") + Minutes;
                lastmessagedate=hour+":"+Minutes;
            }else {
                let month = dt.getMonth();
                let day  = dt.getDate();
                lastmessagedate=day+" "+monthl[month];
                //console.log(lastmessagedate)
            }
            return (
                <div className="PrivateChatMessageBlock" key={i++} >

                    <div className="userpic PhotoInContentMessages searchresultuserpic" style={divStyle} key={lastmessagedate + MessageAuthor}></div>
                    <div className="messagetext" key={lastmessagedate}>
                        <p className="authorname" key={MessageAuthor}>{MessageAuthor}</p>
                        <p className='PrivateChatMessage'  key={messageData.Message}>{messageData.Message}</p>
                    </div>
                    <p className='PrivateChatMessageTime'  key={messageData.Date} title={messageData.Date}>{lastmessagedate}</p>
                </div>);


        }.bind(this));





        return <div id="MessagesContent" className="MessagesContent" ref="DisplayMessages" onScroll={this.Scroll}>
            {!this.props.EvrethingIsLoaded && <div className="LoadMore LoadMoreFix" onClick={this.props.GetMessages}> Загрузить еще</div>}
            {MessagesComponents}
            {this.state.NewMessage && <div className="ScrollDown" onClick={this.scrollImidiatly}> Новые сообщения</div>}
            </div>;

    }

};