import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet'
import { Link } from 'react-router-dom';
import Markers from './Markers'
import './MapView.css'

const initialPosition = [43.653225, -79.383186];

const AddMarker = () => {
  const [position, setPosition] = useState(null);  

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng); // 👈 add marker

      /* CODE TO ADD NEW PLACE TO STORE (check the source code) */
    },
  });

  const newTo = {
    pathname: "/listing",
    latlng: position
  };

  return position === null ? null : (
    <Marker position={position}>
      <Popup>        
        <Link to={ newTo }>
          <button type="button">
            Create Form
          </button>
        </Link>
      </Popup>
    </Marker>
  );
};

const MapView = () => {
    return (
    <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    <AddMarker/>
    
  </MapContainer>
  );
}

export default MapView;