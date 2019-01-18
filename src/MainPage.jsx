import React from 'react';
import Footer from './components/footer.jsx'
import Header from './components/Header.jsx'
import Content from './components/Content.jsx'
import Preview from './components/Preview.jsx'
import MetaTags from 'react-meta-tags';

export default class MainPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            FTON:false
        };
        this.onStart = this.onStart.bind(this);
    }
    componentWillMount() {
       //this.setState({FTON: checkFTON()});
    }
    onStart(){
      /*  createCookie("FirstTimeOrNot", "1", 300);
        this.setState({FTON: false});*/

    }

    render(){

        return (<div id="MainPage">
                <MetaTags>
                    <title>NightBrowser</title>
                    <meta name="description" content="Сайт для поиска новых друзей и событий" />
                    <meta property="og:title" content="NightBrowser" />
                    <meta property="og:image" content="images/fav.png" />
                </MetaTags>
               {/* {this.state.FTON && <Preview StartBut={this.onStart} />}*/}
                 <div><Header />
                      <Content/>
                     <Footer/></div>
                </div>

        );
    }
};
