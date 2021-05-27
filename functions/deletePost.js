import faunadb, { query as q } from "faunadb"
require('dotenv').config();

const serverClient = new faunadb.Client({ secret:  process.env.SERVER_CLIENT_KEY });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    const postID = data.id;
    try {
        const response = await serverClient.query(
        q.Delete(
            q.Ref(
                q.Collection("posts"), postID
            )
        ))

        return {
            statusCode: 200,
            body: JSON.stringify(response),
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
