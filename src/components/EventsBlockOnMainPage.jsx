import React from 'react'
import { Link } from 'react-router';
import styles from './css/EventsBlockOnMainPage.css';
var isResizeble = false;
var timingg;
export default class EventsBlockOnMainPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            EventReceived:[],
            ButtonActive:{ color:'#161515',
                            backgroundColor: "#f7f0f0"},
            ButtonDisactivated: {color:'#f7f0f0',
            backgroundColor: "#161515"},
            ButtonState:true,
            ClosedAlert:localStorage.getItem('RegisterAlert'),
            GetClosetEvent:{},
             TimerCouldown:"Ближайших событий нет",
            LoadItems:6,
            Items:[],
            EvrethingIsLoaded:false
        };

        this.ChangeClick = this.ChangeClick.bind(this);

        this.CloseAlert = this.CloseAlert.bind(this);
        this.LoadMore = this.LoadMore.bind(this);
        this.LoadMore();
    }
    LoadMore(){
        $.when( $.ajax({
            url: "/GetChats/",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify({Items: this.state.LoadItems,CountOfLoad:6}),
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {
            if (data!=="End") {
                this.setState({Items: this.state.Items.concat(data)});
                this.setState({LoadItems: this.state.LoadItems + 6})
            }else{
                this.setState({EvrethingIsLoaded: true})
            }
        }.bind(this));
    }
    componentWillMount() {
        $.when( $.ajax({
            url: "/GetEventEasy/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {

            this.setState({EventReceived: data})
        }.bind(this));

        $.when( $.ajax({
            url: "/GetClosetEvent/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {
                this.setState({GetClosetEvent: data})
                var eventTime = moment(data.date[0])._d;
                var currentTime = moment()._d;
                var TimeStart = data.Time.slice(0, 2);
                var MinuteStart = data.Time.slice(3, 5);
                var diffTime = eventTime - currentTime - 10800000 + (TimeStart * 3600000 + MinuteStart * 60000);
                var duration = moment.duration(diffTime, 'milliseconds');
                var interval = 1000;
                timingg = setInterval(function () {
                    duration = moment.duration(duration - interval, 'milliseconds');
                    this.setState({TimerCouldown: duration.days() + " д. " + duration.hours() + " ч. " + duration.minutes() + " м. " + duration.seconds() + " с."});
                }.bind(this), interval);
        }.bind(this));
    }
    ChangeClick(){
        this.setState({ButtonState: !this.state.ButtonState})

    }
    componentWillUnmount(){
        clearInterval(timingg);
    }

    componentDidUpdate(){



        setTimeout(function () {
            $('.EventsPrimaryBlockOnMainPageContent').flickity({
                // options
                accessibility: true,
                cellAlign: 'left',
                contain: true,
                autoPlay: 2500,
                wrapAround: true
            });
        }, 1000); // время в мс

    }
    CloseAlert(){
        localStorage.setItem('RegisterAlert', 'false');
        this.setState({ClosedAlert: localStorage.getItem('RegisterAlert')})
    }


    render(){
      {

            let ResultsComponents = this.state.EventReceived.map(function(Event) {
                if (!Event.PhotoURL){
                    Event.PhotoURL='../images/fav.png'
                }

                let divStyle = {
                    float: "left",
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Event.PhotoURL + ')' ,

                }
                let divStyle1 = {
                    float: "left",
                    backgroundImage: 'url(' + Event.CreatorPhoto + ')' ,

                }

                return (
                    <div className="EventsPrimaryBlockOnMainPageContentBlock">
                        <Link to={`/Event/${Event.EventId}`}  key={Event.EventId} >
                            <div style={divStyle} className="EventsPrimaryBlockOnMainPageContentBlockphoto"  > <p style={divStyle1} className="EventsPrimaryBlockOnMainPageContentBlockCreatorPhotoTitle"> </p><br/><br/> <p className="EventsPrimaryBlockOnMainPageContentBlockObyavNameTitle">{Event.Name}</p></div>
                            <div className="EventsPrimaryBlockOnMainPageContentBlockText">
                              <div className='EventsPrimaryBlockOnMainPageContentBlockTextCat' > <p>{Event.Category} </p></div>
                                <p className='EventsPrimaryBlockOnMainPageContentBlockTextDate'>{Event.date[0]}{Event.date[1] && <span> - {Event.date[1]}</span>}</p>
                                <p className=''  dangerouslySetInnerHTML={{__html: Event.Desc}} ></p>
                            </div></Link></div>

                );
            }.bind(this));
          let ResultsComponentsChats = this.state.Items.map(function(Chat) {
              if (!Chat.PhotoURL){
                  Chat.PhotoURL='../images/fav.png'
              }

              let divStyle = {
                  float: "left",
                  backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Chat.PhotoURL + ')' ,

              }
              let divStyle1 = {
                  float: "left",


              }
              return (
                  <div className="ChatBlockOnMainPage" id={Chat.ChatsId}>
                      <Link to={`/Chats/${Chat.ChatsId}`} style={divStyle} className="ChatBlockOnHover" id={Chat.ChatsId}>Открыть</Link>
                      <div key={Chat.ChatsId} >
                          <div style={divStyle} className="ChatsPrimaryBlockOnMainPageContentBlockphoto"  > <p style={divStyle1} className="ChatsPopularityOnChatsPage"> {Chat.Private=="0" && Chat.Popularity} {Chat.Private=="1" && <i className="fa fa-lock" aria-hidden="true"></i>} </p><br/><br/> <p className="ChatsPrimaryBlockOnMainPageContentBlockObyavNameTitle">{Chat.Name}</p></div>
                          <div className="ChatsPrimaryBlockOnMainPageContentBlockText">
                              <p className=''  dangerouslySetInnerHTML={{__html: Chat.Description}} ></p>
                          </div></div></div>

              );}.bind(this));

            return (
                <div className="EventsPrimaryBlockOnMainPage">
                    {(!this.state.ClosedAlert) &&  <div className="EventsPrimaryBlockOnMainPageAlert">
                        Вы не зарегестрированны;( Для доступа ко всему функционалу зарегестрируйтесь в меню.<i className="EventsPrimaryBlockOnMainPageAlertClose" onClick={this.CloseAlert}>X</i>
                    </div>}
                    <div className="ChatsBlockLabel">
                        События
                    </div>
                    <div className="EventsPrimaryBlockOnMainPagelabel">
                        <b>Создано событий </b>| 33 за эту неделю
                    </div>

                    <div className="EventsPrimaryBlockOnMainPageContent">

                        {ResultsComponents}
                    </div>

                    <div className="EventsPrimaryBlockOnMainPageContentButtons">
                        <div className="EventsPrimaryBlockOnMainPageContentButtonsBlock">
                            <div className="EventsPrimaryBlockOnMainPageContentButtonsBlockNew" style={ Object.assign({}, !this.state.ButtonState && this.state.ButtonActive, this.state.ButtonState && this.state.ButtonDisactivated ) } onClick={this.ChangeClick}>
                                Новое
                            </div>
                            <div className="EventsPrimaryBlockOnMainPageContentButtonsBlockPop" style={Object.assign({}, this.state.ButtonState && this.state.ButtonActive, !this.state.ButtonState && this.state.ButtonDisactivated )} onClick={this.ChangeClick}>
                                Популярное
                            </div>
                        </div>
                    </div>
                    {this.state.TimerCouldown!="Ближайших событий нет" && <div className="EventsPrimaryBlockOnMainPageTimeNext">
                        <div>Ближайшее событие через: <span className="EventsPrimaryBlockOnMainPageTimeColor">{this.state.TimerCouldown} </span> <Link to={`/Event/${this.state.GetClosetEvent.EventId}`} ><i className="EventsPrimaryBlockOnMainPageViewNearest" >Посмотреть</i></Link></div>
                    </div>}
                    <div><div className="ChatsBlockLabel">Чаты пользователей </div><div className="ChatsBlockSwitcher"> Новые <input id="cb4" className="tgl1 tgl-flat1"  type = "checkbox" onChange={this.ChatSort}/>
                        <label className="tgl-btn1" htmlFor= "cb4"/>Популярные</div>
                    <div className="ChatsBlockMain">
                        {ResultsComponentsChats}

                    </div><div className="ChatsBlockLabel widthFix">
                    {!this.state.EvrethingIsLoaded && <div type="button" className="EventsPrimaryBlockOnMainPageViewNearest " onClick={this.LoadMore}>Загрузить еще</div>}
                    {this.state.EvrethingIsLoaded && <div  className="EventsPrimaryBlockOnMainPageViewNearest" onClick={this.LoadMore}>Все загружено</div>}
                        </div>
                </div>
                </div>

            );

        }}
};