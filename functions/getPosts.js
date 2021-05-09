import faunadb, { query as q } from "faunadb"

var adminClient = new faunadb.Client({ secret: 'fnAEItsVu2ACA2xnQKBjCYt69iXgrT_gjzRHQ8-1'})
var serverClient = new faunadb.Client({ secret: 'fnAEIuaAmlACAsthLYUtmglhvf3_lcCrU2x9wVCi' });
var toReturn = [];

exports.handler = (event, context, callback) => {
    return serverClient.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('posts'))),
            q.Lambda(x => q.Get(x))
          ))
    .then((response) => {
        console.log("success", response)
        var i;
        for(i = 0; i < response.data.length; i++) {
          toReturn.push(response.data[i].data);
        }
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              data: toReturn
            })
          })
    }).catch((error) => {
        console.log("error", error)
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify(error)
          })
    })  
  }