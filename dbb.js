// Import the MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://tanmay9987:tvnmvy66@chatapp.btzmd.mongodb.net/?retryWrites=true&w=majority&appName=chatapp'; // Replace with your MongoDB URI

// Database and collection name
const dbName = 'chatapp';
const collectionName = 'users';

async function fetchData() {
    const client = new MongoClient(uri);

    // try {
    // Connect to the MongoDB server
    // await client.connect();
    // console.log('Connected to MongoDB');

    // Access the database and collection
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Fetch data (use find() to retrieve documents)
    const query = {}; // Define your query here
    const options = {
        projection: { _id: 0 }, // Specify the fields to include or exclude
    };

    const cursor = collection.find(query,options);

    //data to add
    const data = [
        { name: "tanma", age: "20", pwd: "tvnmvy", role: "muser" },
        { name: "rohit", age: "21", pwd: "null", role: "user" },
        { name: "var", age: "18", pwd: "null", role: "user" },
        { name: "luck", age: "19", pwd: "null", role: "user" },
        { name: "jay", age: "20", pwd: "null", role: "user" }
    ];
    //add data
    const result = await collection.insertOne({ name: "hero", age: "111", pwd: "zero", role: "manstrubate" });
    // Iterate through the results
    const results = await cursor.toArray();
    console.log('Fetched Data:', results);
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // } finally {
    // Close the connection
    // await client.close();
    // console.log('Connection closed');
}
// }

// Call the function
fetchData();

//fetch messages from database
// async function fetchMessage(){
//     // Convert string ID to ObjectId
//     const msgLatest = await msgcollection
//     .find({})
//     .sort({ _id: -1 }) // Sort by `_id` in descending order
//     .limit(1) // Limit the result to 1 document
//     //give it to console
//     const results = await msgLatest.toArray();
//     console.log('Fetched Data:', results);
// }