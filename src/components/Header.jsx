import React from 'react'
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import styles from './css/headerMenu.css';
export default class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            AfterLogin:false,
            UserData:{},
            Searchvalue: '',
            FindResults:[],
            SearchPanel: false,
            intervalId:'',
            UsrCity:'',
            MobileMenu:false,
            CurWeather:{lang_ru:[{value:"1"}],
                weatherIconUrl:[{value:"1"}]
            },
                                                                    BeforeLogin:true,
                                                                    Login:false,
                                                                    regEmail:'',
                                                                    regPass:'',
                                                                    LoginForm:true,
                                                                    RegestrationForm:false,
                                                                    loading:true
        };
        this.LoggedIn = this.LoggedIn.bind(this);
        this.OpenSearch = this.OpenSearch.bind(this);
        this.CloseSearch = this.CloseSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.SetCity = this.SetCity.bind(this);
        this.SetWeather = this.SetWeather.bind(this);
        this.openMenuMobile = this.openMenuMobile.bind(this);
        this.DisplayFindResults = this.DisplayFindResults.bind(this);

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

    }
    componentDidMount() {

    }
    componentWillMount() {

        checkCookie(this.LoggedIn);
        checkCity(this.SetCity)
        //checkWeather(this.SetWeather)
                                                                                            this.Coockie();
                                                                                            this.CoockieVk();

    }
    SetWeather(Weather){
        this.setState({CurWeather: Weather});
    }
    SetCity(City){
            this.setState({UsrCity: City});
    }

    LoggedIn(UserData){
        if (UserData!="") {
            this.setState({AfterLogin: true});
            this.setState({UserData: UserData});

            this.forceUpdate();
        }
    }
    componentWillReceiveProps(nextProps){
        this.forceUpdate();
    }
    ClearCoockie(){
        ClearCoockie();
    }
    OpenSearch(){


    }
    handleChange(event) {
        this.setState({Searchvalue: event.target.value});
        this.setState({SearchPanel: true});
        if (event.target.value != '') {
            FindUsers(event.target.value, this.DisplayFindResults);
        }
    }
    DisplayFindResults(Results){
        this.setState({FindResults: Results});
    }
    CloseSearch(){
        this.setState({SearchPanel: false});
    }
    openMenuMobile(){
        console.log(this.state.UserData);
        this.setState({SearchPanel: false});
        this.setState({MobileMenu: !this.state.MobileMenu});
        if(this.state.MobileMenu) {
            $("#buttonMenuMain").removeClass("ShtorkaMobileMenuButtonDowned");
            $("#carretsignMenu").removeClass("carretsignMenu");
            $("#shtorkaMobileMenu").removeClass("ShtorkaMobileMenuShowDowned");
        } else{
            $("#shtorkaMobileMenu").addClass("ShtorkaMobileMenuShowDowned");
            $("#buttonMenuMain").addClass("ShtorkaMobileMenuButtonDowned");
            $("#carretsignMenu").addClass("carretsignMenu");

        }
    }

                                                                                                        Coockie() {
                                                                                                            checkCookie(this.SuccesLogin);
                                                                                                        }
                                                                                                        Login(){
                                                                                                            logUsr(document.getElementById("regEmail").value,document.getElementById("regPass").value,this.state.UsrCity,this.SuccesLogin);
                                                                                                        }
                                                                                                        SuccesLogin(UserDataLogin){
                                                                                                            if (UserDataLogin!="") {
                                                                                                                this.setState({UserData: UserDataLogin});
                                                                                                                this.setState({BeforeLogin: false, AfterLogin: true, Login: false});
                                                                                                            }
                                                                                                        }
                                                                                                        Regestration(){
                                                                                                            regUsr(document.getElementById("regEmail").value,document.getElementById("regPass").value,this.state.UsrCity,this.SuccesRegestration);

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
                                                                                                            loginVK(this.state.UsrCity,this.UserDataReceive);


                                                                                                        }
                                                                                                        UserDataReceive(UserDataVk){
                                                                                                            console.log(UserDataVk);
                                                                                                            if (UserDataVk===true){
                                                                                                                this.setState({Login:false});
                                                                                                            }else{
                                                                                                                this.setState({UserData: UserDataVk});
                                                                                                                this.setState({ BeforeLogin:false,AfterLogin:true,Login:false});

                                                                                                            }
                                                                                                        }

    render(){
        if (this.state.UserData.UsrPhotoBig){
            var divStyle = {
                backgroundImage: 'url(' + this.state.UserData.UsrPhotoBig + ')'
            }}else{
            var divStyle = {
                backgroundImage: 'url(/images/LogoProfile.jpg)'
            }
        }
        var divStyle1 = {
             backgroundImage: 'url(' + this.state.CurWeather.weatherIconUrl[0].value + ')'
        }
        var divStyleNotAFt = {
            backgroundImage: 'url(/images/_.png)'
        }
        var divStyleNotAFt1 = {
            backgroundImage: 'url(/images/DR1lvHoU8AAqu-E.jpg)'
        }
        var divStyleNotAFt2 = {
            backgroundImage: 'url(/images/131589.jpg)'
        }
        return (
        <div className="Header" id="Header">
             <div id="shtorkaMobileMenu" className="ShtorkaMobileMenu" >
                 <div className="SearchPanelinMenu"><input type="text" value={this.state.Searchvalue} onChange={this.handleChange} className="SearchInputInMenu"/> <div className="DvigLup"></div> <i className="fa fa-search fa-1x " onClick={this.handleChange} aria-hidden="true"></i>{this.state.SearchPanel &&<i className="EventsPrimaryBlockOnMainPageAlertClose CloseSearch" onClick={this.CloseSearch}>х</i>} <br/></div>
                 {this.state.AfterLogin &&<div className="ProfileAuthorizitedInMenu">
                     <div className="ProfileAuthorizitedInMenuLeftItems">
                     <div className="ProfileAuthorizitedInMenuLeftItemsName">
                         {this.state.UserData.UsrFirstName}
                     </div>
                     <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlock">
                         <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar"  style={divStyle}>
                         </div>
                         <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel">
                             {this.state.UserData.Level}
                         </div>
                         <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel">
                                    Уровень
                         </div>
                     </div>
                 </div>
                     <div className="ProfileAuthorizitedInMenuRightItems">
                         <div className="ProfileAuthorizitedInMenuRightItemsCity">
                             Ваш Город: <div className="ProfileAuthorizitedInMenuRightItemsCityName">{this.state.UsrCity}</div>
                         </div>
                         <div className="ProfileAuthorizitedInMenuRightItemsMissedNoth">
                             <p>Пропущенные:</p>Сообщения - <span className="IconOfMissingAlerts1">{this.state.UserData.countofUnreaded}</span><br/>Зав.в друзья - <span className="IconOfMissingAlerts1">{this.state.UserData.IncomingFriendReqest}</span><br/>Приглашений - <span className="IconOfMissingAlerts1">4</span>
                         </div>
                         <Link to={`/User/${this.state.UserData.NBID}`} onClick={this.openMenuMobile} className="ProfileAuthorizitedInMenuRightItemsOpenProfile">
                                    Открыть профиль
                         </Link>
                     </div>
                    {/* <div className="ProfileAuthorizitedInMenuRightWeatherItems">
                         Сейчас {this.state.CurWeather.lang_ru[0].value}<br/>
                         Температура :{this.state.CurWeather.temp_C}<br/>
                         Ощущеается как: {this.state.CurWeather.FeelsLikeC} <br/>
                         <div className="currentWeatherIcon"  style={divStyle1}>

                         </div>
                     </div>*/}
                 </div>}
                 {!this.state.AfterLogin &&<div className="ProfileNotAuthorizitedInMenu">
                     <div className="Login" id="Login">
                       <p className="AutoLabel">Авторизация</p>
                         <div className="LoginPresentation">
                            <div className="LoginPresentationPhotoBlock">
                                <div className="LoginPresentationPhotoBlockLeft" style={divStyleNotAFt1}></div>
                                <div className="LoginPresentationPhotoBlockRight" style={divStyleNotAFt2}></div>
                                <div className="LoginPresentationPhotoBlockCenter">
                                    <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar PhotoBlockFix"  style={divStyleNotAFt}>
                                    </div>
                                    <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel lvlFix">
                                        0
                                    </div>
                                    <div className="ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel lblFix">
                                        Уровень
                                    </div>
                                </div>
                            </div>
                             <div className="LoginPresentationLabel">Поведуй о себе!;) Твои друзья уже с нами!!!</div>
                         </div>
                         <div className="LoginForm">
                             Логин :<input type="text" className="LoginEmail1" size="50" id="regEmail"  onChange={this.EmailEnter}/><br/>
                             Пароль :<input type="password" className="LoginEmail" size="50" id="regPass" onChange={this.PassEnter}/><br/>

                         </div>
                         <div className="MenubutttonFix">
                             <button type="submit" className="LoginBtn1" onClick={this.Regestration}>
                                 Зарегестрироваться
                             </button>
                             <button type="submit" className="LoginBtn" onClick={this.Login}>Войти</button>
                         </div>


                        <div className="LoginButtonsBlock">
                         {/*<p>Вход с помощью соц.сетей</p>*/}
                         <div className="LoginButtons" title="Авторизация с помощью Вконтакте">
                             <i className="fab fa-vk" onClick={this.LoginVK} aria-hidden="true" />
                         </div>
                     </div>
                 </div>
                 </div>}
                 <div  className="DisplayInline">
                <Link to={`/SearchEvent`} className="MenuItemsEvents">
                    <p className="SbgInside">
                        <i className="fa fa-list fa-3x" aria-hidden="true"/>
                        <div className="CrugRamka"/>
                    </p>
                    <span className="LabelMenu">События</span>
                </Link>
                 <Link to={`/Chats`} className="MenuItemsEvents">
                     <p className="SbgInside">
                         <i className="fa fa-list fa-3x" aria-hidden="true"/>
                         <div className="CrugRamka"/>
                     </p>
                     <span className="LabelMenu">Чаты</span>
                 </Link>
                 </div>
                 <div className="DisplayInline">
                     {this.state.AfterLogin && <Link  to={`/CreateEvent`} className="MenuItemsCreateEvent">
                         <p>
                             <span className="LabelMenu1">Создать событие</span>
                         </p>
                         <p className="SbgInside1">
                             <i className="fa fa-bullhorn fa-3x" aria-hidden="true"/>
                             <div className="CrugRamka"/>
                         </p>
                     </Link>}
                     {this.state.AfterLogin &&<Link to={`/CreateChat`} className="MenuItemsCreateChat">
                         <p>
                             <span  className="LabelMenu1">Создать чат</span>
                         </p>
                         <p className="SbgInside1">
                             <i className="fa fa-comments fa-3x" aria-hidden="true"/>
                             <div className="CrugRamka"/>
                         </p>
                     </Link>}
                     </div>
                 {this.state.AfterLogin &&<a onClick={this.ClearCoockie} className="MenuItemsExit">
                     <p>
                         <i className="fa fa-sign-out-alt fa-3x" aria-hidden="true"/>Выйти</p>
                 </a>}

                 </div>

            <div className="ShtorkaMobileMenuButton" id="buttonMenuMain" onClick={this.openMenuMobile}>
                <div className="buttonIconMobileMenuButton"><i className="fa fa-caret-down fa-2x" id="carretsignMenu" aria-hidden="true"></i></div>
            </div>

            {this.state.SearchPanel && <div className="SearchPanel">

                <SearchResult Results={this.state.FindResults}/>
            </div>}

            <Link to={`/`}  className="LogoVneshn">
                <span className="LogoVnut">NB</span><span className="LogoVnutN"> </span>
            </Link>



        </div>
    );
}
};

