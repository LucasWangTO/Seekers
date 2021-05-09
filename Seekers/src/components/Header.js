import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'

const Header = () => {
    return (
        <nav>
            <ul>
                <li style={{float: "left"}} >
                    <Link to="/">Seekers</Link>
                </li>
                <li>
                    <Link to="/listing">Create Listing</Link>
                </li>
                <li>
                    <Link to="/posts">Posts</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header;