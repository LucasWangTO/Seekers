import faunadb, { query as q, TimeAdd } from "faunadb"
require('dotenv').config();

var adminClient = new faunadb.Client({ secret: process.env.ADMIN_CLIENT_KEY });
var serverClient = new faunadb.Client({ secret:  process.env.SERVER_CLIENT_KEY });

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
            const data = JSON.parse(event.body);
            const userEmail = data.email;
            const userPassword = data.password;
            const response = await serverClient.query(
                q.Create(q.Collection("Auth_Posts"), {
                    credentials: { password: userPassword },
                    data: {
                      email: userEmail
                    }
                  })
            )
            return {
                statusCode: 200,
                body: JSON.stringify(response),
                headers
            }
        } catch (err) {
            console.log("Error in catch of authUser", err)
            return {
                statusCode: 400,
                body: JSON.stringify(err)
            }
        }        
    }
}