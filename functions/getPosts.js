import faunadb, { query as q } from "faunadb"

var adminClient = new faunadb.Client({ secret: 'fnAEItsVu2ACA2xnQKBjCYt69iXgrT_gjzRHQ8-1'})
var serverClient = new faunadb.Client({ secret: 'fnAEIuaAmlACAsthLYUtmglhvf3_lcCrU2x9wVCi' });

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