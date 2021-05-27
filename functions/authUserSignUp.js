import faunadb, { query as q, TimeAdd } from "faunadb"
require('dotenv').config();

const serverClient = new faunadb.Client({ secret: process.env.SERVER_CLIENT_KEY });
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};
exports.handler = async (event, context, callback) => {
    try {
        const data = JSON.parse(event.body);
        const userToken = data.token;
        const userPassword = data.password;
        const userEmail = data.email;
        const userConfirmed = data.confirmed;

        const response = await serverClient.query(
            q.Create(q.Collection("Auth_Posts"), {
                credentials: { password: userPassword },
                data: {
                    email: userEmail,
                    token: userToken,
                    confirmed: userConfirmed,
                }
            })
        )
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
