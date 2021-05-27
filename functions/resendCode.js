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

    const searchIDResponse = await serverClient.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("users_by_email"), data.email)
        ),
        q.Lambda(
          "person",
          q.Get(q.Var("person"))
        )
      )
    )
    const refID = searchIDResponse.data[0].ref.id;

    const replaceTokenResponse = await serverClient.query(
      q.Update(
        q.Ref(q.Collection('Auth_Posts'), refID.toString()),
        { data: { token: userToken } },
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify(replaceTokenResponse),
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