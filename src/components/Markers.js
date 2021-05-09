import React from 'react';
import { Marker, Popup } from 'react-leaflet'

const Markers = (props) => {
    <Marker position={props.location}>
        <Popup>
            <h1>
                {props.isLost ? "Lost Item" : "Found Item"}
            </h1>
            <h3>
                {props.name}
            </h3>
            <h3>
                {props.desc}
            </h3>
            <h3>
                {props.contact}
            </h3>
        </Popup>
    </Marker>
}

export default Markers;