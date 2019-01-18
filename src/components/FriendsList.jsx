import React from 'react'
import { Link } from 'react-router';
import  style from './css/FriendsTab.css';
export default class FriendsList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            FriendsData: [],
            UserData:{}
        };
        this.AcceptFriend = this.AcceptFriend.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.LoadDataFrD = this.LoadDataFrD.bind(this);

    }

    componentWillMount(){

            this.setState({UserData: this.props.UserData})
        console.log(this.props.UserData.FriendList)
        this.LoadDataFrD();



    }
    LoadDataFrD(){
        if(this.props.UserData.FriendList) {
            let arrayvar = this.state.FriendsData.slice()
            let lenghtfrd = this.props.UserData.FriendList.length;
            let UserDataHere = this.state.UserData;


            for (let i = 0; i < lenghtfrd; i++)
                $.when($.ajax({
                    url: "/GetUser/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({id: this.props.UserData.FriendList[i].FriendNBID}),
                    dataType: 'json'
                })).then(function (data, textStatus, jqXHR) {
                    data.Status = this.props.UserData.FriendList[i].Status;
                    data.FriendsSince = this.props.UserData.FriendList[i].FriendsSince;

                    arrayvar.push(data)
                    //console.log(arrayvar)
                    //console.log(lenghtfrd)
                    if (lenghtfrd == arrayvar.length) {
                        this.setState({FriendsData: arrayvar})
                    }

                }.bind(this));
        }
    }
    AcceptFriend(key){
        id=getCookie("UserId");
        let time=curDateandTime();
        let TempFDBIG=[];
        let tempFD={};
        ajaxReq("/AcceptFriendRequest/", {Userid:id,FriendID:key.NBID,FriendsSince:time}, function(result){
            if(result){
                for(var i=0;i<this.state.FriendsData.length;i++){

                    tempFD=this.state.FriendsData[i]
                    if(this.state.FriendsData[i].NBID==key.NBID){
                        tempFD.Status="0";
                        TempFDBIG.push(tempFD)
                    }else{
                        TempFDBIG.push(tempFD)
                    }
                }
                this.setState({FriendsData: TempFDBIG})
            }
        }.bind(this));

    }
    DeleteFriend(key){
        //alertR
        id=getCookie("UserId");
        let TempFDBIG=[];
        let tempFD={};
        ajaxReq("/DeleteFriend/", {Userid:id,FriendID:key.NBID}, function(result){
            if(result){
                for(var i=0;i<this.state.FriendsData.length;i++){

                    if(this.state.FriendsData[i].NBID==key.NBID){
                        tempFD=this.state.FriendsData[i]

                        tempFD.Status="2";
                    }else{
                        tempFD=this.state.FriendsData[i]
                        TempFDBIG.push(tempFD)
                    }
                }
                this.setState({FriendsData: TempFDBIG})
            }
        }.bind(this));

    }
    render() {
        let countZayav=0;
        console.log(this.state.FriendsData)
        let FriendComponentsIncoming = this.state.FriendsData.map(function(Friend) {
            if (!Friend.UsrPhotoBig){
                Friend.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Friend.UsrPhotoBig + ')'

            }
            if (Friend.Status == 1 ) {
                countZayav++;
                return (<div className="friendblock" key={Friend.NBID} style={divStyle}>

                        {/*<img className="imgFriendBlock" src={Friend.UsrPhotoBig} />*/}
                        <div className="friendtop">
                            <div className="leftPlusAdd"> <i className="far fa-plus-square"  onClick={() => this.AcceptFriend(Friend)} /></div>
                            <div className="rightMinusRemove"> <i className="far fa-minus-square" onClick={() => this.DeleteFriend(Friend)} /></div>
                        </div>
                        <Link to={`/User/${Friend.NBID}`} >
                            <div className="friendbottom">
                                <p className="FriendBottomBlockUserNames">{Friend.UsrFirstName} {Friend.UsrLastName}</p>
                                <p className="FriendBottomBlockUserInfo"><i className="fa fa-map-marker" aria-hidden="true" /> {Friend.UsrCity}</p>
                            </div>
                        </Link>  </div>
                )
            }
        }.bind(this));

        let FriendComponents = this.state.FriendsData.map(function(Friend) {
            if (!Friend.UsrPhotoBig){
                Friend.UsrPhotoBig='../images/LogoProfile.jpg'

            }
            let divStyle = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Friend.UsrPhotoBig + ')'
            }

            if (Friend.Status == 0) {

                return (<div className="friendblock" key={Friend.NBID} style={divStyle}>
                        <div className="friendtop">
                            {this.props.DisplayMessageTab && <i className="far fa-minus-square" onClick={() => this.DeleteFriend(Friend)} />}
                        </div>
                        <Link to={`/User/${Friend.NBID}`} >
                        <div className="friendbottom">
                            <p className="FriendBottomBlockUserNames">{Friend.UsrFirstName} {Friend.UsrLastName}</p>
                            <p className="FriendBottomBlockUserInfo"><i className="fa fa-map-marker" aria-hidden="true" /> {Friend.UsrCity}</p>
                        </div></Link>
                  </div>
                )
            }

        }.bind(this));
        let showIncoming
        if (countZayav>0){
            showIncoming=true;
        }else{
            showIncoming=false;

        }
        let FriendStyle
        if ((!this.props.DisplayMessageTab || !showIncoming)){
            FriendStyle="FriendArea1"
        }else
        {
            FriendStyle="FriendArea"
        }
        return <div className="friends">
            <div className={FriendStyle} >
                {FriendComponents}
            </div>
            {
                (this.props.DisplayMessageTab && showIncoming) &&
                <div className="FriendIncomingArea">
                    <div className="friendrequestscaption"> </div>
                    {FriendComponentsIncoming}
                </div>
            }
        </div>;

    }

};