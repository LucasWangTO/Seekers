import React from 'react';
import { Marker, Popup } from 'react-leaflet'

const Markers = (props) => {
    return (
        <Marker position={props.data.location}>
            <Popup>
                <h1>
                    {props.data.isLost ? "Lost Item" : "Found Item"}
                </h1>
                <h3>
                    {props.data.name}
                </h3>
                <h3>
                    {props.data.desc}
                </h3>
                <h3>
                    {props.data.contact}
                </h3>
            </Popup>
        </Marker>
    )    
}

export default Markers;