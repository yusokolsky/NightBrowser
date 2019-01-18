import React from 'react'
import  style from './css/CreateChatContent.css';

import { FormControl,Checkbox,Radio,FormGroup,ControlLabel,Button,HelpBlock,InputGroup } from'react-bootstrap';
export default class CreateChatContent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            DateType: false,
            PeopleCount:true,
            ageany:true,
            coordiantes:[59.93863, 30.31413]
        };

    }
    componentDidMount() {


    }
    changePhotoUrl(event){
        $('#blah').attr('src',event.target.value );
    }
    changePhotoFile(event){
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }

    }



    render(){


        return (


            <div className="content">
                <div className="CreateChatContent">

                   <p className="fontfix2"> Создание чата</p>
                    <div className="CreateChatContentLeft">
                    <form action="/SendChat" method="POST" encType="multipart/form-data">
                        <input type='hidden' id='NBID' name='NBID' value={this.props.NBID} />
                        <FormGroup className="CreateChatFormName">
                            <div className="CreateChatFormCaption ">Название чата:</div>
                            <InputGroup className="FlexFixx">
                                <FormControl type="text" name="ChatName" className="FontFix"/>
                            </InputGroup>
                        </FormGroup>

                            <FormGroup   controlId="formControlsTextarea" className="CreateChatFormName">
                                <div className="CreateChatFormCaption ">Описание:</div>
                                <InputGroup className="FlexFixx FixMarg">
                                <FormControl  componentClass="textarea" placeholder="Опишите чат" name="ChatDescription" className="ChatDescription"/>
                                </InputGroup>
                            </FormGroup>
                        <FormGroup   controlId="formControls" className="CreateChatFormName CenterContentFix">
                            <InputGroup>
                            <div className="CreateChateventimgprewblock">
                                Изображение чата
                                <img id="blah" src="/images/200.png" alt="your image" />
                            </div>

                                <label htmlFor="imgInp" className="custom-photo-upload">
                                    <i className="fa fa-cloud-upload-alt" /> Загрузить изображение
                                </label>

                                <input id="imgInp" type="file" name="ChatPhoto"  onChange={this.changePhotoFile}/>
                                <FormControl type="url" className="FontFix" placeholder="Или вставьте url изображения (Оставтье пустым если вы загрузили свое изображение)" name="PhotoURL" onChange={this.changePhotoUrl}/>

                            </InputGroup>
                        </FormGroup>
                        <div className="centerblock">
                        <div className="formgroupinline">
                            <ControlLabel className="CreateChatFormCaption"> Приватный чат</ControlLabel>
                            <input id="cb4" className="tgl tgl-flat"  type = "checkbox" onChange={this.PeopleCountChange} name="PrivatetCheckBox" value="1"/>
                                <label className="tgl-btn" htmlFor= "cb4"/>
                        </div>
                            <Button className="FontFix CreateButton CenterContentFix"  type="submit"  name="submit">
                                Создать
                            </Button>
                        </div>





                    </form>
                    </div>
                </div>
            </div>
        );
    }
};

function FieldGroup({ id, label, help, props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                type="text"
                value="text"
                placeholder="Enter text"
            />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}
