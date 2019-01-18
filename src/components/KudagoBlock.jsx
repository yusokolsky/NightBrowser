import React from 'react'
import { Link } from 'react-router';

export default class KudagoBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
           events:[],
            loading:true
        }
    }
    componentWillMount() {
        $.when( $.ajax({
            url: "/GetKudagoData/",
            type: 'POST',
            contentType:'application/json',
            dataType:'json'
        }) ).then(function( data, textStatus, jqXHR ) {

            this.setState({events: data,loading:false})

        }.bind(this));



    }
    componentDidMount() {

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
        let FindResultsComponents = this.state.events.results.map(function(EventK) {
           if (EventK.event.daterange==null){
               EventK.event.daterange=false;
           }
           console.log(EventK.event)
            if (EventK.event.first_image.source.link==null){
                EventK.event.first_image.source.link='';
            }
            return (<a href={EventK.event.first_image.source.link}>
                <div className="KudaGoEvent" key={EventK.event.id}><hr/>
                    <div className="KudaGoEventPhotocont"> <img className="KudaGoEventPhoto" src={EventK.event.first_image.image}/></div>
                    <h1 className="KudaGoEventTitle">{EventK.event.title}</h1>{(EventK.event.daterange.start_time || EventK.event.daterange) && <div>Время начала {EventK.event.daterange.start_time} </div>}<br/>
                    <div className="KudaGoEventDesc" dangerouslySetInnerHTML={{__html: EventK.event.description}}></div>
                </div></a>
            );
        }.bind(this));
        return (
        <div >
            {FindResultsComponents}
        </div>
        );
    }}
};