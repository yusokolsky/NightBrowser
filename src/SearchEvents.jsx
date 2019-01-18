import React from 'react';

import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import Content from './components/ContentSearchPage.jsx'
import MetaTags from 'react-meta-tags';
import {ReactTitle} from 'react-meta-tags';
export default class SearchPage extends React.Component{

    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }

    render(){
        return (<div >
                <MetaTags>
                    <ReactTitle title="Поиск событий NightBrowser"/>
                    <meta name="description" content="Поиск событий по заданым параметрам " />
                    <meta property="og:title" content="Поиск событий NightBrowser"/>
                    <meta property="og:image" content="images/fav.png" />
                </MetaTags>
                <Header />
                <Content/>
                {/* <Footer/>*/}
                </div>

        );
    }
};
