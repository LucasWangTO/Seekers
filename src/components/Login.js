import React, { useState, useContext } from "react";
import { UserContext } from "./Contexts";
import { useHistory, Link } from 'react-router-dom';
import './Login.css'
import { gsap } from "gsap";
import $ from "jquery";

const emptyCreds = {
    email: "",
    password: ""
}

const Login = () => {
    let history = useHistory();
    const [creds, setCreds] = useState(emptyCreds);
    const { userInfo, signUpPageInfo} = useContext(UserContext);
    const { user, setUser } = userInfo;
    const { onSignUpPage, setOnSignUpPage } = signUpPageInfo;

    const handleSubmit = async (e) => {
        e.preventDefault();

        let data = {...creds}
        console.log("form submitted. your email and password are: ", creds);

        try{
            console.log("sending this data: ", JSON.stringify(data));
            const response = await fetch('/.netlify/functions/authUserSignIn', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json()
            alert("Login Successful!");
            setUser(creds.email);
            setOnSignUpPage(false);
            history.push('/map');
        } catch(err) {
            console.log(err);
            alert("Login Unsuccessful!");
        }
    }

    const handleChangeEmail = (e) => {        
        setCreds({
            ...creds,
            email: e.target.value
        });
    }

    const handleChangePsw = (e) => {
        setCreds({
            ...creds,
            password: e.target.value
        });
    }    

    const recordSignUp = () => {
        setOnSignUpPage(true);
    }

    const loginExpand = () => {
        let button = $("#login-button");
        let container = $("#container");
        button.fadeOut("slow", () => {
            container.fadeIn();
            gsap.from(container, {scale: 0, duration: .4, ease: "sine.inOut"});
            gsap.to(container, {scale: 1, duration: .4, ease: "sine.inOut"});
        })
    }

    const loginClose = () => {
        let button = $("#login-button");
        let container = $("#container");
        gsap.from(container, {scale: 1, duration: .4, ease:"sine.inOut"});
        gsap.to(container, {left:"0px", duration: .4, scale: 0, ease:"sine.inOut"});
        container.fadeOut(800, function(){
            button.fadeIn(800);
        })
    }

        if (user === null && !onSignUpPage) {
            return (
                <div className="login-box">
                    <div id="login-button" onClick={loginExpand}>
                        <img className="seekers-logo" src="http://resources.css.edu/careerservices/images/icons/icon_jobseekers.png"></img>        
                    </div>      
                    <div id="container">
                        <h1>Start Seeking</h1>
                        <span className="close-button" onClick={loginClose}>
                            <img src="https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete_-128.png"></img>
                        </span>

                        <form onSubmit={handleSubmit}>
                            <input type="email" name="email" required="" placeholder="E-mail" onChange={handleChangeEmail}/>
                            <input type="password" name="pass" required="" placeholder="Password" onChange={handleChangePsw}/>
                            <input class="submitButton" type="submit" value="Sign In"/>
                            <Link onClick={recordSignUp} to="/signup" className='link'>New? Click here to Sign Up</Link>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <></>
            )
        }   
}

export default Login