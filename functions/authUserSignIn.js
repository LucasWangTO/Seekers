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
            const { email, password } = JSON.parse(event.body);

            //Try to login
            const response = await serverClient.query(
                q.Login(
                    q.Match(q.Index("users_by_email"), email),
                    {
                        password: password
                    }
                )
            )
            console.log("response from fauna query login attempt: ", response);

            //If account exists(no error was caught), get the status of confirmed email(we need this to decide whether to let the user sign in)
            const confirmEmailResponse = await serverClient.query(
                q.Map(
                    q.Paginate(
                      q.Match(q.Index("users_by_email"), email)
                    ),
                    q.Lambda(
                      "person",
                      q.Get(q.Var("person"))
                    )
                )
            )
            console.log("response from fauna query search for user attempt: ", confirmEmailResponse);
            return {
                statusCode: 200,
                body: JSON.stringify(confirmEmailResponse),
                headers
            }
        } catch (err) {
            console.log("Error in catch of authUser-signin", err)
            return {
                statusCode: 400,
                body: JSON.stringify(err)
            }
        }        
    }
}