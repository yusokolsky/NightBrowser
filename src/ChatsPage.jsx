import React from 'react';
import io from "socket.io-client";
import MetaTags from 'react-meta-tags';
import {ReactTitle} from 'react-meta-tags';
import Header from './components/Header.jsx'
import  style from './components/css/Chats.css';
import { Link } from 'react-router';

export default class ChatsPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            ChatData: {},
            username: '',
            Message: '',
            messages: [],
            NewMessage:false,
            LoadItems:15,
            EvrethingIsLoaded:false,
            NotAuth:false,
            firstTime:true,
            DescStyle:{
                opacity: '0',
                marginTop: '-10px',
                transition:'0.2s'
            }
        };
        this.LoadMore = this.LoadMore.bind(this);
        this.scrollImidiatly = this.scrollImidiatly.bind(this);

        this.Scroll = this.Scroll.bind(this);
        this.scrollToDown = this.scrollToDown.bind(this);
        this.KeyPressArea = this.KeyPressArea.bind(this);
        this.Desc=this.Desc.bind(this);
        fetch(`/ChatData/${this.props.params.id}`).then(response => response.json()).then(ChatData => {
            if(ChatData===true){
                window.location.replace("/");
            }
            else
                this.setState({ ChatData });    // all the attributes of the bug are top level state items
        });

        this.LoadMore();
        this.socket = io('https://nightbrobeta.herokuapp.com:80');
        this.socket.on('connect', function() {
            // Connected, let's sign-up for to receive messages for this room
            this.socket.emit('room', this.props.params.id);
           // scrollint1();
            this.scrollToDown();
        }.bind(this));
        this.socket.on('RECEIVE_MESSAGE', function(data){

            addMessage(data);
            this.scrollToDown();
        }.bind(this));
        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };
        this.sendMessage = ev => {

            ev.preventDefault();
            if(this.state.Message!=="")
            this.socket.emit('SEND_MESSAGE', {
                Author: this.state.username,
                Message: this.state.Message,
                roomId:this.props.params.id
            })
            this.setState({Message: ''});
            var el = this.refs.DisplayMessages;
            el.scrollTop = el.scrollHeight;
        }
    }
    LoadMore(){
        console.log(this.state.LoadItems + 15)
        $.when( $.ajax({
            url: "/ChatDataMessages/",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify({id: this.props.params.id,Items:this.state.LoadItems,CountOfLoad:15}),
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
        }.bind(this));
    }
    componentDidMount(){

        if (id != "") {
            ajaxReq("/loginCheck/", {UsrId: id,
                UsrPass: getCookieMd5Pass()}, function(userData){
                if (userData!='0'){
                    this.setState({username: userData.NBID})}
                else {this.setState({NotAuth: true})}
            }.bind(this));
        }else{
            this.setState({NotAuth: true})
        }
        this.scrollToDown();
    }
    componentDidUpdate () {

    }
    scrollToDown(){
        var el = this.refs.DisplayMessages;

        if(el.scrollHeight-850<el.scrollTop || this.state.firstTime){
        el.scrollTop = el.scrollHeight;
            setTimeout(function() {
                this.setState({firstTime: false})
            }.bind(this), 1000);
        }else{
            this.setState({NewMessage: true})}
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
    componentWillMount() {
        this.setState({LoadItems: 15})
    }
    Desc(){
        if(this.state.DescStyle.opacity==='1'){
            this.setState({  DescStyle:{
                opacity: '0',
                marginTop: '-10px',
                transition:'0.2s'

            }})
        }else{
        this.setState({ DescStyle:{
            opacity: '1',
            marginTop: '13px',

        }})}
    }

    KeyPressArea(event){
        if(event.keyCode == 13){
            this.sendMessage(event);
            return false; // Just a workaround for old browsers
        }
    }

    render(){
        let divStyle;
        if(!this.state.ChatData.PhotoURL){
             divStyle = {

                backgroundImage: 'url(../images/fav.png)'
            }
        }else{
         divStyle = {

            backgroundImage: 'url(' + this.state.ChatData.PhotoURL + ')'
        }
        }

            return (
                <div>
                    <Header/>
                    <div className="content ChatContnent" style={divStyle}>

                        <div className="ChatHeader">
                            <div className="ShareInviteToChat" title="Поделиться"><i className="fa fa-user-plus"></i></div>
                            <div className="NameOfChatAndDesc">
                                <span>{this.state.ChatData.Name}</span><br/>{this.state.ChatData.Description && <div className="DescButton" onClick={this.Desc}>Описание <i className="fa fa-arrow-circle-down"></i></div>}
                                <div className="ChatDesc" >
                                    <div className="ChatDescIn" style={this.state.DescStyle} >
                                        {this.state.ChatData.Description}
                                    </div>
                                </div>
                            </div>
                            {this.state.ChatData==="Private" && <div className="TypeOfPrivacy">
                            <i className="fa fa-lock" title="Чат закрытый."/>
                            </div>}
                            {this.state.ChatData.Private===0 && <div className="TypeOfPrivacy fixgreen">
                                <i className="fa fa-unlock" title="Чат Открытый."/>
                            </div>}
                        </div>
                        <div className="BackgroundInfo"  >
                            <div className="DisplayMessages" id="DisplayMessages" ref="DisplayMessages" onScroll={this.Scroll}>
                                {!this.state.EvrethingIsLoaded && <div className="LoadMore" onClick={this.LoadMore}> Загрузить еще</div>}
                                {this.state.messages.map(message => {
                                    let divStylePhotoUsr = {
                                        backgroundImage: 'url(' + this.state.ChatData.PhotoURL + ')'

                                    }
                                    return (
                                        <div className="MessagesBlockMain">
                                            <Link to={`/User/${message.Author.Id}`} className="LeftSidePhotos" title={message.Author.Name+" "+message.Author.Fam}>
                                                <img src={message.Author.Photo} className="UsrPhotoOnChat" alt={message.Author.Name}>

                                                </img>
                                                <div className="PhotoLabel" >
                                                    {message.Author.Name}
                                                </div>
                                            </Link><div className="SelfMessage">{message.Message}</div> </div>
                                    )
                                })}
                                {this.state.NewMessage && <div className="ScrollDown" onClick={this.scrollImidiatly}> Новые сообщения</div>}
                            </div>
                            {!this.state.NotAuth &&<div className="BottomMenu">
                                 <div className="ChatMessageBottomBarSend">{/*БЛОК С ОТПРАВЛЕНИЕМ СООБЩЕНИЯ*/}
                                    <textarea value={this.state.Message} onChange={ev => this.setState({Message: ev.target.value})} id="Message" onKeyDown={this.KeyPressArea}  placeholder="Введите сообщение..." ></textarea>
                                    <div onClick={this.sendMessage} className="sendMessageButton"><i className="fa fa-american-sign-language-interpreting" ></i></div>
                                </div>
                            </div>}

                        </div>

                    </div>
                </div>
            )}
};
