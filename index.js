const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.jnuj2ye.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const userTasks = client.db('daily-task').collection('user-tasks');


async function run() {
    //set tasks in db
    app.post('/user-task', async (req, res) => {
        const userTask = req.body;
        const result = await userTasks.insertOne(userTask);
        res.send(result);
    })

    //get tasks from db by email
    app.get('/userTasks/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const tasks = await userTasks.find(query).toArray();
        res.send(tasks);
    })


    //delete task
    app.delete('/userTasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userTasks.deleteOne(query);
        res.send(result);
    })

    //complete task api
    app.patch('/userTasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const doc = {
            $set: {
                isComplete: true
            }
        }
        const result = await userTasks.updateOne(filter, doc);
        res.send(result);
    })

    //get completed tasks
    app.get('/completed/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const tasks = await userTasks.find(query).toArray();
        res.send(tasks);
    })

}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log('Server running')
})
