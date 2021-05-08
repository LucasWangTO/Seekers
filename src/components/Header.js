import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'

const Header = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Seekers</Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/listing">Create Listing</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header;