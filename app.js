const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const { post } = require("request");
require('dotenv').config();
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT||3000,function () {
 console.log("Server is running at port 3000");
});

app.get("/", function (req, res) {
 res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({

 apiKey: process.env.API_KEY,

 server: process.env.SERVER
});

app.post("/", function (req,res) {

const firstName = req.body.firstName;
const secondName = req.body.secondName;
const email = req.body.email;

const listId = process.env.LIST_ID
 
const subscribingUser = {
 firstName: firstName,
 lastName: secondName,
 email: email
};

 async function run() {
 const response = await mailchimp.lists.addListMember(listId, {
 email_address: subscribingUser.email,
 status: "subscribed",
 merge_fields: {
 FNAME: subscribingUser.firstName,
 LNAME: subscribingUser.lastName
}
});
//If OK
 res.sendFile(__dirname + "/success.html")
 console.log("Successfully added contact as an audience member. The contact's id is ${response.id}.");
}

//If errors (same email & other errors)
run().catch(e => res.sendFile(__dirname + "/failure.html"));

});


app.post('/failure', function (req, res) {
    res.redirect('/')
})
