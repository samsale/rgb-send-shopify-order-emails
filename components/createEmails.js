const Handlebars = require('handlebars')
const checkSupplier = require('./checkSupplier.js');
fs = require('fs');
const MailComposer = require("nodemailer/lib/mail-composer");


module.exports =  (order) =>{
    Handlebars.registerHelper('escape', str => str.replace(/\\/g, ""));
    Handlebars.registerHelper('upperCaseFirstLetter', str => str.charAt(0).toUpperCase() + str.slice(1));
    let toCustomerFile = fs.readFileSync('./emailtemplates/toCustomer.html', 'utf-8')
    let toSupplierFile = fs.readFileSync('./emailtemplates/toSupplier.html', 'utf-8')
    let toCustomerTemplate = Handlebars.compile(toCustomerFile);
    let toSupplierTemplate = Handlebars.compile(toSupplierFile);
    let customerHTML = toCustomerTemplate(order);
    let supplierHTML = toSupplierTemplate(order);

    let emailObject = {
      customerEmail: order.customer.email,
      customerSubject: `[${process.env.STORE_NAME}] Order ${order.name} - A Big Thank You`,
      customerHTML,
      supplierSubject: `[${process.env.STORE_NAME}] - Sales Order ${order.name}`,
      supplierHTML,
      supplier: order.line_items[0].vendor
    }

    emailObject.supplierEmail = checkSupplier(emailObject.supplier)

    const customerMail = new MailComposer({
      from: process.env.SENDERS_EMAIL_ADDRESS,
      to: emailObject.customerEmail,
      subject: emailObject.customerSubject,
      html: emailObject.customerHTML
    });

    const suplierMail = new MailComposer({
      from: process.env.SENDERS_EMAIL_ADDRESS,
      to: emailObject.supplierEmail,
      subject: emailObject.supplierSubject,
      html: emailObject.supplierHTML
    });
    const arrayOfEmails = [customerMail, suplierMail];

  return arrayOfEmails

}
