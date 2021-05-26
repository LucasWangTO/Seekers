import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./Contexts";
import { useHistory } from 'react-router-dom';
import './Login.css'
import { gsap } from "gsap";
import $ from "jquery";
import emailjs from 'emailjs-com';
require('dotenv').config({ path: require('find-config')('.env')})

const Login = () => {
    const emptyCreds = {
        email: "",
        password: "",
        confirmed: false,
        token: ""
    }

    let history = useHistory();
    const [creds, setCreds] = useState(emptyCreds);
    const { userInfo, clickHeader } = useContext(UserContext);
    const { user, setUser } = userInfo;
    const [currentPage, setCurrentPage] = useState("signUp");
    const { clickedLogout, setClickedLogout } =  clickHeader;
    const [token, setToken] = useState("");
    const [resettingToken, setResettingToken] = useState(false);
    
    useEffect(() => {
        let linkText = document.getElementById("link");
        if (!currentPage.localeCompare("signIn") && linkText) {
            console.log("we are on page: ", currentPage); 
            linkText.innerHTML = "New? Click here to Sign Up";
        } else if (!currentPage.localeCompare("signUp") && linkText) {
            console.log("we are on page: ", currentPage); 
            linkText.innerHTML = "Have an account? Sign In";
        }
    }, [currentPage])

    useEffect(async () => {
        if (token.localeCompare("") != 0) {
        const SERVICE_ID = process.env.EMAIL_JS_SERIVCE_ID;
        const TEMPLATE_ID = process.env.EMAIL_JS_TEMPLATE_ID;
        const USER_ID = process.env.EMAIL_JS_USER_ID;
        console.log("new creds before db call, ", creds);
        console.log(SERVICE_ID, TEMPLATE_ID, USER_ID);
        const url = resettingToken ? "/.netlify/functions/resendCode" : "/.netlify/functions/authUserSignUp";
        console.log(url, "with data: ", creds);
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(creds)
        });
        const templateParams = {
            user_email: creds.email,
            access_token: token
        }
        emailjs.send("service_wxptry8", "contact_form", templateParams, "user_OLZP6VZZgytfp2F16BS3S");
    }
    }, [token])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("The button that was pressed is: ", e.target);
        if (!currentPage.localeCompare("signUp")) {
            console.log("submitted on page signup: ", currentPage);
                try{
                    const userExistenceResponse = await fetch("/.netlify/functions/checkUserExist", {
                        method: 'POST',
                        body: JSON.stringify(creds)
                    });
                    const userExistenceData = await userExistenceResponse.json();
                    console.log(userExistenceData);
                    if (userExistenceData.data.length !== 0) {
                        alert("Account already exists!");
                        return;
                    }   

                    const {
                        randomBytes,
                    } = await import('crypto');
        
                    randomBytes(3, async(err, buf) => {
                        if (err) throw err;
                        const code = buf.toString('hex');
                        console.log("code: ", code);
                        setCreds({
                            ...creds,
                            token: code
                        })
                        setResettingToken(false);
                        setToken(code);                        
                    })                 

                    alert("Confirmation email sent!");

                    setCurrentPage("signConfirm");
                    
                } catch(err) {
                    console.log(err);
                    alert("Error creating account!");
                }
        } else if (!currentPage.localeCompare("signIn")){
            try{
                console.log("submitted on page: signin", currentPage);
                console.log("sending this data: ", JSON.stringify(creds));

                console.log("fetching here: ", "/.netlify/functions/authUserSignIn");
                const response = await fetch("/.netlify/functions/authUserSignIn", {
                    method: 'POST',
                    body: JSON.stringify(creds)
                });
                const data = await response.json();
                console.log("Status of this account is:", data.data[0].data.confirmed);
                if (!data.data[0].data.confirmed) {
                    alert("Please confirm your account to proceed.Sending access code.");
                    await fetch("/.netlify/functions/resendCode", {
                        method: 'POST',
                        body: JSON.stringify(creds)
                    });                    
                    setCurrentPage("signConfirm");
                    return;
                }
                
                alert("Login Successful!");
                
                setUser(creds.email);
                history.push('/map');
            } catch(err) {
                console.log(err);
                alert("Invalid Credentials!");
            }
        } else if (!currentPage.localeCompare("signConfirm")) {
            const userInputCode = document.getElementById("inputCode").value;
            console.log("in the front end right now, this is code entered by user: ", userInputCode);
            const req = {
                email: creds.email,
                token: userInputCode
            }
            const response = await fetch("/.netlify/functions/confirmAccess", {
                method: 'POST',
                body: JSON.stringify(req),
            });
            const data = await response.json();
            console.log("back in front end, data received: ", data);
            if (data.data) {
                alert("Code accepted! Welcome to Seekers.");
                setCurrentPage("/signIn");
                setUser(creds.email);
                console.log("current user", userInfo);
                history.push("/map");
            } else {
                alert("Invalid Code! Please try again.");
            }
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

    const clickLink = () => {
        if (!currentPage.localeCompare("signIn")) {               
            setCurrentPage("signUp");
        } else if (!currentPage.localeCompare("signUp")) {               
            setCurrentPage("signIn");
        }       
    }

    const loginExpand = () => {
        setClickedLogout(false);
        setCurrentPage("signUp");
        setCreds(emptyCreds);
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

    const resendCode = async () => {
        if (!creds.email.localeCompare("")) {
            alert("Please fill out the e-mail field before requesting a re-send");
            return;
        }
        try{
            const userExistenceResponse = await fetch("/.netlify/functions/checkUserExist", {
                method: 'POST',
                body: JSON.stringify(creds)
            });
            const userExistenceData = await userExistenceResponse.json();
            console.log("userexistencedata: ", userExistenceData.data[0]);
            
            if (userExistenceData.data === 0) {
                alert("This account does not exist!");
                return;
            } else if (userExistenceData.data[0].data.confirmed === true) {
                alert("This account has already been confirmed");
                return;
            }

            const {
                randomBytes,
            } = await import('crypto');

            randomBytes(3, async(err, buf) => {
                if (err) throw err;
                const code = buf.toString('hex');
                console.log("code: ", code);
                setCreds({
                    ...creds,
                    token: code
                })
                setResettingToken(true);
                setToken(code);
            })     

            setCurrentPage("signConfirm");
        } catch(err) {
            alert("Error re-sending code!");
        }
        
    }

    const clickBack = () => {
        setCurrentPage("signIn");
        setUser(null);
    }


        if ((user === null && (!currentPage.localeCompare("signIn") || !currentPage.localeCompare("signUp"))) || clickedLogout === true) {       
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
                            <input className="generalInput" id="userEmailInput" type="email" name="email" required placeholder="E-mail" onChange={handleChangeEmail}/>
                            <input className="generalInput" type="password" name="pass" required placeholder="Password" onChange={handleChangePsw}/>
                            <input className="generalInput" id="submitButton" type="submit" value={currentPage.localeCompare("signUp") === 0 ? "Sign Up" : "Sign In"}/>
                            <input className="generalInput" id="submitButtonCode" type="button" onClick={resendCode} value="Re-send access code"/>
                            <p onClick={clickLink} id='link'>Have an account? Sign In</p>
                        </form>
                    </div>
                </div>
            )
        } else if (!currentPage.localeCompare("signConfirm")) {
            return (
                <div id="accessCodeContainer">
                    <h1>Enter your access code</h1>
                    <form onSubmit={handleSubmit}>                        
                        <input id="inputCode" type="text" placeHolder="Code"/>                        
                        <input className="generalInput" id="submitAccessPage" type="submit"/>
                        <input className="generalInput" id="backButton" type="button" value="Exit" onClick={clickBack}></input>
                    </form>
                </div>
            )
        } else {
            return (
                <></>
            )
        }   
}

export default Login
