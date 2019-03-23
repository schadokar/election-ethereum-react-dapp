const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const electionAPIRoutes = require("./routes/electionAPI");
const contractAPIRoutes = require("./routes/contractAPI");

app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        limit:"50mb",
        extended:false,
        parameterLimit:50000    
    })
);


// use the routes specified in route folder
app.use("/api/v1", electionAPIRoutes);
app.use("/contract", contractAPIRoutes);

app.use(function(err, req,res, next){
    res.status(422).send({error: err.message});
});

//listen to the server
app.listen(process.env.port || 4000, function(){
    console.log("listening to the port 4000 .....");
});