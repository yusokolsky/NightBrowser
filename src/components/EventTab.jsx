import React from 'react'
import { Link } from 'react-router';

export default class EventTab extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            EventsData: [],
            UserData:{}
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.LoadDataFrD = this.LoadDataFrD.bind(this);

    }
    componentWillMount(){


        this.LoadDataFrD();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({UserData: nextProps.UserData, EventsData: []})
        if (nextProps.UserData.UserEvents){
            let arrayvar = this.state.EventsData.slice()
            let lenghtfrd = nextProps.UserData.UserEvents.length;
            let UserDataHere= nextProps.UserData;

            for (let i =0;i<lenghtfrd;i++)
                $.when( $.ajax({
                    url: "/GetEventData/",
                    type: 'POST',
                    contentType:'application/json',
                    data: JSON.stringify({id: UserDataHere.UserEvents[i].EventID}),
                    dataType:'json'
                }) ).then(function( data, textStatus, jqXHR ) {
                    data.Status =UserDataHere.UserEvents[i].Status;
                    arrayvar.push(data)
                    if (lenghtfrd == arrayvar.length) {
                        this.setState({EventsData: arrayvar})
                    }

                }.bind(this));
        }
    }
    componentDidMount(){

    }
    LoadDataFrD(){
        this.setState({UserData: this.props.UserData})

        if (this.props.UserData.UserEvents){

            let arrayvar = this.state.EventsData.slice()
            let lenghtfrd = this.props.UserData.UserEvents.length;
            let UserDataHere= this.props.UserData;


            for (let i =0;i<lenghtfrd;i++)
                $.when( $.ajax({
                    url: "/GetEventData/",
                    type: 'POST',
                    contentType:'application/json',
                    data: JSON.stringify({id: UserDataHere.UserEvents[i].EventID}),
                    dataType:'json'
                }) ).then(function( data, textStatus, jqXHR ) {
                    data.Status =UserDataHere.UserEvents[i].Status;
                    arrayvar.push(data)
                    if (lenghtfrd == arrayvar.length) {
                        this.setState({EventsData: arrayvar})
                    }

                }.bind(this));
        }
    }
    LoadCarusuel(){

    }
    render() {

        let Events = this.state.EventsData.filter(function(Event) {
            var now=moment();
            if ((Event.Status == 1) && ((Event.SoloDate && (now.isAfter( moment(Event.SoloDate, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))) ||(Event.CoupleDateEnd && (now.isAfter(moment(Event.CoupleDateEnd, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))))) {
                return true}
            else return false
        }.bind(this));
        let Events1 = this.state.EventsData.filter(function(Event) {
            var now=moment();
            if ((Event.Status == 1) && ((Event.SoloDate && (now.isAfter( moment(Event.SoloDate, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))) ||(Event.CoupleDateEnd && (now.isAfter(moment(Event.CoupleDateEnd, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))))) {
                return false}
            else return true
        }.bind(this));
        let ActiveEvent = Events.map(function(Event) {
            if (!Event.PhotoURL){
                Event.PhotoURL='../images/LogoProfile.jpg'

            }
            if (!Event.CreatorPhoto){
                Event.CreatorPhoto='../images/LogoProfile.jpg'
            }
                let divStyle1 = {
                    backgroundImage: 'url(' + Event.CreatorPhoto + ')'
                }
            let countGoing=0
            for (let i=0;i<Event.Peoples.length;i++){
                if (Event.Peoples[i].Status==1){
                    countGoing++;
                }
            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'
            }

            return (
                    <Link to={`/Event/${Event.EventId}`}>
                    <div  className="eventblock" key={Event.EventId} style={divStyle}>
                            <p className="eventblocktoptext">
                                    {Event.Name}
                                </p>
                                    <p className="eventblockdate">
                                    {Event.SoloDate} {Event.CoupleDateStart}
                                </p>
                        <div className="eventblockbottom">
                            <p className="eventblockcreator"> {countGoing} {Event.PeopleCount!=0 && <span>/{Event.PeopleCount}</span>} участников </p>

                            <div className="eventblockcreator"> <div className="userpic userpic_xs" style={divStyle1}></div>Организует: {Event.CreatorNameF}</div>
                        </div>



                       {/* <p className="eventblockgeo">
                            <i className="fa fa-map-marker" aria-hidden="true"></i> {Event.Location}
                        </p>*/}


                    </div>
                    </Link>

                )

        }.bind(this));

        let OldEvents = Events1.map(function(Event) {
            if (!Event.PhotoURL){
                Event.PhotoURL='../images/LogoProfile.jpg'

            }
            if (!Event.CreatorPhoto){
                Event.CreatorPhoto='../images/LogoProfile.jpg'
            }
            let divStyle1 = {
                backgroundImage: 'url(' + Event.CreatorPhoto + ')'
            }

            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'
            }
            let countGoing=0
            for (let i=0;i<Event.Peoples.length;i++){
                if (Event.Peoples[i].Status==1){
                    countGoing++;
                }
            }
              return (

                    <div  className="eventblock" key={Event.EventId} style={divStyle}>
                        <div className="eventblocktop">
                            <div className="eventblocktoptext">
                                <Link to={`/Event/${Event.EventId}`}>
                                    <p className="evenblockttitle">
                                        {Event.Name}
                                    </p></Link>
                                <p className="eventblockdate">
                                    {Event.SoloDate} {Event.CoupleDateStart} {Event.CoupleTimeStart}
                                </p>
                            </div>
                        </div>
                        {/* <p className="eventblockgeo">
                         <i className="fa fa-map-marker" aria-hidden="true"></i> {Event.Location}
                         </p>*/}
                        <div className="eventblockbottom">
                            <p className="eventblockcreator"> {countGoing} {Event.PeopleCount!=0 && <span>/{Event.PeopleCount}</span>} участников </p>

                            <div className="eventblockcreator"> <div className="userpic userpic_xs" style={divStyle1}></div>Организует: {Event.CreatorNameF}</div>
                        </div>

                    </div>

                )

        }.bind(this));


        if(ActiveEvent!=0 &&(ActiveEvent.length==this.state.EventsData.length))  ///добавить длинну потом
        {
            setTimeout(function () {

                $('.blocksarea').slick({
                dots: true,
                infinite: false,
                speed: 300,
                slidesToShow: 4,
                variableWidth: true,
                slidesToScroll: 4,

                    responsive: [
                        {
                            breakpoint: 1520,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                infinite: true,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 950,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        },
                        {
                            breakpoint: 614,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                        // You can unslick at a given breakpoint now by adding:
                        // settings: "unslick"
                        // instead of a settings object
                    ]


                });}, 10);


        }
        let showOldEvents =false
        if (OldEvents){
            showOldEvents=true;
        }else{
            showOldEvents=false;
        }
        console.log(showOldEvents)
        let showEvents=false;
        if (ActiveEvent){
            showEvents=true;
        }else{
            showEvents=false;
        }

        return(

            <div className="eventsprew">
                {showEvents &&
                <section className="blocksarea">
                    {ActiveEvent}

                </section>
                }
                {showOldEvents && <div >

                    <p className="singletab">
                        Прошедшие
                    </p>
                    <hr className="fullhr"/>
                    <div className="oldevents">
                        {OldEvents}
                    </div>
                </div>}
            </div>


        )

    }

};

