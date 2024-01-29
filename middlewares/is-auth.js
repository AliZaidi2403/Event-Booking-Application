const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); //it will see the authorization field in the coming
  //request header to check whether theres a token, if there is a token that means user is signed in

  if (!authHeader) {
    //if there is no token in the req we want to attach a property to the req body
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1]; //Authorization : Bearer ryhncsfyjmbcfhwej
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

//here our middleware will do a couple of checks to make sure that we have valid token or not
//but it does never throw an error, it just add some meta data on the request body to verify the authorization
// now how can we use this middleware
// in rest api it was simple there we have bunch of routes and we can put this middleware to every
//route that we want to protect
//but in graphql we only have one endpoint, we can add a middleware to that but then the whole app is
//either locked or not, so that is the reason we are just adding meta data to req insr=tead of throwing
//error
