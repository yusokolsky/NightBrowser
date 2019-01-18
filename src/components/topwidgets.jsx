import React from 'react'



import { Link } from 'react-router';
import { browserHistory } from 'react-router';
const Loading = () => <div className="loadingState">        <div className="sk-folding-cube">
    <div className="sk-cube1 sk-cube"></div>
    <div className="sk-cube2 sk-cube"></div>
    <div className="sk-cube4 sk-cube"></div>
    <div className="sk-cube3 sk-cube"></div>
</div>
    <div className="loadinglabel">Загружаю...</div></div>;
export default class TopWidgets extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            BeforeLogin:true,
            AfterLogin:false,
            Login:false,
            regEmail:'',
            regPass:'',
            LoginForm:true,
            RegestrationForm:false,
            UserData: {},
            loading:true,
            EventsonMap:[]

        };
        this.UserDataReceive = this.UserDataReceive.bind(this);
        this.UserDataReceiveC = this.UserDataReceiveC.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.Regestration = this.Regestration.bind(this);
        this.SuccesRegestration = this.SuccesRegestration.bind(this);
        this.openRegestration = this.openRegestration.bind(this);
        this.closeRegestration = this.closeRegestration.bind(this);
        this.LoginVK = this.LoginVK.bind(this);
        this.Login = this.Login.bind(this);
        this.SuccesLogin = this.SuccesLogin.bind(this);
        this.Map = this.Map.bind(this);
    }
    componentWillMount(){

        $.when( $.ajax({
            url: "/GetEventDataForMap/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {
            this.setState({ EventsonMap:data});

        }.bind(this));
    }
    componentDidMount() {
        this.Coockie();
        this.CoockieVk();
        ymaps.ready(this.Map);

    }
    componentDidUpdate(){

    }
    Map(){
        let myMap;
        myMap = new ymaps.Map("map", {
            center: [59.93863, 30.31413],
            zoom: 9
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });
        let myClusterer = new ymaps.Clusterer();
        this.state.EventsonMap.map(function(Event) {
            let myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                balloonContentHeader: Event.Name,
                balloonContentBody: "Категория: "+Event.Category+"<br/><a class='stupiahref'href='/Event/"+Event.EventId+"' target='_blank' > Открыть (в новой вкладке)</a>",
                hintContent: Event.Name
            });

            myClusterer.add(myPlacemark);

        }.bind(this));
        myMap.geoObjects.add(myClusterer);
        this.setState({ loading:false});
    }
    Coockie() {
        checkCookie(this.SuccesLogin);
    }
    Login(){
        logUsr(document.getElementById("regEmail").value,document.getElementById("regPass").value,this.SuccesLogin);
    }
    SuccesLogin(UserDataLogin){
        if (UserDataLogin!="") {
            this.setState({UserData: UserDataLogin});
            this.setState({BeforeLogin: false, AfterLogin: true, Login: false});
        }
    }
    Regestration(){
        regUsr(document.getElementById("regEmail").value,document.getElementById("regPass").value,this.SuccesRegestration);

    }
    SuccesRegestration(NBID){
        browserHistory.push('/User/'+NBID+'/edit');
    }
    openLogin() {
        this.setState({ Login:true,BeforeLogin:false});

    }
    openRegestration() {
        this.setState({ LoginForm:false,RegestrationForm:true});
    }
    closeRegestration(){
        this.setState({ LoginForm:true,RegestrationForm:false});
    }
    CoockieVk() {
        checkCookie(this.UserDataReceiveC);
    }
    UserDataReceiveC(UserDataVk){
        if (UserDataVk!="") {
            this.setState({UserData: UserDataVk});
            this.setState({BeforeLogin: false, AfterLogin: true, Login: false});
        }
    }
    LoginVK() {
        loginVK(this.UserDataReceive);


    }
    UserDataReceive(UserDataVk){
        if (UserDataVk===true){
            this.setState({Login:false});
        }else{
            this.setState({UserData: UserDataVk});
            this.setState({ BeforeLogin:false,AfterLogin:true,Login:false});

        }
    }
    render() {

       /* $('#weatherframe').load(function() {
            ymaps.ready(this.Map);
            $('#weatherframe').contents().find(".weather-widget__type_lg").css("width","100%");
        });*/
            return (<div className="topwidgets">
                    {/*{this.state.loading &&<div className="topwidgets2"><img  src="images/LogoTitle.png"></img> </div>}*/}
                    <div className="map">
                        {/*<div id="map"></div>*/}
                    </div>
                    <div className="UserWindow" id="UserWindow">

                        {this.state.Login &&
                        <div className="Login" id="Login">

                            <div className="LoginForm">
                                {this.state.RegestrationForm && <center>Регистрация</center>}
                                {this.state.LoginForm && <center>Вход </center>}
                                <br/>Логин : <input type="text" className="LoginEmail1" size="50" id="regEmail"
                                                    onChange={this.EmailEnter}/><br/>
                                Пароль:<input type="password" className="LoginEmail" size="50" id="regPass"
                                              onChange={this.PassEnter}/><br/>

                                {this.state.RegestrationForm && <div>

                                    <button type="submit" className="LoginBtnBack" onClick={this.closeRegestration}>
                                        Back
                                    </button>
                                    <button type="submit" className="LoginBtnSignUp" onClick={this.Regestration}>Sign
                                        Up
                                    </button>
                                </div>
                                }

                                {this.state.LoginForm &&
                                <div>
                                    <button type="submit" className="LoginBtn1" onClick={this.openRegestration}>
                                        Regestration
                                    </button>
                                    <button type="submit" className="LoginBtn" onClick={this.Login}>Sign in</button>
                                </div>
                                }

                            </div>


                            <div className="LoginButtons">
                                <div className="vk_vhod" onClick={this.LoginVK}><img src="/images/vklogo.png" width="60"
                                                                                     height="60"></img></div>
                                <div className="vk_vhod" onClick={this.LoginVK}><img src="/images/vklogo.png" width="60"
                                                                                     height="60"></img></div>
                                <div className="vk_vhod" onClick={this.LoginVK}><img src="/images/vklogo.png" width="60"
                                                                                     height="60"></img></div>
                            </div>
                        </div>}


                        {this.state.BeforeLogin &&
                        <div className="BeforeLogin">
                            <div className="UserPhoto">

                            </div>
                            <div className="Authorize" onClick={this.openLogin}>
                                <p>Авторизироваться</p>
                            </div>

                        </div>
                        }
                        {this.state.AfterLogin &&
                        <div className="AfterLogin">

                            <div className="UserPhoto">
                                {this.state.UserData.UsrPhotoBig && <img src={this.state.UserData.UsrPhotoBig}></img>}
                                {!this.state.UserData.UsrPhotoBig && <img src="/images/LogoProfile.jpg"></img>}
                            </div>
                            <Link to={`/User/${this.state.UserData.NBID}`}>
                                <div className="UserName">
                                    {this.state.UserData.UsrFirstName && this.state.UserData.UsrLastName &&
                                    <p>{this.state.UserData.UsrFirstName} {this.state.UserData.UsrLastName}</p>}
                                    {!this.state.UserData.UsrFirstName && this.state.UserData.UsrLastName &&
                                    <p> {this.state.UserData.UsrLastName}</p>}
                                    {this.state.UserData.UsrFirstName && !this.state.UserData.UsrLastName &&
                                    <p> {this.state.UserData.UsrLastName}</p>}
                                    {!this.state.UserData.UsrFirstName && !this.state.UserData.UsrLastName &&
                                    <p> Anonymous </p>}
                                </div>
                            </Link>
                        </div>
                        }
                    </div>
                    <div className="weather">
                        <iframe id="weatherframe" scrolling="no" src="/weatherParse/index.html"
                                className="WeatherModule"></iframe>
                    </div>

                </div>
            );
        }
};

