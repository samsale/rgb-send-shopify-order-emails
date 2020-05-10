const Handlebars = require('handlebars')
const checkSupplier = require('./checkSupplier.js');
fs = require('fs');
const MailComposer = require("nodemailer/lib/mail-composer");

// Set helper to removed forward slashes
Handlebars.registerHelper('escape', str => str.replace(/\\/g, ""));
// Set help to make the first letter of a string upper case
Handlebars.registerHelper('upperCaseFirstLetter', str => str.charAt(0).toUpperCase() + str.slice(1));

//Read the template files
let toCustomerFile = fs.readFileSync('./emailtemplates/toCustomer.html', 'utf-8')
let toSupplierFile = fs.readFileSync('./emailtemplates/toSupplier.html', 'utf-8')

//Load the handlebar templates
let toCustomerTemplate = Handlebars.compile(toCustomerFile);
let toSupplierTemplate = Handlebars.compile(toSupplierFile);

module.exports = (order) => {

  const groupLineItemsBySupplier = (order) => {
    return  order.line_items.reduce((lv, cv) =>{
          // if the key of email exists then skip, else set the value to an empty array
          lv[cv.vendorEmail] = lv[cv.vendorEmail] || [];
          // push the line item to the array assiociated with the email address
          lv[cv.vendorEmail].push(cv);
          return lv;
      }, Object.create(null));
  }

  const createOrdersForEachSupplier = (object) => {
    let perfectArray = Object.keys(object).map( supplierEmailAddress => {
    let orderForASupplier = Object.assign({}, order);
     orderForASupplier.supplierEmailAddress = supplierEmailAddress
     orderForASupplier.line_items = groupedLineItems[supplierEmailAddress]
      return orderForASupplier
    })
    return perfectArray
  }

  //Get Supplier's Email Address for each line item
  order.line_items.forEach(lineItem => {lineItem.vendorEmail = checkSupplier(lineItem.vendor)})

  //Assign a supplier email address to each line item
  let groupedLineItems = groupLineItemsBySupplier(order)

  // Create seperate orders per supplier and add only the line items for that suppluier
  let newOrdersBySupplier = createOrdersForEachSupplier(groupedLineItems)

  //create the supplier email objects and return an array
  let arrayOfEmails = newOrdersBySupplier.map(order => {
    return new MailComposer({
      from: process.env.SENDERS_EMAIL_ADDRESS,
      to: order.supplierEmailAddress,
      subject: `[${process.env.STORE_NAME}] - Sales Order ${order.name}`,
      html: toSupplierTemplate(order)
    })
  })

  // create the customer's email object
  const customerMail = new MailComposer({
    from: process.env.SENDERS_EMAIL_ADDRESS,
    to: order.customer.email,
    subject: `[${process.env.STORE_NAME}] Order ${order.name} - A Big Thank You`,
    html: toCustomerTemplate(order)
  });

  // add the customer's email object to the array
  arrayOfEmails.push(customerMail)

  //return an array of all emails in preparation for gmail
  return arrayOfEmails
}
