const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const message = req.body.message;
  const email = req.body.email;
  // const pass=req.body.pass;
  // console.log(fname+"<br>"+message+"<br>"+email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          MESSAGE: message,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/378d5144a3";
  const options = {
    method: "post",
    auth: process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.listen(process.env.PORT || 3001, function () {
  console.log("Server Started");
});
