const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 2000;

// midlewarea
app.use(cors())
app.use(express.json())

console.log(process.env.DB_PASS)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p7hqbnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    const database = client.db("UserDB");
    const UsersCollection = database.collection("users");

    app.get('/user', async(req, res)=>{
      const cursor = UsersCollection.find();
       const result = await cursor.toArray()
       res.send(result)
    })

    app.get('/user/:id' , async(req, res)=>{
       const id = req.params.id;
       console.log('38', id)
       const query ={_id : new ObjectId(id)}
       const up = await UsersCollection.findOne(query)
       console.log('42',up)
       res.send(up)
    })

    app.post('/user', async(req, res)=>{
       const user = req.body;
      //  console.log(user)
       const result = await UsersCollection.insertOne(user);
       res.send(result)

    })

    // update user
    app.put('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const user= req.body;
      console.log(user)

      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updateUser = {
        $set:{
           name: user.name,
           email: user.email
        }
      }
      const result = await UsersCollection.updateOne(filter, updateUser, options);
      res.send(result)
    })

    app.delete('/user/:id', async(req,res)=>{
        const id = req.params.id;
        // console.log('delete this id', id)
        const query = {_id: new ObjectId(id)};
        const result = await UsersCollection.deleteOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    console.log('CRUD is runnig well')
    res.send('crud is well')
})




app.listen(port ,()=>{
    console.log(`CRUD Server is runnig well ${port}`)
})


// password
// TZl4F30Xqut2b06Y