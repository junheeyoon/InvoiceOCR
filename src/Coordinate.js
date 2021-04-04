import React, { Component} from 'react';

class Coordinate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList:null
            , IP:'127.0.0.1:8728'
            , tableName : ''
            , x : 0
            , y : 0
            , context : ''
            , canvasWidth : 800
            , canvasHeight : 1200
            , canvasMultiple : 1
            , file : ''
            , imagePreviewUrl : ''
        }

    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
        this.setState({
            file: file,
            imagePreviewUrl: reader.result
        });
        }

        reader.readAsDataURL(file)
        
        
    }
    setC = () =>{
        const canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        const image = new Image(this.state.canvasHeight, this.state.canvasWidth); // Using optional size for image

        image.src = this.state.imagePreviewUrl
        
        context.src = image.src

        context.drawImage( image , 0, 0,this.state.canvasWidth, this.state.canvasHeight);
        this.setState({context:context})

    }
    
    mouseoUp = (e) => {
        const context = this.state.context
        if(context == "") return

        const coorX = e.view.event.layerX
        const coorY = e.view.event.layerY
        const x = this.state.x
        const y = this.state.y
        context.globalAlpha = 0.2;

        this.setState({x:0,y:0})
            const multiples = document.getElementById("multiples").value
            const text = (x * parseInt(multiples)) + ","
                + (y * parseInt(multiples)) + " / " 
                + (coorX * parseInt(multiples)) + ","
                + (coorY * parseInt(multiples))
            // const text = x+","+y +" / " +(coorX)+","+(coorY)

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

            document.getElementById("txtValue").value = text.replace(' / ',',');
            
    };
    
    mouseoDown = (e) =>{
        const context = this.state.context
        if(context == "") return

        const coorX = e.view.event.layerX
        const coorY = e.view.event.layerY
        const x = this.state.x
        const y = this.state.y
        context.globalAlpha = 0.2;
        
        if (x == 0 && y == 0) {
        
            this.setState({x:coorX, y:coorY})
            context.beginPath();
            context.fillStyle = 'blue';
            context.arc(coorX, coorY, 5, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }
    };
    getLocation = (e) => {
        const context = this.state.context
        if(context == "") return

        const coorX = e.view.event.layerX
        const coorY = e.view.event.layerY
        const x = this.state.x
        const y = this.state.y
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
            const multiples = document.getElementById("multiples").value
            const text = (x * parseInt(multiples)) + ","
                + (y * parseInt(multiples)) + " / " 
                + (coorX * parseInt(multiples)) + ","
                + (coorY * parseInt(multiples))
            // const text = x+","+y +" / " +(coorX)+","+(coorY)

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

            document.getElementById("txtValue").value = text.replace(' / ',',');

        }
    };
    insertCoordinateData = (e) => {
        if (document.getElementById("txtLabel").value && document.getElementById("txtValue").value ) {
            const txtTable = document.getElementById("txtTable").value
            const txtLabel = document.getElementById("txtLabel").value
            const selectUnit = document.getElementById("selectUnit").value
            const txtUnit = document.getElementById("txtUnit").value
            const txtValue = document.getElementById("txtValue").value

            let formData = new FormData();
            formData.append('methodName', 'UpdateCoordinate');
            formData.append('table', txtTable);
            formData.append('label', txtLabel);
            formData.append('value', txtValue);
            if (selectUnit){
                formData.append('unit', selectUnit);
            }else{
                formData.append('unit', txtUnit);
            }

            fetch("http://"+this.state.IP+"/RPA/Coordinate/setCoordinate", {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(
                alert('success')
            )
            .catch((error) => {
                alert('fail')
                console.error(error);
            });

        }else{
            alert('Label & Value is a required');return;
        }
    }
    changeTableSelect = (e) => {
        const tableValue = document.getElementById("txtTable").value
        let selectUnit = document.getElementById('selectUnit')
        if (tableValue == 'invoice_coordinate'){
            document.getElementById('txtUnit').disabled = true
            document.getElementById('txtUnit').value = ''
            document.getElementById('selectUnit').disabled = false
            const unitList = [
                { key: 'invoiceNO', val: 'invoiceNO' }
                ,{ key: 'purchaseOrderNO', val: 'purchaseOrderNO' }
                ,{ key: 'invoiceDate', val: 'invoiceDate' }
                ,{ key: 'wayBillNO', val: 'wayBillNO' }
                ,{ key: 'partNO', val: 'partNO' }
                ,{ key: 'partQty', val: 'partQty' }
                ,{ key: 'partPrice', val: 'partPrice' }
                ,{ key: 'partTotPrice', val: 'partTotPrice' }
                ,{ key: 'currency', val: 'currency' }
                ,{ key: 'total', val: 'total' }
                ,{ key: 'table', val: 'table' }
                ,{ key: 'tableExtractLine', val: 'tableExtractLine' }
                ,{ key: 'page', val: 'page' }
                ,{ key: 'passPage', val: 'passPage' }
            ];
            unitList.forEach(function(list, i) {
                var opt = document.createElement('option')
                opt.setAttribute('value', list.key)
                opt.innerText = list.val
                selectUnit.appendChild(opt)
            })
        }else{
            for(var i=0; i<selectUnit.children.length; i++) {
                if(selectUnit.children.length > 0 && selectUnit.firstChild) {
                    selectUnit.removeChild(selectUnit.lastChild)
                    i--
                }
            }
            document.getElementById('txtUnit').disabled = false
            document.getElementById('selectUnit').disabled = true
        }

    }

    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
          $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
          $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
        return (
            <div>
                <h3> Coordinate </h3>
                <button onClick={ () => {this.props.history.goBack()} }> back </button>
                <p/>
                
                
                <tr border="1">
                    <td colSpan="2">
                    <div className="previewComponent">
                        {/* <form onSubmit={(e)=>this._handleSubmit(e)}> */}
                        <input className="fileInput" 
                            type="file" 
                            accept="image/png, image/jpeg"
                            onChange={(e)=>this._handleImageChange(e)} />
                        <button onClick={this.setC}>convert</button>

                        <select id='multiples' size='1'>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5' selected>5</option>
                            <option value='6'>6</option>
                            <option value='7'>7</option>
                            <option value='8'>8</option>
                            <option value='9'>9</option>
                            <option value='10'>10</option>
                        </select>
                    </div>
                    <p/>
                    </td>
                </tr> 
                <tr>
                    
                    <td>
                    <p/>
                    {/*<canvas id="canvas" height="1200" width="800" onClick={this.getLocation}>This browser doesn't support canvas</canvas>*/}
                    <canvas id="canvas" height="1200" width="800" onMouseMove={this.mouseMove} onMouseDown={this.mouseoDown} onMouseUp={this.mouseoUp}>This browser doesn't support canvas</canvas>
                    </td>

                    <td valign="top" > 
                    <label >Data Table : </label>
                    {/* <input type='text' id='txtTable' value ='awb_coordinate' size='20' disabled/><br/><br/> */}
                    <select id='txtTable' onChange={this.changeTableSelect}>
                        <option value="invoice_type" selected>Invoice Type</option>
                        <option value="invoice_coordinate">Invoice Coordinate</option>
                        <option value="awb_coordinate">Airwaybill Coordinate</option>
                    </select><br/><br/> 
                    <label >Data Label : </label><input type='text' id='txtLabel' size='15' /><br/><br/>
                    <label >Data Unit : </label><input type='text' id='txtUnit' size='15' /><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select id='selectUnit' size='1' style={{width:150}} disabled>
                    </select><br/><br/>
                    
                    <label >Data Value : </label><input type='text' id='txtValue' size='15' /><br/><br/>
                    <button type='button' onClick={this.insertCoordinateData}>Insert Coordinate Data</button>
                    </td>
                </tr>
            </div>
        );
    }
}
export default Coordinate;