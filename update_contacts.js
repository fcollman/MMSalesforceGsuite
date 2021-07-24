//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below will solicit users in the "SEA Current Contacts" spreadsheet to update  
// their contact info via a custom Google form. Code adapted from examples in  
// https://developers.google.com/apps-script/reference/forms
//
//////////////////////////////////////////////////////////////////////////////////////////

SALESFORCE_CONTACT_FORM_CONFIG = {
  "First Name": {
    "required": true,
    "description": "",
  },
  "Last Name":
  {
    "required": true,
    "description": "",
  },
  "Mailing Street": {
    "required": true,
    "description": "",
  },
  "Mailing City": {
    "required": true,
    "description": "",
  },
  "Mailing State/Province": {
    "required": true,
    "description": "",
  },
  "Mailing Zip/Postal Code": {
    "required": true,
    "description": "",
  },
  "Mobile": {
    "required": false,
    "description": "place cell phone contact here",
  },
  "Phone": {
    "required": false,
    "description": "leave blank if no landline available",
  },
  "Email": {
    "required": true,
    "description": "preferred non-minds matter email contact",
  },
  "Employer": {
    "required": false,
    "description": "for volunteers only",
  },
  "Title": {
    "required": false,
    "description": "title at work (for volunteers only)",
  }
};
// Create Form object (to be prefilled with contact info)
function create_update_contacts_form() {
  // Creates the contact info update form. Returns Google form object
  // TODO: Add field descriptions and specify which ones are required
  var scriptProps = PropertiesService.getScriptProperties();
  var formID = scriptProps.getProperty('contactUpdateFormId');
  Logger.log(formID);
  if (formID == null) {
    var formTitle = "Contact Info Update Form"
    var formDescription = "Form for updating your contact information with Minds Matter"
    var contactInfoForm = FormApp.create(formTitle);
    contactInfoForm.setDescription(formDescription);
    for (var key in SALESFORCE_CONTACT_FORM_CONFIG) {
      var item_config = SALESFORCE_CONTACT_FORM_CONFIG[key];
      var item = contactInfoForm.addTextItem();
      item.setHelpText(item_config['description']);
      item.setRequired(item_config['required']);
      item.setTitle(key);
    }
    formID = contactInfoForm.getId();
    scriptProps.setProperty('contactUpdateFormId', formID);
  }
  else {
    contactInfoForm = FormApp.openById(formID);
  }
  return contactInfoForm;
}

function create_form_response(data, form) {
  // Pre-fills a form pre-filled with fields from data. Fields in form must match keys of data.
  // Arguments:
  //  - data (dict): dictionary of key, value pairs that will be used to prefill form fields; 
  //      for updating contacts, required keys included "First Name", "Last Name", "Mailing Street", 
  //      "Mailing State/Province", "Mailing Zip/Postal Code", "Mobile", "Phone", "Email", "Employer"
  //  - form (Form object): a Google Form object returned from the FormApp.create() function
  //
  // Returns:
  //  - url to prefilled Google form

  var formResponse = form.createResponse();
  var items = form.getItems();
  var title_dict = {};
  for (var item in items) {
    title_dict[items[item].getTitle()] = items[item];
  }
  for (var key in data) {

    // var item = form.addTextItem()
    // item.setTitle(key)
    var item = title_dict[key]
    var response = item.asTextItem().createResponse(data[key]);
    formResponse.withItemResponse(response);
  }
  var url = formResponse.withItemResponse(response).toPrefilledUrl();
  Logger.log('Form URL: ' + url);

  return url
}

function parse_contact_sheet(spreadsheet) {
  // Reads a spreadsheet of Current Contacts and returns
  // an array of dictionaries with key, value pairs for 
  // each required field in the "Contact Info Update Form" 

  // Required Fields:
  //  - First Name
  //  - Last Name
  //  - Mailing Street
  //  - Mailing State/Province
  //  - Mailing Zip/Postal Code
  //  - Mobile
  //  - Phone
  //  - Email
  //  - Employer 

  usersSheet = spreadsheet.getActiveSheet();
  range = usersSheet.getDataRange();
  values = range.getValues();

  // Get num rows and columns
  lastRow = range.getLastRow();
  lastColumn = range.getLastColumn();

  // Map column names to column index 
  var columnDict = {}
  for (i = 0; i < lastColumn; i++) {
    columnDict[values[0][i]] = i;
  }

  var contacts = [];
  for (i = 1; i < lastRow; i++) {
    var contact = {};
    for (var field in SALESFORCE_CONTACT_FORM_CONFIG) {
      colIndex = columnDict[field]
      contact[field] = values[i][colIndex]
    }

    Logger.log(contact);
    contacts.push(contact);
  }
  return contacts
}

