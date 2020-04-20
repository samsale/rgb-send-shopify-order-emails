'use strict';
https://www.google.com/search?rlz=1C5CHFA_enUS821US822&sxsrf=ALeKk01rP4KQXO-8ru6YMJB5aOQPH8otLw%3A1587156523107&ei=KxaaXqWJBs-X8gLVvLzoAQ&q=test+site%3Astackoverflow.com&oq=test+site%3Astackoverflow.com&gs_lcp=CgZwc3ktYWIQAzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQR0oICBcSBDEyLThKCAgYEgQxMi0yUABYAGCkggFoAHACeACAAQCIAQCSAQCYAQCqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwjlyozmqvDoAhXPi1wKHVUeDx0Q4dUDCAw&uact=5

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
