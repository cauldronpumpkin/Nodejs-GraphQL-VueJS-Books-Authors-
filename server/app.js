const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET = "ilovewebdevelopment1201";
const authen = require('./middleware/authen');
const cors = require('cors');

mongoose.connect('mongodb+srv://ishu:mymellon@tryinggraphql-nz9uu.mongodb.net/test?retryWrites=true&w=majority');
mongoose.connection.once('open', () => {
    console.log("Connected Bictch");
})

const corsOptions = {
    origin: 'http://127.0.0.1:8080'
}
app.use(cors(corsOptions));
app.use(authen);


app.use('/graphql', graphqlHTTP(({
    schema,
    graphiql: true,
})));

app.listen(3000, () => {
    console.log("listensing to port 4000");
})