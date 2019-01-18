import React from 'react'
import { Link } from 'react-router';
import { FormControl,Checkbox,Radio,FormGroup,ControlLabel,Button,HelpBlock } from'react-bootstrap';
import style from './css/SearchPageContnent.css'

export default class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            Events:[],
            EventsonMap:[],
            SearchEvents:[],
            myMap:{},
            OpenedStyle:{},
            Opened:false

        };
        this.Map = this.Map.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.Search = this.Search.bind(this);
        this.ClearFields = this.ClearFields.bind(this);
        this.getData = this.getData.bind(this);
        this.OpenFilters= this.OpenFilters.bind(this);
    }
    componentWillMount(){

        this.getData()

    }
    getData(){
        $.when( $.ajax({
            url: "/GetEventDataForSearch/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {
            this.setState({ Events:data});
                if(this.state.EventsonMap.length==0){
                    this.setState({ EventsonMap:data});
                }
        }.bind(this));
    }
    componentDidMount() {
        ymaps.ready(this.Map);

    }

    Search(){
        var $range = $("#example_id");
        var value = $range.prop("value").split(";");
        console.log(value[0])
        if(value[0]==""){
            value[0]="0";
            value[1]="100";
        }
        for(let i=0;i<this.state.Events.length;i++){
            if((document.getElementById("selectCat").value==this.state.Events[i].Category )|| (document.getElementById("selectCat").value=="0")){
                //console.log(this.state.Events[i])
               // console.log(this.state.Events[i].Category)
                if((this.state.Events[i].date[0]==document.getElementById("date").value) || (this.state.Events[i].date[0]<=document.getElementById("date").value && this.state.Events[i].date[1]>=document.getElementById("date").value)|| (document.getElementById("date").value=="")){
                    // console.log(this.state.Events[i])
                    // console.log(this.state.Events[i].date)

                    if((this.state.Events[i].Sex==$('input[name=Sex]:checked').val()) ||($('input[name=Sex]:checked').val()=="Любой") ||(this.state.Events[i].Sex=="Любой")){
                        //console.log(this.state.Events[i])
                            //console.log(this.state.Events[i].Sex)
                        let age=(this.state.Events[i].AgeRange+'').split(";");
                        console.log(age)
                        console.log(value)
                        console.log((parseFloat(age[0])<=value[0] && parseFloat(age[1])>=value[1]))
                            if((parseFloat(age[0]).between(value[0],value[1]) || parseFloat(age[1]).between(value[0],value[1])) || (parseFloat(age[0])<=value[0] && parseFloat(age[1])>=value[1]) || age[0]==0 || (value[0]==0 && value[1]==100)   ){


                                console.log("succsess")
                        }else{
                            delete this.state.Events[i]
                        }
                    }else{
                        delete this.state.Events[i]
                    }
                }else{
                    delete this.state.Events[i]
                }
            }else{
                delete this.state.Events[i]
            }
        }


        this.state.myMap.geoObjects.removeAll();
        let myClusterer = new ymaps.Clusterer();
        this.setState({ EventsonMap:this.state.Events});
        this.state.Events.map(function(Event) {
            let myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                balloonContentHeader: Event.Name,
                balloonContentBody: "Категория: "+Event.Category+"<br/><Link to={'/Event/"+Event.EventId+"'} class='stupiahref'> Открыть</Link>",
                hintContent: Event.Name
            });

            myClusterer.add(myPlacemark);

        }.bind(this));

        this.state.myMap.geoObjects.add(myClusterer);

        this.getData()
    }

    Map(){

        this.state.myMap = new ymaps.Map("map", {
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
                balloonContentBody: "Категория: "+Event.Category+"<br/><Link to={'/Event/"+Event.EventId+"'} class='stupiahref'> Открыть</Link>",
                hintContent: Event.Name
            });


            myClusterer.add(myPlacemark);

        }.bind(this));
        this.state.myMap.geoObjects.add(myClusterer);
        this.setState({ loading:false});
    }
    ClearFields(){
        document.getElementById("selectCat").value="0";
        document.getElementById("date").value="";
        document.getElementById("yes-button").checked =true;
        var slider = $("#example_id").data("ionRangeSlider");
        slider.reset();
        this.state.myMap.geoObjects.removeAll();
        let myClusterer = new ymaps.Clusterer();
        this.setState({ EventsonMap:this.state.Events});
        this.state.Events.map(function(Event) {
            let myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                balloonContentHeader: Event.Name,
                balloonContentBody: "Категория: "+Event.Category+"<br/><Link to={'/Event/"+Event.EventId+"'} class='stupiahref'> Открыть</Link>",
                hintContent: Event.Name
            });

            myClusterer.add(myPlacemark);

        }.bind(this));
        this.state.myMap.geoObjects.add(myClusterer);
    }
    OpenFilters(){
        if(!this.state.Opened) {
            let OpenedStyles = {
                width: '100%', height: '100%', borderRadius: '20px', cursor: 'unset',backgroundColor:"rgba(24, 23, 23,0.8)"
            }
            this.setState({
                Opened: true, OpenedStyle: OpenedStyles
            }, () => {
                $("#example_id").ionRangeSlider({
                    hide_min_max: true,
                    keyboard: true,
                    min: 0,
                    max: 100,
                    from: 0,
                    to: 100,
                    type: 'double',
                    step: 1,
                    grid: true
                });
                console.log($("#example_id"))
            });

        }
        else{
            let OpenedStyles = {

            }
            this.setState({Opened: false, OpenedStyle: OpenedStyles});
        }
    }
    render(){
        return (
            <div className="contentSearchPage">
                <div className="allfilters">
                    <div className="EventsLabelSP">Список событий</div>
                    <div className="mapfilter">
                        <div id="map"></div>
                        <div className="FiltersAndSearchOpen"  style={this.state.OpenedStyle}>
                            {!this.state.Opened && <div className="FiltersAndSearchOpenText" onClick={this.OpenFilters}><i className="fas fa-filter fa-border fa-lg" data-fa-transform="shrink-4"/>  Поиск и фильтры</div>}
                            {this.state.Opened &&<div> <div className="FiltersAndSearchOpenText" onClick={this.OpenFilters}><i className="fas fa-times fa-lg "/><div className="CloseLabel">  Назад к карте</div></div>
                                <div className="filters">
                                    <FormGroup >
                                        <ControlLabel>Категория</ControlLabel>
                                        <FormControl componentClass="select" placeholder="select"  name="SelectedCategory" onChange={this.Search} required id="selectCat" >
                                            <option value="0" className="lubaya">Любая</option>
                                            <option value="Прогулка">Прогулка</option>
                                            <option value="Культурное">Культурное</option>
                                            <option value="Активный отдых">Активный отдых</option>
                                            <option value="Кафе">Кафе</option>
                                            <option value="Ночной клуб">Ночной клуб</option>
                                            <option value="Посиделки">Посиделки</option>
                                        </FormControl>
                                    </FormGroup>
                                    <FormGroup className="formgroupinline" >
                                        <ControlLabel> День </ControlLabel>
                                        <FormControl type="date" id="date" name="date" onChange={this.Search} min={curDate()}/>
                                    </FormGroup>

                                    <FormGroup  >
                                        <ControlLabel> Пол </ControlLabel>
                                        <div className="button-wrap">
                                            <input className="hidden radio-label" type="radio" name="Sex" id="yes-button" defaultChecked="checked" onChange={this.Search} value="Любой"/>
                                            <label className="button-label" htmlFor="yes-button">
                                                <h1>любой</h1>
                                            </label>
                                            <input className="hidden radio-label" type="radio" name="Sex" id="no-button" onChange={this.Search} value="Мужской"/>
                                            <label className="button-label" htmlFor="no-button">
                                                <h1>мужской</h1>
                                            </label>
                                            <input className="hidden radio-label" type="radio" name="Sex" id="maybe-button" onChange={this.Search} value="Женский"/>
                                            <label className="button-label" htmlFor="maybe-button">
                                                <h1>женский</h1>
                                            </label>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="formgroupinline justyfied" >
                                        <ControlLabel> Возраст </ControlLabel>
                                        <div className="rangeslider"><input type="text" id="example_id" name="example_name" onChange={this.Search} value="" /></div>
                                    </FormGroup>
                                    <Button className="formcaption" onClick={this.ClearFields}  name="submit">
                                        Сбросить фильтры
                                    </Button>
                                    <Button className="formcaption1"  onClick={this.Search}   name="submit">
                                        Найти
                                    </Button>
                                </div>
                            </div>}

                            </div>
                    </div>

                    {/**/}

                </div>
                <div className="searcheventresult">
                   <SearchResult Results={this.state.EventsonMap} myMap={this.state.myMap} MapGeo={this.state.MapGeo}/>

                </div>
            </div>
        );
    }
};


