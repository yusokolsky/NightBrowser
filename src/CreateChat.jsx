import React from 'react';

import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import CreateChatContent from './components/CreateChatContent.jsx'

export default class CreateChat extends React.Component{

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
                <CreateChatContent NBID={this.state.UserDataId}/>
                {/* <Footer/>*/}
            </div>

        );
    }
};
