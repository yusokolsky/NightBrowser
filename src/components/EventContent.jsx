import React from 'react'

import styles from './css/EventContent.css';
import { Link } from 'react-router';
export default class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            UserData:{},
            EventData:{},
            EventPlace:"",
            PeoplesData:[],
            ShowInfo:true,
            Zayavka:false,
            FindResults:[],
            Going:false,
            NotAuth:true,
            EventEnded:false,
            CreatorOfEvent:false,
            showchatmodule:false,
            Searchvalue:""
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.Map = this.Map.bind(this);
        this.OpenListPeoples = this.OpenListPeoples.bind(this);
        this.openchat = this.openchat.bind(this);
        this.SendRequestToEvent = this.SendRequestToEvent.bind(this);
        this.SendDeclRequestToEvent = this.SendDeclRequestToEvent.bind(this);
        this.IsAuth = this.IsAuth.bind(this);
        this.CloseListPeoples = this.CloseListPeoples.bind(this);
        this.DeleteFriend = this.DeleteFriend.bind(this);
        this.AcceptFriend = this.AcceptFriend.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount(){


        this.setState({EventData: this.props.EventData});
        let arrayvar = this.state.PeoplesData.slice()
        let lenghtfrd = this.props.EventData.Peoples.length;
        let EventDataHere = this.props.EventData;


        for (let i = 0; i < lenghtfrd; i++)
            $.when($.ajax({
                url: "/GetUser/",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({id: EventDataHere.Peoples[i].NBID}),
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                data.Status = EventDataHere.Peoples[i].Status;
                arrayvar.push(data)
                if (lenghtfrd == arrayvar.length) {
                    this.setState({PeoplesData: arrayvar})
                }

            }.bind(this));
        checkCookieforEvent(this.IsAuth);
        if((this.props.EventData.SoloDate && (texttodate(this.props.EventData.SoloDate)<texttodate(curDate()))) ||(this.props.EventData.CoupleDateEnd && (texttodate(this.props.EventData.CoupleDateEnd)<texttodate(curDate())))){
            this.setState({Zayavka: false,NotAuth: false,Going:false,EventEnded:true});
        }

    }
    IsAuth(cookies){
        if(cookies!=""){

            if(cookies.NBID==parseInt(this.state.EventData.CreatorId)){
                this.setState({CreatorOfEvent: true});
            }
            this.setState({NotAuth: false, UserData:cookies});
            if(cookies.UserEvents)
                for (let i=0;i<cookies.UserEvents.length;i++){

                    if (cookies.UserEvents[i].EventID==this.props.EventData.EventId){
                        if (cookies.UserEvents[i].Status=="1"){
                            if (!this.state.EventEnded)
                            this.setState({Going: true});

                        }
                        if (cookies.UserEvents[i].Status=="2"){
                            this.setState({Zayavka: true});
                        }
                    }
                }
            if (!this.state.Going && !this.state.Zayavka && !this.state.EventEnded){
                    this.setState({NotAuth: true});
            }
        }else{

            this.setState({NotAuth: false});

        }
    }
    OpenListPeoples(){
        this.setState({ShowInfo: false});
    }
    CloseListPeoples(){
        this.setState({ShowInfo: true});
    }
    openchat(){
        this.setState({showchatmodule: true});
        $(function(){
            $('#modalResizable')
                .draggable()
                .resizable();
        })
    }
    SendRequestToEvent(){
        let requstToEvent={
                EventId:this.state.EventData.EventId,
                UserId:this.state.UserData.NBID
        }
        ajaxReq("/SendRequestToEvent/", {requstToEvent}, function(){

        });
        this.setState({Zayavka: true,NotAuth: false});
    }
    SendDeclRequestToEvent(){
        let requstToEvent={
            EventId:this.state.EventData.EventId,
            UserId:this.state.UserData.NBID
        }
        ajaxReq("/SendDeclRequestToEvent/", {requstToEvent}, function(result){

        });
        this.setState({Zayavka: false,NotAuth: true,Going:false});
    }
    AcceptFriend(key){
        let requstToEvent={
            EventId:this.state.EventData.EventId,
            UserId:key.NBID
        }
        let TempFDBIG=[];
        let tempFD={};
        ajaxReq("/AcceptToEvent/", {requstToEvent}, function(result){

        });
        for(var i=0;i<this.state.PeoplesData.length;i++){
            tempFD=this.state.PeoplesData[i]
            if(this.state.PeoplesData[i].NBID==key.NBID){
                tempFD.Status="1";
                TempFDBIG.push(tempFD)
            }else{
                TempFDBIG.push(tempFD)
            }
        }
        this.setState({PeoplesData: TempFDBIG})
    }
    DeleteFriend(key){
        let requstToEvent={
            EventId:this.state.EventData.EventId,
            UserId:key.NBID
        }
        let TempFDBIG=[];
        let tempFD={};
        ajaxReq("/DeclineToEvent/", {requstToEvent}, function(result){

        });
        for(var i=0;i<this.state.PeoplesData.length;i++){
            tempFD=this.state.PeoplesData[i]
            if(this.state.PeoplesData[i].NBID==key.NBID){
                tempFD.Status="0";
                TempFDBIG.push(tempFD)
            }else{
                TempFDBIG.push(tempFD)
            }
        }
        this.setState({PeoplesData: TempFDBIG})
    }
    handleChange(event){
        this.setState({Searchvalue: event.target.value});

        if (event.target.value != '') {
            let Search=event.target.value.split(/\s* \s*/);
            let FirstWord=Search[0];
            let SecondWord=Search[1];
            let find=[];
            if(!SecondWord){
                for( let i = 0; i < this.state.PeoplesData.length; i++ )
                    if (this.state.PeoplesData[i].UsrFirstName.toLowerCase().indexOf(FirstWord.toLowerCase()) >= 0 || this.state.PeoplesData[i].UsrLastName.toLowerCase().indexOf(FirstWord.toLowerCase()) >= 0)
                        find.push(this.state.PeoplesData[i])


            }else{
                for( let i = 0; i < this.state.PeoplesData.length; i++ )
                    if( this.state.PeoplesData[i].UsrFirstName.toLowerCase().indexOf( FirstWord.toLowerCase()) >= 0 || this.state.PeoplesData[i].UsrLastName.toLowerCase().indexOf( SecondWord.toLowerCase()) >= 0  )
                        find.push(this.state.PeoplesData[i])
            }
            if (find.length>0){
                this.setState({FindResults: find});
            }
        }else{
            this.setState({FindResults: []});
        }
    }
    componentDidMount() {
        ymaps.ready(this.Map);
    }
    Map(){
        let myMap;
        let coords =this.state.EventData.Location.split(',')

        myMap = new ymaps.Map("map", {
            center: coords,
            zoom: 15
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });
        var names = [];
        ymaps.geocode(coords).then(function (res) {

            // Переберём все найденные результаты и
            // запишем имена найденный объектов в массив names.
            res.geoObjects.each(function (obj) {
                names.push(obj.properties.get('name'));
            });
            this.setState({EventPlace: names[0]})
            myMap.balloon.open(coords, {
                contentHeader: names[0],
                contentBody:
                '<p>Здесь будет событие</p>'
            })

            // Добавим на карту метку в точку, по координатам
            // которой запрашивали обратное геокодирование.

        }.bind(this));
    }
    render(){
        let countGoing=0;
        let PeoplesGoind = this.state.PeoplesData.map(function(People) {
            if (!People.UsrPhotoBig){
                People.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + People.UsrPhotoBig + ')'

            }
            if (People.Status == 1 ) {
                countGoing++;
                if(this.state.ShowInfo){
                if(  countGoing<6){
                return (<div className="memberblock" key={People.NBID} style={divStyle}>

                        {/*<img className="imgFriendBlock" src={Friend.UsrPhotoBig} />*/}
                        <div className="friendtop">

                        </div>
                        <Link to={`/User/${People.NBID}`} >
                            <div className="friendbottom">
                                <p className="FriendBottomBlockUserNames">{People.UsrFirstName} {People.UsrLastName}</p>
                            </div>
                        </Link>
                    </div>
                )}}else{

                    return (<div className="memberblock" key={People.NBID} style={divStyle}>

                        {/*<img className="imgFriendBlock" src={Friend.UsrPhotoBig} />*/}
                        <div className="friendtop">

                        </div>
                        <Link to={`/User/${People.NBID}`} >
                            <div className="friendbottom">
                                <p className="FriendBottomBlockUserNames">{People.UsrFirstName} {People.UsrLastName}</p>
                            </div>
                        </Link>
                    </div>)
                }
            }
        }.bind(this));

        let IncomingInvites = this.state.PeoplesData.map(function(People) {
            if (!People.UsrPhotoBig){
                People.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + People.UsrPhotoBig + ')'

            }
            if (People.Status == 2 ) {
                        return (<div className="memberblock" key={People.NBID} style={divStyle}>

                                {/*<img className="imgFriendBlock" src={Friend.UsrPhotoBig} />*/}
                                <div className="friendtop">
                                        <i className="fa fa-plus fa-border"  onClick={() => this.AcceptFriend(People)}></i>
                                        <i className="fa fa-minus fa-border" onClick={() => this.DeleteFriend(People)}></i>
                                </div>
                                <Link to={`/User/${People.NBID}`} >
                                    <div className="friendbottom">
                                        <p className="FriendBottomBlockUserNames">{People.UsrFirstName} {People.UsrLastName}</p>
                                    </div>
                                </Link>
                            </div>

                        )}

            }.bind(this));
        let divstyle={display:'block'}
        let divstyle4;
        if(this.state.EventData.PhotoURL){
        divstyle4={
            backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.75),rgba(29, 44, 70, 0.75)), url("'+this.state.EventData.PhotoURL+'")'
        }}
        let divStyleForOgUrl = {
            backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)))'
        }
        if(this.state.EventData.ogData){
            let urltophoto
            if (this.state.EventData.ogData.ogImage.url[0]=='/'){
                urltophoto='http://'+this.state.EventData.URLtoEvent.replace( /(?:(?:https?|file|ftp)?:?\/\/([^\/\s]+)|([^\/]+\.(?:ru|com|net|org|biz|info|рф)))[^\s]*/ig, '$1$2')+this.state.EventData.ogData.ogImage.url
            }else{
                urltophoto=this.state.EventData.ogData.ogImage.url
            }
        divStyleForOgUrl = {
            backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' +urltophoto + ')'
        }}
        let divStyleUserPhotoBG={}
        if(this.state.PeoplesData[0]){

            if (!this.state.PeoplesData[0].UsrPhotoBig){
               let photo='../images/LogoProfile.jpg'
                 divStyleUserPhotoBG = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + photo + ')'

                }
            }
            else{
                let photo=this.state.PeoplesData[0].UsrPhotoBig
                 divStyleUserPhotoBG = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + photo + ')'

                }
            }
        }

        return (
            <div className="CreateEventContentBg" style={divstyle}>
                <div className="content ">
                <div className="HeadBlockEventContent">
                    <div className="MenuButtonBlockEventContent">
                    </div>
                    <div className="HeadInformationBlockEventContent"  style={divstyle4}>
                    <div className="EventPagecaptionandtime">
                        <p className="EventPageeventcaption">{this.state.EventData.Name}</p>
                        <p className="EventPagedatetime">{this.state.EventData.SoloDate} {this.state.EventData.CoupleTimeStart} {(this.state.EventData.CoupleDateEnd || this.state.EventData.CoupleTimeEnd) && <span>-</span>} {this.state.EventData.CoupleDateEnd} {this.state.EventData.CoupleTimeEnd}</p>
                    </div>
                        <div className="EventPageeventreq" name="submit">

                            {this.state.EventEnded && <div  className='EventPageRedLabel' >Событие закончилось</div>}
                            {this.state.NotAuth && <div  className='EventPageGreenLabel' onClick={this.SendRequestToEvent}>Присоедениться</div>}
                            {this.state.Zayavka && <div  className='EventPageOrangeLabel' onClick={this.SendDeclRequestToEvent}>Отменить Заявку</div>}
                            {this.state.Going && <div> <div  className='EventPageGreenLabel' ><i className="fas fa-bullhorn fa-lg" ></i> </div>
                                <div  className='EventPageRedLabel' onClick={this.SendDeclRequestToEvent}><i className="fa fa-ban fa-lg"/> </div></div>}

                        </div>
                    <div className="confines">
                        {this.state.EventData.AgeRange && <div>{this.state.EventData.AgeRange!=0 &&  <p className="agec"><span>{this.state.EventData.AgeRange.split(";")[0]}-{this.state.EventData.AgeRange.split(";")[1]} лет</span></p>}
                        </div>} <p className="gender">{this.state.EventData.Sex =="Мужской" && <i className="fa fa-mars" ></i>}
                            {this.state.EventData.Sex =="Женский" && <i className="fa fa-venus" ></i>}</p>
                        <p>

                        </p>
                    </div>
                    </div>
                </div>
                {this.state.ShowInfo &&
                <div className="eventbottom">
                    <div className="EventBLeftCol">
                        <div className="EventBLeftColAuthor">

                            {this.state.PeoplesData[0] &&
                            <div>
                                <p className="EventBLeftColAuthorLabel">Автор события</p>
                                <div className="divStyleUserPhotoBG" style={divStyleUserPhotoBG}></div>
                                <p className="EventBLeftColAuthorLabelName">{this.state.PeoplesData[0].UsrFirstName} {this.state.PeoplesData[0].UsrLastName}</p>
                                <Link to={`/User/${this.state.PeoplesData[0].NBID}`} >  <div className="EventBLeftColAuthorOpenButton">Профиль</div></Link>
                            </div>}
                        </div>
                        <div className="EventBLeftColListButton">
                        <p className="EventBLeftColListButtonLabel">Список участников: {this.state.PeoplesData.length}</p>
                            <i className="fas fa-list fa-border fa-lg EventBLeftColListButtonListIcon"></i>
                        </div>

                    </div>
                    <div className="EventBRightCol">
                        <div className="EventBRightColLastRed"><div className="EventBRightColLastReddroppgin"> 02.08.19</div><div className="EventBRightColLastRedTrig">Дата ласт рел</div></div>

                     <p className="eventdesc">

                         {this.state.EventData.Description}</p>

                    </div>

                </div>}
                {/*{!this.state.ShowInfo && <div className="memberspage">
                    <p className="memberscpage" onClick={this.OpenListPeoples}> {countGoing}
                        {this.state.EventData.PeopleCount!=0 && <span>/{this.state.EventData.PeopleCount}</span>} участников ({this.state.PeoplesData.length-countGoing} заявок)</p>
                    <div className="memberspagetop">

                        <p className="backbutton" onClick={this.CloseListPeoples}><i className="fa fa-angle-left fa-2x" aria-hidden="true"></i><span> </span><span>  назад</span></p>
                        <div className="SearchInputmembers" >
                            <input type="text" value={this.state.Searchvalue}  onChange={this.handleChange} />
                            <i className="fa fa-search cursorPointer" ></i>
                        </div>
                    </div>

                    <div className="friends">

                        <div className="FriendArea" >
                            {this.state.FindResults!=0 && <SearchResult Results={this.state.FindResults}/>}
                            {this.state.FindResults.length==0 && <div className="dispFlex">{PeoplesGoind}</div>}
                        </div>

                        {this.state.CreatorOfEvent && <div className="FriendIncomingArea">
                            {IncomingInvites &&  <div className="friendrequestscaption"> Заявки
                            {IncomingInvites}</div>}
                        </div>}

                    </div>

                </div>}*/}
                    {this.state.showchatmodule &&  <div id="modalResizable"><div className="closesms">X</div></div>}
                <div className="eventbottom">
                    <p className="geocaption"><i className="fa fa-map-o" aria-hidden="true"></i> {this.state.EventPlace}</p>
                    <div className="mapFormBOss">
                        <div id="map" ></div>
                    </div>
                </div>
                </div>

            </div>

        );
    }
};

export class SearchResult extends React.Component{
    render() {
        let FindResultsComponents = this.props.Results.map(function(UserFind) {
            if (!UserFind.UsrPhotoBig){
                UserFind.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + UserFind.UsrPhotoBig + ')'

            }
            if (UserFind.Status == 1 ) {
                        return (<div className="memberblock" key={UserFind.NBID} style={divStyle}>
                                <div className="friendtop">

                                </div>
                                <Link to={`/User/${UserFind.NBID}`} >
                                    <div className="friendbottom">
                                        <p className="FriendBottomBlockUserNames">{UserFind.UsrFirstName} {UserFind.UsrLastName}</p>
                                    </div>
                                </Link>
                            </div>
                        )}

        });
        return <div>{FindResultsComponents}</div>;

    }

};