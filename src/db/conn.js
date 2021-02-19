const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/test";
try {
    mongoose.connect( uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }, () =>
    console.log("connected"));    
    }catch (error) { 
    console.log("could not connect");    
}