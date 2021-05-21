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
    const data = JSON.parse(event.body);
    const accessCode = data.token;
    const email = data.email;

    try {        
        const response = await serverClient.query(
            q.Map(
                q.Paginate(
                q.Match(q.Index("users_by_email"), email)
                ),
                q.Lambda(
                "person",
                q.Get(q.Var("person"))
                )
            ))/*.then(async (data) => {
                

                               
            })*/
        const refID = response.data[0].ref.id;
        const accessGranted = response.data[0].data.token.localeCompare(accessCode) ? false : true;
        console.log(accessGranted);
        if (accessGranted) {
          const replaceTokenResponse = await serverClient.query(
            q.Update(
              q.Ref(q.Collection('Auth_Posts'), refID.toString()),
              { data: { confirmed: true} },
            )
          )
        }        
        
        return {
            statusCode: 200,
            body: JSON.stringify({
            data: accessGranted
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
