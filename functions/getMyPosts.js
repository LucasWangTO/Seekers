import faunadb, { query as q } from "faunadb"
require('dotenv').config();

var serverClient = new faunadb.Client({ secret: process.env.SERVER_CLIENT_KEY });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  let toReturn = [];

  try {
    let response = await serverClient.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("search_posts_by_contact"), data.email)
        ),
        q.Lambda(
          "person",
          q.Get(q.Var("person"))
        )
      )
    )
    console.log(response);
    for (let i = 0; i < response.data.length; i++) {
      const combinedData = response.data[i].data;
      combinedData.id = response.data[i].ref.id;
      toReturn.push(combinedData);
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