export class SearchResult extends React.Component{
    render() {
        let FindResultsComponents;
        let FindResultsComponentsEvent;
            if(this.props.Results[0]){
        FindResultsComponents = this.props.Results[0].map(function (UserFind) {
            if (!UserFind.UsrPhotoBig) {
                UserFind.UsrPhotoBig = '../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + UserFind.UsrPhotoBig + ')'

            }
            return (<Link to={(`/User/${UserFind.NBID}`)} onClick={this.props.openMenuMobile}>
                <div className="FindResultsUserBlockMain" key={UserFind.NBID}>
                    <div className="searchresultuserpic1" style={divStyle}></div>
                    <div
                        className='FindResultsUserFirstNameMain'>{UserFind.UsrFirstName} {UserFind.UsrLastName}</div>
                </div>
            </Link>);
        }.bind(this));}

        if (this.props.Results[1])
        FindResultsComponentsEvent = this.props.Results[1].map(function(Event) {
            if (!Event.PhotoURL){
                Event.PhotoURL='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'

            }
            return (<Link to={`/Event/${Event.EventId}`} onClick={this.props.openMenuMobile}>
                <div className="FindResultsUserBlockMain" key={Event.EventId}>
                    <div className="searchresultuserpic1"style={divStyle}  ></div>
                    <div className='FindResultsUserFirstNameMain' >{Event.Name} <br/>{Event.Category}</div>
                </div></Link>);
        }.bind(this));
        return <div className="Searchres">Пользователи <br/>{FindResultsComponents} </div>;

    }

};