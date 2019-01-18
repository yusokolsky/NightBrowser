import React from 'react'
import { Link } from 'react-router';
export default class BarAndModules extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            HideALl:true
        };
        this.HideAll = this.HideAll.bind(this);

    }
    componentDidMount() {


    }

    HideAll() {
        this.setState({HideALl: !this.state.HideALl});

    }

    componentWillUnmount(){
       // clearInterval(Clock);
    }
    render(){
        return (<div>

                <div className="StatusBar">

                    <div className="StatusBarLeft">
                        <p>
                            Скрыть
                        </p>
                        <input type="checkbox" className="checkbox"  id="checkbox-2" onChange={this.HideAll}/>
                        <label htmlFor="checkbox-2"></label>
                    </div>
                    <div className="StatusBarCenter">

                        <div className="currentTime">
                            {curDateDisp()}
                        </div>
                    </div>
                   {/* <div className="StatusBarRight">
                        <p>Популярное</p>
                        <input type="checkbox" className="checkbox"  id="checkbox-1"/>
                        <label htmlFor="checkbox-1"></label>
                        <p1>Новое</p1>
                    </div>*/}
                </div>
                {this.state.HideALl &&
                <div className="chatandlist">
                    <div className="chat" id="Chat">
                        <Chat className="chat" id="Chat">
                        </Chat>
                    </div>

                    <div className="list" id="List">
                        <EventsBlockOnMainPage>
                        </EventsBlockOnMainPage>
                    </div>
                </div>
                }
            </div>

        );
    }
}

export class MessageList extends React.Component{
    render() {
        let i=0;
        let messageComponents = this.props.RoomMessages.map(function(message) {
            return (
                <div className="messageBig" key={i++}><hr />
                    <div className='messageR1' key={i++}>{message.dateTime}</div>
                    <div className='messageR2' key={i++}>{message.author} :</div>
                    <div className='messageR3' key={i++}>{message.messageText}</div>
                </div>);
        });
        return <div>{messageComponents}</div>;

    }

};


