import React, { Component } from 'react';
import InvoiceProcess from './InvoiceProcess';
import Coordinate from './Coordinate';
import { BrowserRouter as Router,Route, Switch} from 'react-router-dom';

// simple list
class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/' component={InvoiceProcess} />
                        <Route path='/Coordinate' component={Coordinate} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;