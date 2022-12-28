const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.jnuj2ye.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const userTasks = client.db('daily-task').collection('user-tasks');


async function run() {
    //set tasks in db

    app.post('/user-task', async (req, res) => {
        const userTask = req.body;
        const result = await userTasks.insertOne(userTask);
        res.send(result);
    })

}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log('Server running')
})
