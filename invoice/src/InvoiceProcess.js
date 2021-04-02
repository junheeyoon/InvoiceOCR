import React, { Component } from 'react';
import BoardItem from './BoardItem';

import './App.css';


class InvoiceProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList:null
            , IP:'127.0.0.1:8728'
            // , IP:'10.33.194.28:4406'
            // , rootDir : '/bigdata/RPA/frontend-reactjs/invoice/build/'
            , rootDir : 'D:\\WorkSpace\\workspace_RPA\\invoice\\public\\'
            , id:''
            , unit:''
            , x : 0
            , y : 0
            , context : ''

            , canvasWidth : 800
            , canvasHeight : 1200
            , canvasMultiple : 5
        }
    }
    getToday = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let today = year + month + day;
        let getDate = window.document.getElementById("getDate");
        getDate.value =  today;
    }
    callGetListData = (e) => {
        const getDate = window.document.getElementById("getDate").value;
        fetch("http://"+this.state.IP+"/RPA/Invoice/getOCR", {
            method: 'POST',
            headers: {
                Accept: 'application/json'
                , 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                methodName: 'ListData'
                , date: getDate
            })
        })
        .then(res => res.json())
        .then(json => {
            this.setState({
                dataList:JSON.parse(json)
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
   
    fileUpload = (idParam) => {
        let formData = new FormData();
        formData.append('methodName', 'FileUpload');

        for (const file of document.getElementById("uploadFIle").files) {
            formData.append('uploadFile',file,file.name)
        }

        fetch("http://"+this.state.IP+"/RPA/Invoice/getOCR", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(json => {
            this.setState({
                id: idParam
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    callUpdateData = (e) => {
        if (document.getElementById("dataText") == null) return;
        const dataText = document.getElementById("dataText").value
        if ( dataText == "" ) {
            alert('uploadText should not be an empty field.');
            return ;
        }
        let formData = new FormData();
        formData.append('methodName', 'UpdateData');
        formData.append('id', this.state.id);
        formData.append('unit', this.state.unit);
        formData.append('text', dataText);

        fetch("http://"+this.state.IP+"/RPA/Invoice/getOCR", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(
            this.callGetListData
            
        )
        .catch((error) => {
            console.error(error);
        });
        document.getElementById("imageFile").src= "";
        document.getElementById("txtPanel").innerHTML = "";

    }
    
    showImage = (id, path, unit,text) =>{
        // document.getElementById("imageFile").src = "/invoice" + path;
        document.getElementById("imageFile").src = path;
        document.getElementById("txtPanel").innerHTML = "";
        let txt = "<div style='position:float'>"+unit+" : <input type='text' id='dataText' value='" + text + "' size='80' />"
        document.getElementById("txtPanel").innerHTML += txt;

        // canvas 영역
		// const canvas = document.getElementById("canvas");
        // let context = canvas.getContext("2d");
		// const image = new Image(this.state.canvasHeight, this.state.canvasWidth); // Using optional size for image
		// image.src= path;
		// context.drawImage( image , 0, 0,this.state.canvasWidth, this.state.canvasHeight);
        // this.setState({context:context})
    };

	getLocation = (e) => {
		const coorX = e.view.event.layerX
		const coorY = e.view.event.layerY
        const x = this.state.x
        const y = this.state.y
        const context = this.state.context
        context.globalAlpha = 0.2;
        
		if (x == 0 && y == 0) {
			this.setState({x:coorX, y:coorY})
            context.beginPath();
            context.fillStyle = 'blue';
            context.arc(coorX, coorY, 5, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }else{
            this.setState({x:0,y:0})
            const text = x+","+y +" / " +(coorX)+","+(coorY)
            // context.strokeRect(x,y,coorX-x,coorY-y);
            context.beginPath();
            context.fillStyle = 'blue';
            context.arc(coorX, coorY, 5, 0, 2 * Math.PI);
            context.fill();
            context.fillStyle = "red";
            context.fillRect(x,y,coorX-x,coorY-y);

            context.globalAlpha = 1;
            context.fillStyle = "black";
            context.fillText(text, coorX,coorY);
            context.closePath();

            // DB에 넣을때는 화면과 size가 다르기때문에, 맞춰서 데이터를 준다.
            // console.log(x * this.state.canvasMultiple
            //     , y * this.state.canvasMultiple
            //     , coorX * this.state.canvasMultiple-x * this.state.canvasMultiple
            //     , coorY * this.state.canvasMultiple-y * this.state.canvasMultiple);
            // 아래부터는 DB에 데이터 전송이 필요.
            // ...
        }
    };
    render( ) {
        let dataValue = [];
        let imgDirectory = ""
        if (this.state.dataList){
            dataValue = this.state.dataList.value;
        }
        const divStyle = { 
            backgroundImage: 'url(' + imgDirectory + ')' 
            ,backgroundPosition: 'cover'
            ,backgroundRepeat: 'noRepeat'
            ,backgroundSize: 'cover'
            ,width: '850px'
            // ,height: '1200px'
            , height: 'auto'
        };

        return (            
            <div>
                <h1>Invoice Data Process</h1>
                <button onClick={ () => {this.props.history.push("/Coordinate")}}> Coordinate </button>
                <p/>
                Upload file(zip, pdf, png) : <input type="file" id="uploadFIle" name="uploadFIle[]" accept="image/png, image/jpeg, .zip, .pdf"  multiple></input>
                {/* <input type="text" id="uploadText"></input> */}
                <button type="button" onClick={this.fileUpload}>File Upload</button>
                <p/>
                Date : <input type="text" id="getDate" ref={this.getToday}></input>
                <button type="button" onClick={this.callGetListData}>go Query</button>
                <p/>
                <table border="1">
                    <tbody>
                        <tr align="center">
                            <td width="50">id</td>
                            <td width="100">name</td>
                            <td width="100">unit</td>
                            <td width="1000">text</td>
                            <td width="100">filePath</td> 
                            <td width="100">updateDate</td>
                            <td width="100">updateTime</td>
                        </tr>
                        {
                            dataValue.map(row =>
                                (<BoardItem key={row.id} row={row} clickEvent={function(id, path, unit, text){
                                    this.setState({id:id, imgDir:path, unit:unit});
                                    this.showImage(id, path, unit, text);
                                }.bind(this)}
                                />)
                            )   
                        }
                    </tbody>
                </table>
                <table border="1" width="1600" height="720">
                    <tbody>
                        <tr>
                            <td align="center">
                                <img src={imgDirectory} style={divStyle} id="imageFile"></img>
                            </td>
                            <td align="center">
                                {/* <img src={imgDirectory} class='imgClass'></img> */}
                                <div id="txtPanel" align="left" style={divStyle} ></div>
                            </td> 
                        </tr>
                        <tr>
                            <button type='button' onClick={this.callUpdateData}>Update Data</button>
                        </tr>
                    </tbody>
                </table>
                
                {/* <canvas id="canvas" height="1200" width="800" onClick={this.getLocation}>This browser doesn't support canvas</canvas> */}

            </div>
        );
    }
}

export default InvoiceProcess; 
