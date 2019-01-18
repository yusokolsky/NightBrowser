import React from 'react';
import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import Profile from './components/Profile.jsx'
import { Link} from 'react-router';
import MetaTags from 'react-meta-tags';
import {ReactTitle} from 'react-meta-tags';

export default class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Loading:true,
            UserData: {},
            prevId: ''

        };
        fetch(`/UserData/${this.props.params.id}`).then(response => response.json()).then(UserData => {
            if (UserData === true) {
                window.location.replace("/");
            }
            else
                this.setState({UserData});    // all the attributes of the bug are top level state items
            this.setState({Loading: false});
        });
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

        fetch(`/UserData/${nextProps.params.id}`).then(response => response.json()).then(UserData => {
            if (UserData === true) {
                window.location.replace("/");
            }
            else {
                this.setState({UserData});    // all the attributes of the bug are top level state items
                console.log(this.state.UserData)
            }});
    }

    componentDidUpdate(props) {

    }


    render() {

        let metaTitle =this.state.UserData.UsrFirstName + ' ' + this.state.UserData.UsrLastName+' NightBrowser';
        return (
            <div>
                <MetaTags>
                    <ReactTitle title={metaTitle}/>
                    <meta name="description" content={this.state.UserData.UsrDesc}/>
                    <meta property="og:title" content={metaTitle}/>
                    <meta property="og:image" content={this.state.UserData.UsrPhotoBig}/>
                </MetaTags>
                <Header/>
                <Profile UserData={this.state.UserData}/>
                {/* <Footer/>*/}
            </div>
        )

}
};

