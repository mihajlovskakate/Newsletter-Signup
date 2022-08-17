const request = require("request");
const express = require("express");
const https = require("https");
require("dotenv").config()

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public")); /*in order to use the files that ar in the computer and not online*/

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);

const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER


  const url = "https://"+MAPI_SERVER+".api.mailchimp.com/3.0/lists/"+MLIST_ID;
  const options = {
    method: "POST",
    auth: "katerina1:"+MAPI_KEY
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");

    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

  })


  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
})



