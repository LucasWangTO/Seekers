import React, { useState, useContext } from "react";
import { UserContext } from "./Contexts";
import { useHistory, Link } from 'react-router-dom';
import './SignUp.css'
import { gsap } from "gsap";
import $ from "jquery";

const emptyCreds = {
    email: "",
    password: ""
}

const SignUp = () => {
    let history = useHistory();
    const [creds, setCreds] = useState(emptyCreds);
    const { userInfo, signUpPageInfo} = useContext(UserContext);
    const setUser = userInfo.setUser;
    const setOnSignUpPage = signUpPageInfo.setOnSignUpPage;

    const handleSubmit = async (e) => {
        e.preventDefault();

        let data = {...creds}
        console.log("form submitted. your email and password are: ", creds);

        try{
            console.log("sending this data: ", JSON.stringify(data));
            const response = await fetch('http://localhost:9000/authUserSignUp', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json()
            alert("Account Creation Successful!");
            console.log("this is the redirect data: ", result.secret);
            setUser(creds.email);
            setOnSignUpPage(false);
            history.push('/map');
        } catch(err) {
            console.log(err);
            alert("Account already exists!");
        }
    }

    const recordSignUp = () => {
        setOnSignUpPage(false);
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

    return (
        <div className="login-box">
            <div id="login-button" onClick={loginExpand}>
                        <img className="seekers-logo" src="http://resources.css.edu/careerservices/images/icons/icon_jobseekers.png" alt=""></img>        
                    </div>
                    <div id="container">
                        <h1>Start Seeking</h1>
                        <span className="close-button" onClick={loginClose}>
                            <img src="https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete_-128.png" alt=""></img>
                        </span>

                        <form onSubmit={handleSubmit}>
                            <input type="email" name="email" required="" placeholder="E-mail" onChange={handleChangeEmail}/>
                            <input type="password" name="pass" required="" placeholder="Password" onChange={handleChangePsw}/>
                            <input class="submitButton" type="submit" value="Sign Up"/>
                            <Link onClick={recordSignUp} to="/login" className='link'>Have an account? Sign In</Link>
                        </form>
                    </div>
                </div>
    )
}

export default SignUp