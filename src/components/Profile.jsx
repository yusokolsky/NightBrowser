import React from 'react'
import { Link } from 'react-router';
import Messages from './Messages.jsx'
import FriendsList from './FriendsList.jsx'
import EventTab from './EventTab.jsx'
import  style from './css/UserProfile.css';
const initialState = {
    EventsTab:true,
    FriendsTab:false,
    MessagesTab:false,
    DisplayProfileEditButton:false,
    DisplayMessageTab:false,
    NotAuth:false,
    Display2ButtonsForMenu:true,
    DisplayButtons:false,
    SendFriendRequest:true,
    FirstTabClaas:"one",
    SecondTabClass:"two",
    ATabsClass:"tabsssa1",
    hrTabsClass:"tabshr1",
    UserData:{},
    Age:'',
    Desc:false,
    IncomingInvites:0,
    IncomingMessages:0,
    ShowMessages:false,
    Loading:true
};

const queryString = require('query-string');
var setQuery = require('set-query-string');
export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = initialState;
        this.SendFriendRequest = this.SendFriendRequest.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.DisplayMessageTabfunc = this.DisplayMessageTabfunc.bind(this);
        this.SobitiyaTabEnable = this.SobitiyaTabEnable.bind(this);
        this.FriendsTabEnable = this.FriendsTabEnable.bind(this);
        this.MessagesTabEnable = this.MessagesTabEnable.bind(this);
        this.openDesc = this.openDesc.bind(this);
        this.OpenMessages = this.OpenMessages.bind(this);


    }

        //TODO: fix perehodi
    componentWillUpdate(){


    }
    componentWillReceiveProps(nextProps) {

        this.setState(initialState);
        this.setState({
            UserData: nextProps.UserData
        }, () => {
            var messagesreq = 0;
            ajaxReq("/GetUserUnreadedMessages/", {
                UsrId: this.state.UserData.NBID,
                UsrPass: getCookieMd5Pass()
            }, function (unMess) {
                messagesreq = unMess;
                this.setState({IncomingMessages: messagesreq});
            }.bind(this));

            var fiendsreq = 0;
            if (this.props.UserData.FriendList)
                for (var i = 0; i < this.props.UserData.FriendList.length; i++) {
                    if (this.props.UserData.FriendList[i].Status == 1) {
                        fiendsreq++;
                    }
                }

            checkCookie(this.DisplayMessageTabfunc);
            var dt = new Date(curDate() + "Z");
            var dt1 = new Date(this.props.UserData.DateofBirthday + "Z");
            this.setState({
                Age: plural(Math.trunc(((dt - dt1) / (1000 * 3600 * 24)) / 365), 'год', 'года', 'лет'),
                IncomingInvites: fiendsreq
            });

        });
    }

    componentWillMount(){
        this.setState({
            UserData: this.props.UserData
        }, () => {
            var messagesreq=0;
            ajaxReq("/GetUserUnreadedMessages/", {UsrId:this.state.UserData.NBID ,UsrPass:getCookieMd5Pass()}, function(unMess){
                messagesreq=unMess;
                this.setState({IncomingMessages:messagesreq});
            }.bind(this));

            var fiendsreq=0;
            if(this.props.UserData.FriendList)
                for (var i=0;i<this.props.UserData.FriendList.length;i++){
                    if (this.props.UserData.FriendList[i].Status==1){
                        fiendsreq++;
                    }
                }

            checkCookie(this.DisplayMessageTabfunc);
            var dt = new Date(curDate() + "Z");
            var dt1 = new Date(this.props.UserData.DateofBirthday + "Z");
            this.setState({Age:plural(Math.trunc(((dt-dt1)/ (1000 * 3600 * 24))/365), 'год', 'года', 'лет'),IncomingInvites:fiendsreq});

        });

    }
    DisplayMessageTabfunc(cookies){
        if(cookies.NBID==this.state.UserData.NBID){
            this.setState({DisplayMessageTab: true, DisplayProfileEditButton: true,SendFriendRequest: false,Display2ButtonsForMenu:false});

        }else{
            this.setState({Display2ButtonsForMenu:true});

            if(cookies!="") {
                this.setState({DisplayButtons:true});
                if(cookies.FriendList)
                    for(let i=0;i<cookies.FriendList.length;i++){
                        if(cookies.FriendList[i].FriendNBID==this.props.UserData.NBID){
                            this.setState({SendFriendRequest: false});
                        }
                    }
            }
        }
        if(cookies==""){
            this.setState({NotAuth: true,SendFriendRequest: false});
        }
        if(this.state.Display2ButtonsForMenu){
            this.setState({FirstTabClaas: "one2",SecondTabClass:"two2",ATabsClass:"tabsssa2",hrTabsClass:"tabshr2"});
        }
        else{
            this.setState({FirstTabClaas: "one",SecondTabClass:"two"});
        }
        this.setState({Loading:false});
        const parsed = queryString.parse(location.search);
            switch(parsed.l) {
                case "Messages": if(!this.state.Display2ButtonsForMenu)this.MessagesTabEnable(); break;
                case "Friends":  this.FriendsTabEnable(); break;
                case "Events":   this.SobitiyaTabEnable(); break;
                default:break;
            }
    }
    componentDidMount() {


    }

    SendFriendRequest(){

        SendFriendRequest(this.state.UserData.NBID)
        this.setState({SendFriendRequest: false});
    }
    SobitiyaTabEnable(){
        setQuery({l: 'Events'})
        this.setState({EventsTab: true,FriendsTab: false,MessagesTab:false});
        if  (this.state.Display2ButtonsForMenu){
            this.setState({hrTabsClass:"tabshr2 onehr2"});
        } else {
            this.setState({hrTabsClass:"tabshr1 onehr"});
        }
    }
    FriendsTabEnable(){
        setQuery({l: 'Friends'})
        this.setState({EventsTab: false,FriendsTab: true,MessagesTab:false});
        if  (this.state.Display2ButtonsForMenu){
            this.setState({hrTabsClass:"tabshr2 twohr2"});
        } else {
            this.setState({hrTabsClass:"tabshr1 twohr"});
        }
    }
    MessagesTabEnable(){
        setQuery({l: 'Messages'})
        this.setState({EventsTab: false,FriendsTab: false,MessagesTab:true});
        this.setState({hrTabsClass:"tabshr1 threehr"});
    }
    openDesc(){
        this.setState({Desc:!this.state.Desc})
    }
    OpenMessages(){
        this.setState({ShowMessages:!this.state.ShowMessages});

    }

    render() {
        {

            if (this.state.UserData.UsrPhotoBig){
                var divStyle = {
                    backgroundImage: 'url(' + this.state.UserData.UsrPhotoBig + ')'
                }}else{
                var divStyle = {
                    backgroundImage: 'url(/images/LogoProfile.jpg)'
                }
            }

            if (this.state.Loading){
               return( <div className="content contentProfile"><div className="topprofile heightProfZ"></div></div>);
            }else{
            return (<div className="content contentProfile">
                    <div className="topprofile" style={this.state.UserData.VIPSTYLE}>
                        <div className="profileleftContent">
                            <p className="DisplayUserCity"> {this.state.UserData.UsrCity && <span><i className="far fa-dot-circle" aria-hidden="true"/> {this.state.UserData.UsrCity} </span>}</p>
                            {(this.state.UserData.UsrDesc && !this.state.Desc)  && <div className="aboutbtn" onClick={this.openDesc}> О себе <i className="fa fa-angle-down ButtonMod" aria-hidden="true" /></div>}
                            {(this.state.UserData.UsrDesc && this.state.Desc)  && <div className="aboutbtn" onClick={this.openDesc}>О себе <i className="fa fa-angle-up ButtonMod" aria-hidden="true" /></div>}
                            {this.state.Desc && <div className="usrdesc">{this.state.UserData.UsrDesc}</div>}
                            {this.state.DisplayProfileEditButton  && <Link to={`/User/${this.state.UserData.NBID}/edit`} className="EditProfileButton" >  <i className="fas fa-sliders-h ButtonModEdit" data-fa-transform="shrink-4 rotate-90" /> Редактировать профиль</Link>}
                        </div>

                        <div className="profiletoptext">
                            <p className="DisplayUserName">{this.state.UserData.UsrFirstName || <span>Имя не указано</span>} {this.state.UserData.UsrLastName} , {this.state.UserData.DateofBirthday && <span>{this.state.Age}</span>} </p>
                            <div className="DisplayUserPhoto">
                                <div className="DisplayUserPhotoFix " style={divStyle}><img  src={this.state.UserData.UsrPhotoBig} alt={this.state.UserData.UsrFirstName}/></div>
                                <div className="ProfileAuthorizitedInProfileAvatarBlockLevel">
                                    {this.state.UserData.Level}
                                </div>
                                <div className="ProfileAuthorizitedInProfileAvatarBlockLevelLabel">
                                    Уровень
                                </div>
                            </div>
                            <div className="regestrationDate">Зарегестрирован | {this.state.UserData.DateOfReg}</div>




                        </div>
                        <div className="profileRightContent">
                            {this.state.SendFriendRequest  &&
                                <div className="addFriendButtoN" onClick={this.SendFriendRequest}>
                                   <i className="fa fa-plus fa-border AddFriendICon" /> <div>Добавить в друзья</div>
                                 </div>}

                        </div>
                    </div>
                    <div className="bottomprofile" >
                        <div className="tabs">
                            <ul>
                                <li className={this.state.FirstTabClaas} onClick={this.SobitiyaTabEnable}><a className={this.state.ATabsClass}>События </a></li>
                                <li className={this.state.SecondTabClass} onClick={this.FriendsTabEnable}><a className={this.state.ATabsClass}>Друзья {(this.state.IncomingInvites!==0 && this.state.DisplayProfileEditButton) && <div className="IconOfMissingAlerts">{this.state.IncomingInvites}</div>}</a></li>
                                {this.state.DisplayMessageTab  &&
                                <li className="three" onClick={this.MessagesTabEnable}><a className={this.state.ATabsClass}>Сообщения{(this.state.IncomingMessages!==0 && this.state.DisplayProfileEditButton) && <div className="IconOfMissingAlerts">{this.state.IncomingMessages}</div>}</a></li>
                                }
                                <hr id="menuUnderline" className={this.state.hrTabsClass}/>
                            </ul>
                        </div>
                       {this.state.EventsTab &&
                        <div className="OnService"><i className="fas fa-wrench"/>Раздел в разработке
                           {/* <EventTab UserData={this.state.UserData} />*/}


                        </div>

                        }
                        {this.state.FriendsTab &&
                        <div className="Friendsblock">

                            {this.state.UserData.FriendList && <FriendsList UserData={this.state.UserData} DisplayMessageTab={this.state.DisplayMessageTab}/>}
                            {!this.state.UserData.FriendList && <div className="OnService"><i className="fas fa-smile"/> Здесь будут ваши друзья</div>}
                        </div>
                        }
                        {this.state.MessagesTab &&<Messages DisplayType="OnPage"/>}


                    </div>


                </div>


            );}


        }
    }
};



