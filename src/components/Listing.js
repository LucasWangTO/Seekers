import React, { useState, useRef, useContext } from 'react';
import { UserContext } from "./Contexts";
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
    const user = useContext(UserContext).userInfo.user;
    const [details, setDetails] = useState(emptyDetails);
    const latRef = useRef();
    const longRef = useRef();
    const location = useLocation();

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
            location: [parseFloat(latRef.current.value), parseFloat(longRef.current.value)],
            contact: user
        }

        try {
            console.log(JSON.stringify(data));
            await fetch('http://localhost:9000/sendPost', {
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
            <div className="formContainer">
                <form classname="formContainer" onSubmit={handleSubmit} >
                    <fieldset>
                        <legend>Create a new Listing:</legend>
                        <input className="radioBox" type="radio" id="lost" name="typePost" value="lost" onChange={handleRadio} required />
                        <label className="radioLabel">Lost Item</label>
                        <input className="radioBox" type="radio" id="found" name="typePost" value="found" onChange={handleRadio} />
                        <label className="radioLabel">Found Item</label><br />
                        <label for="name">Name:</label><br />
                        <input className="inputBox" type="text" id="name" name="name" placeholder="Enter your name" value={details.name} onChange={handleName} required /><br />
                        <label for="Latitude">Latitude of item:</label><br />
                        <input className="inputBox" type="number" id="Latitude" name="Latitude" step="any" defaultValue={location.state ? location.state.lat : ""} ref={latRef} required /><br />
                        <label for="Longitude">Longitude of item:</label><br />
                        <input className="inputBox" type="number" id="Longitude" name="Longitude" step="any" defaultValue={location.state ? location.state.lng : ""} ref={longRef} required /><br />
                        <label for="contact">Contact Information: {user}</label><br />
                        <div id="contact" value={user} /><br />
                        <label for="desc">Description of Item:</label><br />
                        <textarea placeholder="Enter description of item" id="desc" name="desc" rows="7" cols="50" value={details.desc} onChange={handleDesc} required /><br />
                        <input className="inputButton" type="submit" value="Post Listing" />
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Listing;