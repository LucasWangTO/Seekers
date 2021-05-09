import React from 'react'
import {
    Switch,
    Route
} from "react-router-dom";
import Listing from './Listing'
import MapView from './MapView'

const App = () => {
    return (
        <div>
            <Switch>
                <Route path="/listing">
                    <Listing />
                </Route>
                <Route path="/">
                    <MapView />
                </Route>
            </Switch>
        </div>
    );
}

export default App;