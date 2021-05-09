import faunadb, { query as q } from "faunadb"

var adminClient = new faunadb.Client({ secret: 'fnAEItsVu2ACA2xnQKBjCYt69iXgrT_gjzRHQ8-1'})
var serverClient = new faunadb.Client({ secret: 'fnAEIuaAmlACAsthLYUtmglhvf3_lcCrU2x9wVCi' });

<<<<<<< HEAD
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

    console.log(response)

    return {
        statusCode: 200,
        body: JSON.stringify({
          data: toReturn
      })
    }

  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
}
=======
exports.handler = (event, context, callback) => {
  var toReturn = [];
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
>>>>>>> 6bcce8fb2ba383c86ba48260d590ec4627960fb7
