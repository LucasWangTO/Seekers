import faunadb, { query as q } from "faunadb"
require('dotenv').config();

var adminClient = new faunadb.Client({ secret: process.env.ADMIN_CLIENT_KEY });
var serverClient = new faunadb.Client({ secret:  process.env.SERVER_CLIENT_KEY });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context, callback) => {

  let toReturn = [];

  try {
    let response = await serverClient.query(
      q.Map(
          q.Paginate(q.Documents(q.Collection('posts'))),
          q.Lambda(x => q.Get(x))
        ))
    
    for (let i = 0; i < response.data.length; i++) {
      toReturn.push(response.data[i].data);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
          data: toReturn
        }),
        headers
    }

  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
}
