import React from 'react';
import { Link} from 'react-router';
import MetaTags from 'react-meta-tags';
import {ReactTitle} from 'react-meta-tags';
import Header from './components/Header.jsx'
import  style from './components/css/Chats.css';
import  style1 from './components/css/ChatList.css';
import styles from './components/css/EventsBlockOnMainPage.css';
export default class Chats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            LoadItems:10,
            Items:[],
            Searchvalue: '',
            EvrethingIsLoaded:"false"
        };
        this.LoadMore = this.LoadMore.bind(this);
        this.LoadMore();
        this.handleChange = this.handleChange.bind(this);

    }
    LoadMore(){
        $.when( $.ajax({
            url: "/GetChats/",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify({Items: this.state.LoadItems,CountOfLoad:10}),
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {
            if (data!=="End") {
                this.setState({Items: this.state.Items.concat(data)});
                this.setState({LoadItems: this.state.LoadItems + 10})
                this.setState({EvrethingIsLoaded: "false"})
            }else{
                this.setState({EvrethingIsLoaded: "true"})
            }
        }.bind(this));
    }
    handleChange(event) {
        this.setState({Searchvalue: event.target.value});
        if (event.target.value != '') {
            $.when( $.ajax({
                url: "/FindChats/",
                type: 'POST',
                contentType:'application/json',
                data: JSON.stringify({KeyWorld: event.target.value}),
                dataType:'json'
            }) ).then(function( data, textStatus, jqXHR ) {
                this.setState({Items: data,EvrethingIsLoaded:"search",LoadItems:10});
            }.bind(this));
        }else{
            this.setState({Items: []})
            this.LoadMore();
        }
    }
    render() {
            let metaTitle = 'NightBrowser-Чаты' ;
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
                <div>
                    <MetaTags>
                        <ReactTitle title={metaTitle}/>
                        <meta name="description" content="Вы можеете пообщаться с людьми по интересующим вас темам или просто так "/>
                        <meta property="og:title" content="Чаты NightBrowser"/>
                    </MetaTags>
                    <Header/>
                    <div className="content contentChat">
                        <div>
                            <div className="ChatsBlockLabel">Чаты пользователей </div>
                            <div className="FindChatBlock">
                                <input type="text" value={this.state.Searchvalue} onChange={this.handleChange} className="SearchInputInChats"/>
                                <div className="SearchPoint"  onClick={this.handleChange}><i className="fa fa-search poisk  " aria-hidden="true"/></div>
                               <br/></div>
                            <div className="ChatsBlockSwitcher"> Новые
                                <input id="cb4" className="tgl1 tgl-flat1"  type = "checkbox" onChange={this.ChatSort}/>
                            <label className="tgl-btn1" htmlFor= "cb4"/>Популярные</div>
                            <div className="ChatsBlockMain">
                                {ResultsComponentsChats}

                            </div><div className="ChatsBlockLabel widthFix">
                                {this.state.EvrethingIsLoaded=="false" && <div type="button" className="EventsPrimaryBlockOnMainPageViewNearest " onClick={this.LoadMore}>Загрузить еще</div>}
                                {this.state.EvrethingIsLoaded=="true" && <div  className="EventsPrimaryBlockOnMainPageViewNearest" onClick={this.LoadMore}>Все загружено</div>}
                            </div>
                        </div>
                    </div>
                </div>
                )
    }
};
