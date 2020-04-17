'use strict';

require('dotenv').config()
const checkSecurityHeader = require('./components/checkSecurityHeader.js');
const checkSupplier = require('./components/checkSupplier.js');
const createEmails = require('./components/createEmails');
const saveDraftsToGmail = require('./components/saveDraftsToGmail')


const processEvent = (event) => {
  let securityStatus = checkSecurityHeader(event)
  let emails =  createEmails(JSON.parse(event.body))
  let emailSent = saveDraftsToGmail(emails)
  return
}

const index =  (event, context, callback) => {
  try{
    return callback(null, {statusCode: 200, body: JSON.stringify({message: "webhook recieved"})}, processEvent(event))

  }catch {
    return{
        statusCode: 502,
        body: JSON.stringify({
          message: "Error",
        })
      }
  }
}

exports.handler = index;
