import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        sessionStorage.getItem("user") && sessionStorage.getItem("user") !== "null"
        ? <Component {...props} />
        : <Redirect to='/'/>
    )} />
)

export default PrivateRoute;