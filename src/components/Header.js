import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Contexts'
import './Header.css'


const Header = () => {
    const setClickedLogout = useContext(UserContext).clickHeader.setClickedLogout;
    const userLogout = () => {
        delete sessionStorage.user;
        setClickedLogout(true);
        window.location.reload(); //refresh to prevent a bug that sometimes doesn't display login screen
    }

    return (
        <nav>
            <ul>
                <li style={{float: "left"}} >
                    <Link to="/map">Seekers</Link>
                </li>
                <li>
                    <Link to="/" onClick={userLogout}>Logout</Link>
                </li>
                <li>
                    <Link to="/listing">Create Listing</Link>
                </li>
                <li id="posts">
                    <Link to="/posts">Posts</Link>
                </li>
                
            </ul>
        </nav>
    )
}

export default Header;