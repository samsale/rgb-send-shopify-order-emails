var {
  google
} = require("googleapis");
let privatekey = require("../credentials.json");


// configure a JWT auth client
const createJwtAuth = async () => {
  let jwtClient = await new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://mail.google.com/'],
    process.env.SENDERS_EMAIL_ADDRESS
  );
  //authenticate request
  await jwtClient.authorize((err, tokens) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully connected!");
    }
  });
  return jwtClient
}


const saveDraftToGmail = async (messagesArray) => {
  let jwt = await createJwtAuth()

  const gmail = google.gmail({version: 'v1',jwt});

  for (var email of messagesArray) {
    email.compile().build(async (err, message) => {
      let raw = Buffer.from(message).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

      gmail.users.drafts.create({
        auth: jwt,
        userId: 'me',
        resource: {
          message: {
            raw: raw
          }
        }
      })
    });

  }
  return
}

module.exports = (emailObject) => {
  let response = saveDraftToGmail(emailObject)
  return response
}
