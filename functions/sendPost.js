import faunadb, { query as q } from "faunadb"

var adminClient = new faunadb.Client({ secret: 'fnAEItsVu2ACA2xnQKBjCYt69iXgrT_gjzRHQ8-1'})
var serverClient = new faunadb.Client({ secret: 'fnAEIuaAmlACAsthLYUtmglhvf3_lcCrU2x9wVCi' });

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event, context, callback) => {

    const data = JSON.parse(event.body)

    try {
        const response = await serverClient.query(
            q.Create(
                q.Collection('posts'),
                { data: data },
            )
        )
        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers
        }
    
    } catch (err) {
        console.log(error)
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}