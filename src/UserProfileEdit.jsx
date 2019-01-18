import React from 'react';

import ReactDOM from 'react-dom';

import { Router, Route, Redirect, hashHistory ,browserHistory} from 'react-router';

import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import Content from './components/ProfileContentEdit.jsx'

const Loading = () => <div className="loadingState">        <div className="sk-folding-cube" >
    <div className="sk-cube1 sk-cube"></div>
    <div className="sk-cube2 sk-cube"></div>
    <div className="sk-cube4 sk-cube"></div>
    <div className="sk-cube3 sk-cube"></div>
</div>
    <div className="loadinglabel">Загружаю...</div></div>;
export default class UserProfileEdit extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            Loading:true,
            UserData: {}

        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.load = this.load.bind(this);
    }

    componentWillMount() {
        checkCookie(this.load)



    }
    load(test){
        if(test!="")
        {
            fetch(`/UserData/${this.props.params.id}/edit`).then(response => response.json()).then(UserData => {

                this.setState({ UserData });
                id=getCookie("UserId");
                if (id!=this.state.UserData.NBID){
                    window.location.replace("/");
                }else{
                    this.setState({Loading: false});
                }
            })
        }
        else{
            window.location.replace("/");
        }
    }

    render(){
        if (this.state.Loading ==true)
        {
            return <Loading />
        }
        else{
            return (
                <div>
                    <Header/>
                    <Content UserData={this.state.UserData}/>
                    {/* <Footer/>*/}
                </div>
            )}
    }
};
