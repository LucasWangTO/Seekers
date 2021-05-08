import React, { useState } from 'react';

const Listing = () => {
    const [details, setDetails] = useState({
        isLost: false,
        name: "",
        address: "",
        contact: "",
        desc: ""
    });

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

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <fieldset>
                    <legend>Create a new Listing:</legend>
                    <input type="radio" id="lost" name="typePost" value="lost" onChange={handleRadio} required />
                    <label>Lost Item</label>
                    <input type="radio" id="found" name="typePost" value="found" onChange={handleRadio} />
                    <label>Found Item</label><br />
                    <label for="name">Name:</label><br />
                    <input type="text" id="name" name="name" placeholder="Enter your name" value={details.name} onChange={handleName} required /><br />
                    <label for="contact">Contact Information:</label><br />
                    <textarea id="contact" name="contact" rows="3" cols="50" value={details.contact} onChange={handleContact} required /><br />
                    <label for="desc">Description of Item:</label><br />
                    <textarea id="desc" name="desc" rows="7" cols="50" value={details.desc} onChange={handleDesc} required /><br />
                    <input type="submit" value="Post Listing" />
                </fieldset>
            </form>
        </div>
    );
}

export default Listing;