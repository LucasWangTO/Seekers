import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Contexts'
import './Header.css'


const Header = () => {
    const { userInfo, signUpPageInfo} = useContext(UserContext);
    const { user, setUser } = userInfo;
    const userLogout = () => {
        setUser(null);
    }

    return (
        <nav>
            <ul>
                <li style={{float: "left"}} >
                    <Link to="/map">Seekers</Link>
                </li>
                <li>
                    <Link to="/login" onClick={userLogout}>Logout</Link>
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