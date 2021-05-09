import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header'
import './Listing.css'

const emptyDetails = {
    isLost: false,
    name: "",
    contact: "",
    desc: ""
}

const Listing = (props) => {
    const [details, setDetails] = useState(emptyDetails);
    const latRef = useRef();
    const longRef = useRef();
    const location = useLocation();

    console.log(location.state);

    const handleRadio = (event) => {
        setDetails({
            ...details,
            isLost: event.target.value === "lost"
        });
    }

    const handleName = (event) => {
        setDetails({
            ...details,
            name: event.target.value
        });
    }

    const handleContact = (event) => {
        setDetails({
            ...details,
            contact: event.target.value
        });
    }

    const handleDesc = (event) => {
        setDetails({
            ...details,
            desc: event.target.value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        let data = {
            ...details,
            location: [parseFloat(latRef.current.value), parseFloat(longRef.current.value)]
        }

        try {
            await fetch('/.netlify/functions/sendPost', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            alert("Successfully Created Listing!");

            setDetails(emptyDetails);
            latRef.current.value = "";
            longRef.current.value = "";

        } catch (err) {
            console.log(err);
            alert("Error creating listing!");
        }

    }

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} >
                <fieldset>
                    <legend>Create a new Listing:</legend>
                    <input className="inputBox" type="radio" id="lost" name="typePost" value="lost" onChange={handleRadio} required />
                    <label>Lost Item</label>
                    <input className="inputBox foundItem" type="radio" id="found" name="typePost" value="found" onChange={handleRadio} />
                    <label>Found Item</label><br />
                    <label for="name">Name:</label><br />
                    <input className="inputBox" type="text" id="name" name="name" placeholder="Enter your name" value={details.name} onChange={handleName} required /><br />
                    <label for="Latitude">Latitude of item:</label><br />
                    <input className="inputBox" type="number" id="Latitude" name="Latitude" step="any" defaultValue={location.state ? location.state.lat : ""} ref={latRef} required /><br />
                    <label for="Longitude">Longitude of item:</label><br />
                    <input className="inputBox" type="number" id="Longitude" name="Longitude" step="any" defaultValue={location.state ? location.state.lng : ""} ref={longRef} required /><br />
                    <label for="contact">Contact Information:</label><br />
                    <textarea className="inputBox" id="contact" name="contact" rows="3" cols="50" value={details.contact} onChange={handleContact} required /><br />
                    <label for="desc">Description of Item:</label><br />
                    <textarea className="inputBox" id="desc" name="desc" rows="7" cols="50" value={details.desc} onChange={handleDesc} required /><br />
                    <input className="inputButton" type="submit" value="Post Listing" />
                </fieldset>
            </form>
        </div>
    );
}

export default Listing;