import React from 'react';

import MetaTags from 'react-meta-tags';
import {ReactTitle} from 'react-meta-tags';
import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import Content from './components/EventContent.jsx'

export default class EventPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            Loading:true,
            EventData: {}

        };

    }
    componentWillMount() {
        fetch(`/EventData/${this.props.params.id}`).then(response => response.json()).then(EventData => {
            if(EventData===true){
                window.location.replace("/");
            }
            else
                this.setState({ EventData });    // all the attributes of the bug are top level state items
            this.setState({Loading: false});
        });
    }

    render(){
        if (this.state.Loading ==true)
        {
            return <div>...</div>
        }
        else{
            let metaTitle='NightBrowser-'+this.state.EventData.Name;

            return (
                <div>
                    <MetaTags>
                        <ReactTitle title={metaTitle}/>
                        <meta name="description" content={this.state.EventData.Description} />
                        <meta property="og:title" content={metaTitle} />
                        <meta property="og:image" content="images/fav.png" />
                    </MetaTags>

                <Header/>
                <Content EventData={this.state.EventData}/>
                {/* <Footer/>*/}
            </div>
        )}
    }
};
