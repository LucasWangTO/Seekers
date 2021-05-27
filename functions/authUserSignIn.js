import faunadb, { query as q, TimeAdd } from "faunadb"
require('dotenv').config();

const serverClient = new faunadb.Client({ secret:  process.env.SERVER_CLIENT_KEY });

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context, callback) => {
    try{
        const { email, password } = JSON.parse(event.body);
        await serverClient.query(
            q.Login(
                q.Match(q.Index("users_by_email"), email),
                {
                    password: password
                }
            )
        )
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