function create_prefilled_links() {
  // Parses a spreadsheet of current contacts and creates
  // a pre-filled Google form for each contact.
  // Form links will be emailed to contacts using MailMerge.js 
  var scriptProps = PropertiesService.getScriptProperties();
  var updateContactsForm = create_update_contacts_form()
  var salesforceSpreadSheetID = scriptProps.getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);

  var contacts = parse_contact_sheet(ss);
  var mailmerge_sheetID = PropertiesService.getScriptProperties().getProperty('contactMailMergeSheetID');
  if (mailmerge_sheetID == null) {
    var mailmerge_ss = SpreadsheetApp.create("Contact Update MailMerge", 500, 4);
    mailmerge_sheetID = mailmerge_ss.getId();
    scriptProps.setProperty('contactMailMergeSheetID', mailmerge_sheetID);
    mailmerge_ss.appendRow(["FirstName", "email", "form_link"]);
  }
  else {
    var mailmerge_ss = SpreadsheetApp.openById(mailmerge_sheetID);
    var activeSheet = mailmerge_ss.getActiveSheet();
    if (activeSheet.getMaxRows() > 1) {
      activeSheet.deleteRows(2, activeSheet.getMaxRows() - 1)
    }
  }

  var domainname = scriptProps.getProperty('domainname');

  // Iterate through array of user data and create prefilled form for each one
  for (var idx in contacts) {
    var contact = contacts[idx];
    Logger.log(idx)
    var prefilledFormLink = create_form_response(contact, updateContactsForm)
    var email = contact["First Name"].toLowerCase() + "." + contact["Last Name"].toLowerCase() + "@" + domainname;
    email = email.replace(" ", ".");
    email = email.replace(" ", ".");
    mailmerge_ss.appendRow([contact["First Name"],
      email,
      prefilledFormLink]);
  }
}

function add_salesforce_ID_to_users() {
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var scriptProps = PropertiesService.getScriptProperties();
  var salesforceSpreadSheetID = scriptProps.getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);
  var salesforceSheetName = PropertiesService.getScriptProperties().getProperty('salesforceSheetName');
  var sheet = ss.getSheetByName(salesforceSheetName);
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1, 1, 1, lastColumn);
  var rangeValues = searchRange.getValues();

  var columnDict = {}
  for (i = 0; i < lastColumn; i++) {
    columnDict[rangeValues[0][i]] = i;
  }

  data = rangeData.getValues();
  for (i = 1; i < lastRow; i++) {
    var email = data[i][columnDict['First Name']].toLowerCase() + "." + data[i][columnDict['Last Name']].toLowerCase() + "@" + domainname;
    email = email.replace(" ", ".");
    email = email.replace(" ", ".");

    try {
      var user = AdminDirectory.Users.get(email);
    }
    catch (e) {
      Logger.log("email not found " + email);
      var user = null;
    }
    if (user != null) {
      var exIDs = user.getExternalIds();
      var salesforceID = data[i][columnDict["Contact ID"]];
      if (exIDs == null) {
        user.setExternalIds([{
          "value": salesforceID,
          "type": "account"
        }]);
        AdminDirectory.Users.update(user, email);
      }
    }
  }

}

function SalesforceLogin() {
  var sf_version = "42.0";
  var instanceUrl = "https://na88.lightning.force.com/";
  var scriptProps = PropertiesService.getScriptProperties();
  var token = scriptProps.getProperty('sfAuthToken')
  var soap_url = 'https://login.salesforce.com/services/Soap/u/' + sf_version;
  var client_id = 'RestForce'
  var username = scriptProps.getProperty('sfUsername');
  var password = scriptProps.getProperty('sfPassword');
  login_soap_request_body = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
      <env:Envelope\
              xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" \
              xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\
              xmlns:env=\"http://schemas.xmlsoap.org/soap/envelope/\"\
              xmlns:urn=\"urn:partner.soap.sforce.com\">\
          <env:Header>\
              <urn:CallOptions>\
                  <urn:client>" + client_id + "</urn:client>\
                  <urn:defaultNamespace>sf</urn:defaultNamespace>\
              </urn:CallOptions>\
          </env:Header>\
          <env:Body>\
              <n1:login xmlns:n1=\"urn:partner.soap.sforce.com\">\
                  <n1:username>" + username + "</n1:username>\
                  <n1:password>"+ password + token + "</n1:password>\
              </n1:login>\
          </env:Body>\
      </env:Envelope>";
  var options = {
    'headers': {
      'SOAPAction': 'login',
      'charset': 'UTF-8'
    },
    'contentType': 'text/xml',
    'payload': login_soap_request_body
  }
  var response = UrlFetchApp.fetch(soap_url, options);
  var soap = XmlService.getNamespace("http://schemas.xmlsoap.org/soap/envelope/");

  var document = XmlService.parse(response.getContentText());
  var root = document.getRootElement();
  var result = root.getChild('Body', soap).getChildren()[0].getChildren()[0]
  var sforce = result.getNamespace();

  var serverUrl = result.getChild('serverUrl', sforce).getValue();
  var instanceUrl = 'https://' + serverUrl.split('/')[2] + "/";
  var sessionID = result.getChild('sessionId', sforce).getValue();
  return {
    'instanceUrl': instanceUrl,
    'sessionID': sessionID
  }
}

