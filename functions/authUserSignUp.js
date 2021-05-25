import faunadb, { query as q, TimeAdd } from "faunadb"
require('dotenv').config();
const nodemailer = require("nodemailer");

const serverClient = new faunadb.Client({ secret:  process.env.SERVER_CLIENT_KEY });
const emailUsername = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PSW;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

function preflight(callback) {
    callback(null, {
      statusCode: 204,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
      },
      body: {},
    });
}

exports.handler = async (event, context, callback) => {
    if (event.httpMethod === 'OPTIONS') {
        console.log("entered preflight")
        preflight(callback);
    } else {
        try{
            let transporter = nodemailer.createTransport({                
                host: "smtp-relay.gmail.com",
                port: 465,
                secure: true, // upgrade later with STARTTLS
                service: "Gmail",
                auth: {
                    user: emailUsername,
                    pass: emailPass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });            
            
            const data = JSON.parse(event.body);
            console.log("this is data received on request from login.js: ", data);
            const userEmail = data.email;
            const userPassword = data.password;
            const userConfirmed = data.confirmed;
            let response = "";
            const {
                randomBytes,
            } = await import('crypto');
            
            randomBytes(3, async(err, buf) => {
                if (err) throw err;

                console.log(userPassword, userEmail, "this is the user token: ", buf.toString('hex'), userConfirmed);

                const message = {
                    from: emailUsername,
                    to: userEmail,
                    subject: "Your Seekers access code",
                    html: `<p>This is your access code: ${buf.toString('hex')}</p>`
                };
                
                transporter.sendMail(message, (err, info) => {
                    console.log("err", err);
                    console.log("info", info); 
                })

                response = await serverClient.query(
                    q.Create(q.Collection("Auth_Posts"), {
                        credentials: { password: userPassword },
                        data: {
                        email: userEmail,
                        token: buf.toString('hex'),
                        confirmed: userConfirmed,
                        }
                    })
                )
            })    
                
            console.log("this is the response", response); //response is null
            return {
                statusCode: 200,
                body: JSON.stringify(response),
                headers
            }     
        } catch (err) {
            console.log("Error in catch of authUser-signup", err)
            return {
                statusCode: 400,
                body: JSON.stringify(err)
            }  
        }        
    }
}
