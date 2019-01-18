import React from 'react'

import { FormControl,FormGroup,ControlLabel,Button,HelpBlock } from'react-bootstrap';
const Loading = () => <div className="loadingState">        <div className="sk-folding-cube" >
    <div className="sk-cube1 sk-cube"></div>
    <div className="sk-cube2 sk-cube"></div>
    <div className="sk-cube4 sk-cube"></div>
    <div className="sk-cube3 sk-cube"></div>
</div>
    <div className="loadinglabel">Загружаю...</div></div>;
export default class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            Loading:true,
            UserData:{},
            ip:"",
            usrPhoto:""
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.AddVk = this.AddVk.bind(this);

    }
    componentWillMount() {
        if (this.props.UserData.UsrPhotoBig!="../images/LogoProfile.jpg"){
            this.setState({usrPhoto: this.props.UserData.UsrPhotoBig});
        }else{
            this.setState({usrPhoto: ''});
        }
        this.setState({UserData: this.props.UserData});
        this.setState({Loading: false});

        $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
            console.log(data)
            this.setState({ip: data.geobytesipaddress});
        }.bind(this));
    }
    componentDidMount(){
        if (this.props.UserData.UsrPhotoBig=="../images/LogoProfile.jpg"){
            $('#blah').attr('src',"/images/LogoProfile.jpg");}
            else
        $('#blah').attr('src',this.state.usrPhoto);
    }
    AddVk(){
        AddVk(this.state.UserData);
    }
    changePhotoUrl(event){


        $('#blah').attr('src',event.target.value );

    }
    changePhotoFile(event){
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }

            reader.readAsDataURL(event.target.files[0]);
        }

    }
    render(){
        let urltophoto="";
        if (this.state.usrPhoto[0]=='/'){
            urltophoto='http://nightbrowser.herokuapp.com'+this.state.usrPhoto
        }else{
            if (this.state.usrPhoto=='../images/LogoProfile.jpg') {
                urltophoto = 'http://nightbrowser.herokuapp.com/images/LogoProfile.jpg'
            }else{ urltophoto=this.state.usrPhoto;}
        }
        if (this.state.Loading ==true)
        {
            return <Loading />
        }
        else{
        return (
        <div className="content">
            <div className="ProfileEditBack">
                <div className="ProfileEditForm">
                    <p className="formcaption"> Редактирование профиля</p>
                    <form action="/UploadPhoto" method="POST" encType="multipart/form-data">
                    <div className="ProfileEditSocial">Подключить Социальные Сети:<br/>
                        <div className="LoginButtons">
                            <div className="vk_vhod" onClick={this.AddVk}><img src="/images/vklogo.png" width="60" height="60"></img></div>
                        </div>
                    </div>
                    <div className="inlineblock">
                    <div className="ProfileEditFields">
                        <ControlLabel>Ваше имя</ControlLabel>
                        <FormControl type="text" name="FirstName" required defaultValue={this.props.UserData.UsrFirstName}
                                     placeholder="Имя"/>&nbsp;
                        <FormControl type="text" name="SecondName" required defaultValue={this.props.UserData.UsrLastName}
                                     placeholder="Фамилия"/>

                    </div>
                        <input type='hidden' id='NBID' name='NBID' value={this.props.UserData.NBID} />
                        <input type='hidden' id='UserIp' name='UserIp' value={this.state.ip} />
                        <FormGroup controlId="formControls" className="shortfieldgroup EventFromTime">
                            <ControlLabel> Фото профиля </ControlLabel>
                            <div className="eventimgprewblock">
                                <img id="blah" src="/images/200.jpg" alt="your image" />
                            </div>
                            <label htmlFor="imgInp" className="custom-file-upload">
                                <i className="fa fa-cloud-upload"></i> Загрузить изображение
                            </label>
                            <input id="imgInp" type="file" name="avatar"  onChange={this.changePhotoFile}/>
                            <FormControl type="url" defaultValue={urltophoto} placeholder="Или вставьте url изображения (Оставтье пустым если вы загрузили свое изображение)" name="AvatarURL" onChange={this.changePhotoUrl}/>
                        </FormGroup>
                        </div>
                        <div className="inlineblock fortextarea">
                        <FormGroup   controlId="formControlsTextarea" className="shortfieldgroup editdiv">
                            <ControlLabel>О себе</ControlLabel>
                            <FormControl  placeholder="Расскажите немного о том, что люди должны знать о вас (макс. 180 символов)" maxlength="180"  componentClass="textarea" defaultValue={this.props.UserData.UsrDesc}  name="UserDescription"/>
                        </FormGroup>
                            <div className="inlineblockcenter">
                        <FormGroup controlId="formControls" className="EventFromTime">
                            <ControlLabel> Пол </ControlLabel>
                            <div className="button-wrap">

                                {this.props.UserData.Sex=="Мужской" && <input className="hidden radio-label" type="radio" name="Sex" id="no-button" value="Мужской" defaultChecked/>}
                                {(!this.props.UserData.Sex || this.props.UserData.Sex=="Женский") && <input className="hidden radio-label" type="radio" name="Sex" id="no-button" value="Мужской" />}
                                <label className="button-label" htmlFor="no-button">
                                    <h1>мужской</h1>
                                </label>
                                {this.props.UserData.Sex=="Женский" && <input className="hidden radio-label" type="radio" name="Sex" id="maybe-button" value="Женский" defaultChecked/>}
                                {(!this.props.UserData.Sex || this.props.UserData.Sex=="Мужской")  && <input className="hidden radio-label" type="radio" name="Sex" id="maybe-button" value="Женский" />}
                                <label className="button-label" htmlFor="maybe-button">
                                    <h1>женский</h1>
                                </label>
                            </div>
                        </FormGroup>
                            <FormGroup controlId="formControls" className="EventFromTime">
                        <ControlLabel>Дата рождения</ControlLabel>
                                {this.props.UserData.DateofBirthday && <FormControl type="date" name="DateofBirthday"  defaultValue={this.props.UserData.DateofBirthday} required/>}
                                {!this.props.UserData.DateofBirthday && <FormControl type="date" name="DateofBirthday"  defaultValue={curDate(18)} required/>}
                            </FormGroup>
                            </div>
                        </div>
                        <Button className="formsubmit"  type="submit"  name="submit">
                            Сохранить
                        </Button>

                    </form>
                </div>


            </div>

        </div>
        );}
    }
};

