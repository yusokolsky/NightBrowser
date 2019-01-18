import React from 'react'
import  style from './CreateEventContent.scss';

import { FormControl,Checkbox,Radio,FormGroup,ControlLabel,Button,HelpBlock } from'react-bootstrap';
export default class CreateEventContent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            DateType: false,
            PeopleCount:true,
            ageany:true,
            coordiantes:[59.93863, 30.31413]
        };
        this.DateChange = this.DateChange.bind(this);
        this.PeopleCountChange = this.PeopleCountChange.bind(this);
        this.ageChange = this.ageChange.bind(this);
        this.Map = this.Map.bind(this);
    }
    componentDidMount() {
        ymaps.ready(this.Map);

            $("#input-4").fileinput({showCaption: false,showUpload:false});

            $("#example_id").ionRangeSlider({
                hide_min_max: true,
                keyboard: true,
                min: 0,
                max: 100,
                from: 16,
                to: 99,
                type: 'double',
                step: 1,
                grid: true
            });


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
    DateChange(event){
        if (event.target.checked){
            this.setState({DateType: true});
        }
        else{
            this.setState({DateType: false});
        }
    }
    PeopleCountChange(event){

        if (event.target.checked){

            this.setState({PeopleCount: false});
        }
        else{
            this.setState({PeopleCount: true});

        }
}
    ageChange(event){
        if (event.target.checked){
            this.setState({ageany: false});
        }
        else{
            this.setState({ageany: true});

        }
    }

    Map(){
        let myMap;
        myMap = new ymaps.Map("map", {
            center: [59.93863, 30.31413],
            zoom: 11
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });

        // Обработка события, возникающего при щелчке
        // левой кнопкой мыши в любой точке карты.
        // При возникновении такого события откроем балун.
        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                var coords = e.get('coords');
                var names = [];

                ymaps.geocode(coords).then(function (res) {

                    // Переберём все найденные результаты и
                    // запишем имена найденный объектов в массив names.
                    res.geoObjects.each(function (obj) {
                        names.push(obj.properties.get('name'));

                    });
                    myMap.balloon.open(coords, {
                        contentHeader: names[0],
                        contentBody:'<p>Ваше Место!</p>'+
                        '<p>Здесь будет событие</p>'
                    })
                    // Добавим на карту метку в точку, по координатам
                    // которой запрашивали обратное геокодирование.

                });

                this.setState({coordiantes: coords})
            }
            else {
                myMap.balloon.close();
            }
        }.bind(this));

        myMap.events.add('contextmenu', function (e) {
            myMap.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
        });

        // Скрываем хинт при открытии балуна.
        myMap.events.add('balloonopen', function (e) {
            myMap.hint.close();
        })

        // Обработка события, возникающего при щелчке
        // правой кнопки мыши в любой точке карты.
        // При возникновении такого события покажем всплывающую подсказку
        // в точке щелчка.

    }
    render(){


        return (


            <div className="content">
                <div className="CreateEventForm">
                   <p className="formcaption"> Создание вашего объявления</p>
                    <form action="/SendEvent" method="POST" encType="multipart/form-data">
                        <input type='hidden' id='NBID' name='NBID' value={this.props.NBID} />
                        <div className="formgroupinline justyfied">
                        <FormGroup controlId="formControls" className="shortfieldgroup">
                            <ControlLabel >Название*</ControlLabel>
                            <FormControl type="text" name="NameofEvent" required
                                         placeholder="Введите название"/>
                            <HelpBlock>Кратко опишите суть события</HelpBlock>
                        </FormGroup>
                        <FormGroup className="shortfieldgroup" controlId="formControlsSelect">
                            <ControlLabel>Категория*</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" className="FixHeigToSelect" name="SelectedCategory" required>
                                <option value="Прогулка">Прогулка</option>
                                <option value="Культурное">Культурное</option>
                                <option value="Активный отдых">Активный отдых</option>
                                <option value="Кафе">Кафе</option>
                                <option value="Ночной клуб">Ночной клуб</option>
                                <option value="Посиделки">Посиделки</option>
                            </FormControl>
                            <HelpBlock>Выберите тематику мероприятия</HelpBlock>
                        </FormGroup>
                        </div>
                        <div className="formgroupinline1">
                            <FormGroup   controlId="formControlsTextarea" className="shortfieldgroup">
                                <ControlLabel>Подробности</ControlLabel>
                                <FormControl  componentClass="textarea" placeholder="Опишите детали мероприятия" name="EventDescription"/>
                                <HelpBlock>Расскажите все о чем должен знать тот, кого вы ищете</HelpBlock>
                            </FormGroup>
                            <FormGroup controlId="formControls" className="shortfieldgroup EventFromTime">
                                <ControlLabel> Изображение </ControlLabel>
                                <div className="eventimgprewblock">
                                    <img id="blah" src="/images/200.jpg" alt="your image" />
                                </div>
                                <label htmlFor="imgInp" className="custom-file-upload">
                                    <i className="fa fa-cloud-upload"></i> Загрузить изображение
                                </label>
                                <input id="imgInp" type="file" name="EventPhoto"  onChange={this.changePhotoFile}/>
                                <FormControl type="url" placeholder="Или вставьте url изображения (Оставтье пустым если вы загрузили свое изображение)" name="EventURL" onChange={this.changePhotoUrl}/>
                                <HelpBlock>Добавьте изображение по теме</HelpBlock>
                            </FormGroup>
                        </div>
                        <FormGroup controlId="formControls">
                            <ControlLabel> Местоположение </ControlLabel>
                            <div className="mapFormBOss">
                                <div id="map" ></div>
                            </div>
                            <input type='hidden'  name='MapLocation' value={this.state.coordiantes} />
                            <HelpBlock>Укажите примерное место проведения события</HelpBlock>
                        </FormGroup>

                        <div className="formgroupinline">
                            <div className="shortfieldgroup ">
                        <div className="formgroupinline" >
                            <ControlLabel> Дата </ControlLabel>
                            <input id="cb3" className="tgl tgl-flat"  type="checkbox" onChange={this.DateChange} />
                            <label className="tgl-btn" htmlFor = "cb3"/>
                             <ControlLabel> несколько дней </ControlLabel>
                        </div>
                                {!this.state.DateType &&
                            <FormGroup className="formgroupinline" controlId="formControls" >
                                <FormControl type="date" name="SoloDate" min={curDate()} defaultValue={curDate()}  required/>
                            </FormGroup>}
                            {this.state.DateType &&
                            <FormGroup className="formgroupinline" controlId="formControls">
                                <p>C</p>
                                <FormControl type="date" name="CoupleDateStart" min={curDate()} defaultValue={curDate()} required/>
                                <p>по</p>
                                <FormControl type="date" name="CoupleDateEnd" min={curDate()} required/>
                            </FormGroup>}

                            </div>
                       <div className="EventFromTime">
                            <ControlLabel> Время </ControlLabel>
                        <FormGroup className="formgroupinline" controlId="formControls">
                            <p>c</p>
                            <FormControl type="time" name="CoupleTimeStart" defaultValue="12:00" required />
                            <p>до</p>
                            <FormControl type="time" name="CoupleTimeEnd"  />
                        </FormGroup>
                       </div>
                        </div>
                        <div className="formgroupinline">
                        <div  className="shortfieldgroup ">
                            <ControlLabel> Количество участников</ControlLabel>
                        <FormGroup className="formgroupinline" controlId="formControls">
                                <ControlLabel> неограниченно </ControlLabel>
                            <input id="cb4" className="tgl tgl-flat"  type = "checkbox" onChange={this.PeopleCountChange} name="PeopleCountCheckBox" value="1"/>
                                <label className="tgl-btn" htmlFor= "cb4"/>
                            {!this.state.PeopleCount && <FormControl type="number" name="PeopleCount"/>} {this.state.PeopleCount && <FormControl type="number" disabled/>}
                        </FormGroup>
                        </div>
                        <FormGroup controlId="formControls" className="EventFromTime">
                            <ControlLabel> Пол </ControlLabel>
                            <div className="button-wrap">
                                <input className="hidden radio-label" type="radio" name="Sex" id="yes-button" defaultChecked="checked" value="Любой"/>
                                <label className="button-label" htmlFor="yes-button">
                                    <h1>любой</h1>
                                </label>
                                <input className="hidden radio-label" type="radio" name="Sex" id="no-button" value="Мужской"/>
                                <label className="button-label" htmlFor="no-button">
                                    <h1>мужской</h1>
                                </label>
                                <input className="hidden radio-label" type="radio" name="Sex" id="maybe-button" value="Женский"/>
                                <label className="button-label" htmlFor="maybe-button">
                                    <h1>женский</h1>
                                </label>
                            </div>
                        </FormGroup>
                        </div>
                        <FormGroup className="formgroupinline justyfied" controlId="formControls">
                            <ControlLabel> Возраст любой</ControlLabel>
                            <input id="cb5" className="tgl tgl-flat"  type = "checkbox" onChange={this.ageChange} name="AgeType" value="1"/>
                                <label className="tgl-btn" htmlFor = "cb5"/>
                           <div className="rangeslider">{this.state.ageany && <div className="agerangeslidercover"></div>}<input type="text" id="example_id" name="example_name" value="" /></div>
                        </FormGroup>
                        <FormGroup className="shortfieldgroup " controlId="formControls">
                            <ControlLabel> Ссылка </ControlLabel>
                            <FormControl type="url" name="URLtoEvent"/>
                            <HelpBlock>Если есть, добавите ссылку на описание события</HelpBlock>
                        </FormGroup>


                        <Button className="formcaption"  type="submit"  name="submit">
                            Создать
                        </Button>

                    </form>
                </div>
            </div>
        );
    }
};

function FieldGroup({ id, label, help, props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                type="text"
                value="text"
                placeholder="Enter text"
            />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}
