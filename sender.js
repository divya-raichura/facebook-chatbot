// here others will send us req and we are the one deciding what to respond!
// when we do 'node sender.js' we are starting our server, so at https://localhost:${port} this response
// write here will be sent to person visiting(making req) to above url
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios").default;

// our app is server cause of express as well as client cause of axios

const port = 3000;
const local_token = 9879;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req.query);
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];
  console.log(token, local_token);
  if (token == local_token) {
    // we are verifying if this is the system we want to interract with or not
    // jo fb server ko diya tha wohi token idar locally bhi hona chahiye, return challenge value agar dono server
    // ke pas same token hai
    res.send(challenge);
  } else {
    res.send("failed");
  }
});

app.post("/", (req, res) => {
  // console.log(JSON.stringify(req.body));
  const body = req.body;

  body.entry.forEach((entry) => {
    if (entry["messaging"]) {
      entry.messaging.forEach((messaging) => {
        respond(messaging.sender, messaging.message.text);
      });
    }
  });

  res.send("ok");
});

function respond(sender, text) {
  console.log(sender, text);

  const access_token =
    "EAALDClsuIawBACwzWBS5q6HgJgxJXMn4c6cRDKIvnVWW1Nhux2ZBtKaCXB2hZBHA1zjl0NwszwTjJwE9urr1pqh8zZAU18C3cjZC7Hdekc8B0oWQFqhvxNTIPja1Oid4YTG3wpfSYZB4DuMvuQS3NhStiyEAAJ3GCeSsRC8SFymZA5Ha5qzr4MWOX4GIoPqb4ZD";
  const url = `https://graph.facebook.com/v14.0/me/messages?access_token=${access_token}`;

  var message = {
    recipient: sender,
    message: {
      text: text + " ~ By the echo bot",
    },
  };

  axios.post(url, message).then((response) => {
    console.log("responded", response);
  });
}

app.listen(port, () => {
  console.log(`App listening at localhost:${port} `);
});
