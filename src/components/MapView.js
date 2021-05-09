import React, { useState, useEffect, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Link } from 'react-router-dom';
import Markers from './Markers'
import Header from './Header'
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
    state: position
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
  const [markerData, setMarkerData] = useState([]);
  const [isLost, setIsLost] = useState(false);

  useEffect(() => {
    fetch('http://localhost:9000/getPosts')
    .then(response => response.json())
    .then(data => setMarkerData(data.data))
  }, [])

  const handleClick = () => {
    setIsLost(!isLost);
  }

    return (
      <div className="boundary">
        <Header />
        <button className="toggle" onClick={handleClick}>Show {isLost ? "Found Items" : "Lost Items"}</button>
        <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true}>
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarker/>
          {markerData.filter(data => data.isLost === isLost).map(data => <Markers data={data} />)}
        </MapContainer>
      </div>
  );
}

export default MapView;