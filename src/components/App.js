import React, { useState } from 'react'
import {
    Switch,
    Route
} from "react-router-dom";
import Listing from './Listing'
import Posts from './Posts'
import MapView from './MapView'
import Login from './Login'
import SignUp from './SignUp'

import { UserContext } from './Contexts'

const useSessionStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch(error) {
            console.log(error);
            return initialValue;
        }
    })
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch(error) {
            console.log(error);
        }
    }
    return [storedValue, setValue];
}

const App = () => {
    const [user, setUser] = useSessionStorage("user", null);
    const [onSignUpPage, setOnSignUpPage] = useSessionStorage("signupPage", false);
    return (
        <div>
            <Switch>            
                    <UserContext.Provider value={{ userInfo: {user, setUser}, signUpPageInfo: {onSignUpPage, setOnSignUpPage} }}>
                        <Route path="/listing">
                            <Listing />
                        </Route>                         
                        <Route path="/posts">
                            <Posts />
                        </Route>    
                        <Route path="/map">
                            <MapView />
                        </Route> 
                        <Route path="/signup">
                            <SignUp />
                        </Route>
                        <Route path="/">
                            <Login />
                        </Route>                                         
                    </UserContext.Provider>
            </Switch>
        </div>
    );
}

export default App;