export class Chat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            BeforeJoin:true,
            SaintPRoom:false,
            Moscowroom:false,
            RoomMessages:[{
                author: '',
                messageText: '',
                dateTime: ''
            }],
            Message:''
        };
        this.OpenSaintPRoom = this.OpenSaintPRoom.bind(this);
        this.MessageReceived = this.MessageReceived.bind(this);
        this.OpenMoscowRoom = this.OpenMoscowRoom.bind(this);
        this.BacktoRooms = this.BacktoRooms.bind(this);
        this.SendMeassgesSpb = this.SendMeassgesSpb.bind(this);
        this.SendMeassgesMSC = this.SendMeassgesMSC.bind(this);
        this.ChangeMessage1 = this.ChangeMessage1.bind(this);
        this.ChangeMessage2 = this.ChangeMessage2.bind(this);
        this.Keypress1=this.Keypress1.bind(this);
        this.Keypress2=this.Keypress2.bind(this);
    }

    OpenSaintPRoom() {
        this.setState({ BeforeJoin:false,SaintPRoom:true});
        SPBGetMeassges(this.MessageReceived);
    }
    MessageReceived(messages) {
        this.setState({RoomMessages: messages});
    }
    OpenMoscowRoom() {
        this.setState({ BeforeJoin:false,Moscowroom:true});
        MSCGetMeassges(this.MessageReceived);
    }
    BacktoRooms() {
        stopInterval();
        this.setState({ BeforeJoin:true,Moscowroom:false,SaintPRoom:false,RoomMessages:[]});
    }
    SendMeassgesSpb() {
        SendMeassgesSpb(this.state.Message);
        document.getElementById("Message").value='';
        this.setState({Message:''});
    }
    SendMeassgesMSC() {
        SendMeassgesMSC(this.state.Message);
        document.getElementById("Message2").value='';
        this.setState({Message:''});
    }
    ChangeMessage1(){
        this.setState({Message:document.getElementById("Message").value});
    }
    ChangeMessage2(){
        this.setState({Message:document.getElementById("Message2").value});
    }

    Keypress1(event){
        if(event.keyCode == 13){
            this.SendMeassgesSpb();
        }
    }
    Keypress2(event){
        if(event.keyCode == 13){
            this.SendMeassgesMSC();
        }
    }
    render() {
        return (<div>
                {this.state.BeforeJoin &&<div>
                    <div className="chatlabel">
                        Онлайн | 890 человек
                    </div>
                    <div className="SaintProom"  onClick={this.OpenSaintPRoom}>
                        <img src="/images/SpbLogo.png" />
                    </div>
                    <hr className="hrlobby"/>
                    <div className="Moscowroom" onClick={this.OpenMoscowRoom}>
                        <img src="/images/MSCLogo.png" />
                    </div>
                    {/*<div className="chatlabel1">*на данный момент доступно только два лобби</div>*/}
                </div>}
                {this.state.SaintPRoom &&
                    <div className="room">
                        <div className="chatMenu">
                            <div className="leftbutton" onClick={this.BacktoRooms}>←</div>
                        </div>
                        <div className="chatlabel">
                            Паб
                            <hr color="#6dcff6"/>
                            <span>
			Санкт-Петербург
			</span>
                        </div>
                        <div className="RoomMessages" id="divMessages">
                            <MessageList RoomMessages={this.state.RoomMessages}/>
                        </div>
                        <div className="SendMessage">
                            <div className="SendingUser">
                                Я:
                            </div>
                            <textarea className="Message" id="Message"  placeholder="Введите сообщение...(максимум 150 символов)   " onChange={this.ChangeMessage1} onKeyDown={this.Keypress1}>

		</textarea>
                            <div className="SendButton" onClick={this.SendMeassgesSpb}>
                                Send
                            </div>
                        </div>
                    </div>
                }
                {this.state.Moscowroom &&
                    <div>
                    <div className="chatMenu">
                        <div className="leftbutton" onClick={this.BacktoRooms}>←</div>
                    </div>
                    <div className="chatlabel">
                        Паб
                        <hr color="#6dcff6"/>
                        <span>
			Москва
			</span>
                    </div>
                    <div className="RoomMessages" id="divMessages">
                        <MessageList RoomMessages={this.state.RoomMessages}/>
                    </div>
                    <div className="SendMessage">
                        <div className="SendingUser">
                            Я:
                        </div>
                        <textarea className="Message" id="Message2"  placeholder="Введите сообщение...(максимум 150 символов)" onChange={this.ChangeMessage2} onKeyDown={this.Keypress2}>
		</textarea>
                        <div className="SendButton" onClick={this.SendMeassgesMSC}>
                            Send
                        </div>
                    </div>
                    </div>}

            </div>

        );
    }
};





export class List extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            EventReceived:[],
            loading:true
        };

    }
    componentWillMount() {
        $.when( $.ajax({
            url: "/GetEventEasy/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {

                this.setState({EventReceived: data,loading:false})

        }.bind(this));

    }

    render(){
        if (this.state.loading){
            return <div className="loadingState">        <div className="sk-folding-cube" >
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
            </div>
                <div className="loadinglabel">Загружаю...</div></div>
        }else{
        let ResultsComponents = this.state.EventReceived.map(function(Event) {
            if (!Event.PhotoURL){
                Event.PhotoURL='../images/fav.png'
            }
            console.log(Event)
            let divStyle = {
                float: "left",
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Event.PhotoURL + ')' ,

            }
            let divStyle1 = {
                float: "left",
                backgroundImage: 'url(' + Event.CreatorPhoto + ')' ,

            }
            return (
                <div className="polaroid">
                    <a href={`/Event/${Event.EventId}`} target="_blank" key={Event.EventId} >
                    <div style={divStyle} className="photoPolaroid"  > <p style={divStyle1} className="CreatorPhotoTitle"> </p><br/><br/> <p className="ObyavNameTitle">{Event.Name}</p></div>
                        <div className="textContainer">
                    <div className='' > <p>{Event.Category} </p></div>
                    <p className=''>{Event.date[0]}{Event.date[1] && <span> - {Event.date[1]}</span>}</p>
                            <p className=''  dangerouslySetInnerHTML={{__html: Event.Desc}} ></p>
                        </div></a></div>

            );
        }.bind(this));


        return (<div >
                    <div className="listlabel">
                        <b>Создано объявлений </b>| 33 за эту неделю
                    </div>
                    <div className="ListContent">
                        {ResultsComponents}
                    </div>
                <Link to={`/CreateEvent`}><div className="createListButton" >
                    Создать Объявление
                </div></Link>
            </div>

        );
    }}
};

