import React from 'react'
export default class Footer extends React.Component{
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }

    render(){

        return (<div><div className="footerBefore"></div>
            <div className="footer">
    <div className="footercontent">
       {/* <div className="footerleft">
            API<br />
            <img src="/images/KudagoLogo.png" width="73px" height="90px" />
        </div>*/}
        <div className="footercenter">
            {/*<div className="footerlogo"></div>
             <div className="socialLinks">
                <img src="/images/vklogo.png" width="30px" height="30px" />
                <img src="/images/vklogo.png" width="30px" height="30px" />
                <img src="/images/vklogo.png" width="30px" height="30px" />
            </div>*/}
            <div className="footermenu">
                <a href="">Рекламодателям</a>
                <a href="">Контакты</a>
            </div>
            <div className="copyright">
                NightBrowser &copy; 2017
            </div>
        </div>
       {/* <div className="footerright">
            <div className="footermenu">
                <a href="">Рекламодателям</a>
                <a href="">Партнерам</a>
                <a href="">Контакты</a>
            </div>
        </div>*/}
    </div>
            </div>
</div>
        );
    }
};