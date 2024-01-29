const express = require("express");
const bodyParser = require("body-parser");
//express-graphql is a graphql package that can be used as a middleware in express nodejs application
//that allows us to point at a schema and resolvers and routing our requests and much more
//graphql package allow us to define a schema and set up schema that follows the graphql specs
const { graphqlHTTP } = require("express-graphql");
const app = express();

const graphqlSchema = require("./graphQL/schema/index");
const graphqlResolvers = require("./graphQL/resolvers/index");

//nodemon.json will automatically be used by nodemon to restart the server and there we provide some
//comfoguration

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const mongoose = require("mongoose");
// mongoose is a object data modeling library for mongoose and nodejs, it manages relation
//between data, provide schema and translate object in code to represent them object in db

const isAuth = require("./middlewares/is-auth");
app.use(bodyParser.json()); // to parse the incoming json bodies coming down the requests and put them
//into req.body

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
    rootValue: graphqlResolvers,
    //in here we write our resolvers and they need to be of same name, these function will be called
    //for us when a incoming request comes looking for these property
  })
); //in here we pass javascript object where we configure our graphql
//api because express-graphql package need some info package from us like where is our schema, where are
// the real end points like query and mutation, where are our resolver

const mongo_url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fzivpff.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(mongo_url)
  .then(() => {
    app.listen(3000);
    console.log("Connection with database successful");
  })
  .catch((err) => {
    console.log("Problem connecting with database");
    console.log(err);
  });
