import faunadb, { query as q } from "faunadb"

var adminClient = new faunadb.Client({ secret: 'fnAEItsVu2ACA2xnQKBjCYt69iXgrT_gjzRHQ8-1'})
var serverClient = new faunadb.Client({ secret: 'fnAEIuaAmlACAsthLYUtmglhvf3_lcCrU2x9wVCi' });

exports.handler = (event, context, callback) => {
    const data = JSON.parse(event.body)

    return serverClient.query(
        q.Create(
            q.Collection('posts'),
            { data: data},
        )
    )
    .then((response) => {
        console.log("success", response)
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(response)
          })
    }).catch((error) => {
        console.log("error", error)
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify(error)
          })
    })  
  }