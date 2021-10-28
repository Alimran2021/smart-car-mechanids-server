const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.API_USER}:${process.env.API_PASS}@cluster0.pdsxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
});
async function run() {
    try {
        await client.connect()
        const database = client.db("smartMechanics")
        const serviceCollection = database.collection("services")
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const service = await cursor.toArray()
            res.json(service)
        })
        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const singleService = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(singleService)
            res.send(result)
            console.log('hitting id', id)
        })
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        })
        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
            console.log('deleted this', result)
        })

    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    console.log('hitting server',)
    res.send('response')
})
app.get('/first', (req, res) => {
    res.send('hello first')
})
app.listen(port, () => {
    console.log('listening to port', port)
})