function querySalesforce(soql) {
  var scriptProps = PropertiesService.getScriptProperties();
  var instanceUrl = "https://na88.lightning.force.com/";
  var queryUrl = instanceUrl + "/services/data/v42.0/query?q=" + encodeURIComponent(soql);
  var sfAuthToken = scriptProps.getProperty('sfAuthToken')
  var options = {
    headers: {
      Authorization: 'Bearer ' + sfAuthToken
    }
  }
  var response = UrlFetchApp.fetch(queryUrl, options);
  var queryResult = Utilities.jsonParse(response.getContentText());
  return queryResult;
}

function postSalesforceContact(contactId, contact, sflogin) {
  var scriptProps = PropertiesService.getScriptProperties();
  var queryUrl = sflogin.instanceUrl + "/services/data/v42.0/sobjects/Contact/" + contactId;

  var options = {
    "contentType": "application/json",
    "method": "patch",
    headers: {
      "Authorization": 'Bearer ' + sflogin.sessionID,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(contact),
  }
  var response = UrlFetchApp.fetch(queryUrl, options);
  var queryResult = Utilities.jsonParse(response.getContentText());
  return queryResult;
}

function update_salesforce_contact_info() {

  var scriptProps = PropertiesService.getScriptProperties();
  var updateContactsForm = create_update_contacts_form()

  var responseID = updateContactsForm.getDestinationId();
  var responsess = SpreadsheetApp.openById(responseID);
  var headers = createHeaderIfNotFound_('UpdateStatus', responsess);
  var sheet = responsess.getActiveSheet();
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1, 1, 1, lastColumn);
  var rangeValues = searchRange.getValues();
  var sflogin = SalesforceLogin();
  var columnDict = {}
  for (i = 0; i < lastColumn; i++) {
    columnDict[rangeValues[0][i]] = i;
  }
  data = rangeData.getValues();


  for (i = 1; i < lastRow; i++) {
    status = data[i][columnDict['UpdateStatus']]
    if (status == "") {
      email = data[i][columnDict['Email Address']]
      Logger.log(email)
      var user = AdminDirectory.Users.get(email);
      var phones = []
      var mobile_num = data[i][columnDict['Mobile']]
      if (mobile_num != "") {
        phones.push({
          "type": "mobile",
          "value": mobile_num,
          "primary": true
        })
      }
      var land_num = data[i][columnDict['Phone']]
      if (land_num != "") {
        phones.push({
          "type": "home",
          "value": land_num,
          "primary": false
        })
      }
      emails = user.getEmails()
      for (var email in emails) {
        if (emails[email].type == 'home') {
          Logger.log(emails[email]);
          emails[email].value = data[i][columnDict['Email']]
        }
      }
      user_update = {
        "emails": emails,
        "phones": phones
      }
      // TODO: update name, if name change add new name as alias 
      Logger.log(user)
      AdminDirectory.Users.update(user_update, user.id);
      externalIDs = user.getExternalIds()
      var salesforceID = null;
      for (var extID in externalIDs) {
        if (externalIDs[extID].type == 'account') {
          var salesforceID = externalIDs[extID].value
          contactdata = {
            'FirstName': data[i][columnDict['First Name']],
            'LastName': data[i][columnDict['Last Name']],
            'MailingStreet': data[i][columnDict['Mailing Street']],
            'MailingCity': data[i][columnDict['Mailing City']],
            'MailingPostalCode': data[i][columnDict['Mailing Zip/Postal Code']],
            'Phone': data[i][columnDict['Phone']],
            'MobilePhone': data[i][columnDict['Mobile']],
            'Email': data[i][columnDict['Email']],
            'Employer__c': data[i][columnDict['Employer']],
            'Title': data[i][columnDict]['Title']
          }
          postSalesforceContact(salesforceID, contactdata, sflogin)
          sheet.getRange(i + 1, lastColumn).setValue("Done").clearFormat().setComment(new Date());;
        }
      }
      if (salesforceID == null) {
        Logger.log('No salesforce ID for ' + email)
      }
      //
      //break;

    }
  }

}