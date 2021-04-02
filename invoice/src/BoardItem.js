import React, {Component} from 'react';

export class BoardItem extends Component {
    render() {
        console.log("BoardRow start");
        // handleSelectRow = () => {
        //     const { row, onSelectRow } = this.props;
        //     onSelectRow(row);
        // } 
        return(
            <tr>
                <td><a href='.' onClick={function(event){
                    event.preventDefault();
                    this.props.clickEvent(
                        this.props.row.id
                        , this.props.row.fileShortPath
                        , this.props.row.unit
                        , this.props.row.text
                        );
                    }.bind(this)}>
                    {this.props.row.id}</a>
                </td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.name}</a></td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.unit}</a></td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.text}</a></td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.filePath}</a></td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.updateDate}</a></td>
                <td><a onClick={this.handleSelectRow}>{this.props.row.updateTime}</a></td>
                {/* <td><a onClick={this.handleSelectRow}>{this.props.row.brdtitle}</a></td> */}
                {/* <td>{this.props.row.brdwriter}</td>
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td> */}
            </tr>
        );
    }
}

export default BoardItem;

