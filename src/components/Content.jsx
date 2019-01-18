import React from 'react'
import BarAndModules from './BarAndModules.jsx'
import EventsBlockOnMainPage from './EventsBlockOnMainPage.jsx'
import KudagoBlock from './KudagoBlock.jsx'
import { Link } from 'react-router';

export default class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            Loading:true,
        }

    }
    componentDidMount() {

    }

    render(){

            return (
                <div className="content">
                      <EventsBlockOnMainPage/>

                      <div id="BarAndModules">

                        {/*<BarAndModules/>*/}
                    </div>
                   {/* <div className="Novosti">
                        События в Санкт-Петербурге сегодня: <br/>
                        <KudagoBlock/>
                    </div>*/}
                </div>
            );}
};