export class SearchResult extends React.Component{
    constructor(props) {
        super(props);


    }

    render() {
        let i=0;

        let FindResultsComponents = this.props.Results.map(function(Event) {

            if (!Event.PhotoURL){
                Event.PhotoURL='../images/m1000x1000.jpg'

            }
            let divStyle = {
                background: 'url(' + Event.PhotoURL + ') no-repeat center',
                backgroundSize:'100% auto'
            }
            let age=(Event.AgeRange+'').split(";");
            return ( <Link to={`/Event/${Event.EventId}`} >
                <div className="eventinresult">

                        <div className="eventimg" style={divStyle}></div>
                    <div className="eventdescbysearch">
                        <div className="flexcont">
                            <div className="eventleft">
                                <p className="EventGreenText"> {Event.Name}	</p>
                                <p className="EventGreenTextDate">{Event.date[0]}{Event.date[1] &&<span> до {Event.date[1]}</span>}</p>
                                <p className="EventGreenTextPar"> <span className="GreenT">{Event.PeopleCount}</span> участников</p>
                            </div>
                            <div className="eventright">
                                <p className="eventrightCreator">Создатель: <span className="GreenT"> {Event.CreatorNameF} {Event.CreatorNameS}</span></p>

                                {age[0]!=0 && <p className="eventrightCreator">Возраст : <span className="GreenT">{age[0]} - {age[1]}</span></p>}
                                {Event.Sex && <p className="eventrightCreator"> {Event.Sex}  пол</p>}
                            </div>
                        </div>
                    </div>
                </div></Link>
            );
        }.bind(this));
        return <div>{FindResultsComponents}</div>;

    }

};