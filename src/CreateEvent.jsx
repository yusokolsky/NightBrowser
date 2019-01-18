import React from 'react';

import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import CreateEventContent from './components/CreateEventContent.jsx'

export default class CreateEvent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            UserDataId: 0
        }
        ;
        this.load = this.load.bind(this);
    }
    componentWillMount() {
        checkCookie(this.load)

    }
    load(test){
        if(test!="")
        {
            this.setState({Loading: false,UserDataId:id});
        }else{
            window.location.replace("/");
        }
    }
    componentDidMount() {

    }

    render(){
        return (<div id="MainPage">
                <Header />
                <CreateEventContent NBID={this.state.UserDataId}/>

            </div>

        );
    }
};
