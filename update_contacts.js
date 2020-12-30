//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below will solicit users in the "SEA Current Contacts" spreadsheet to update  
// their contact info via a custom Google form. Code adapted from examples in  
// https://developers.google.com/apps-script/reference/forms
//
//////////////////////////////////////////////////////////////////////////////////////////

SALESFORCE_CONTACT_FORM_CONFIG={
    "First Name":{
        "required": true,
        "description": "",
    },
    "Last Name":
    {
        "required": true,
        "description": "",
    },
    "Mailing Street":{
        "required": true,
        "description": "",
    },
    "Mailing State/Province":{
        "required": true,
        "description": "",
    },
    "Mailing Zip/Postal Code":{
        "required": true,
        "description": "",
    },
    "Mobile":{
        "required": false,
        "description": "place cell phone contact here",
    },
    "Phone":{
        "required": false,
        "description": "leave blank if no landline available",
    },
    "Email":{
        "required": true,
        "description": "preferred non-minds matter email contact",
    },
    "Employer":{
        "required": false,
        "description": "for volunteers only",
    }
};
// Create Form object (to be prefilled with contact info)
function create_update_contacts_form() {
    // Creates the contact info update form. Returns Google form object
    // TODO: Add field descriptions and specify which ones are required
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
    return contactInfoForm
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
    for (var item in items){
        title_dict[item.getTitle()]=item;
    }
    for (var key in data) {
        
        // var item = form.addTextItem()
        // item.setTitle(key)
        var response = title_dict[key].createResponse(data[key]);
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
        columnDict[values[0][i]]=i;
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
    
    var updateContactsForm = create_update_contacts_form()
    var salesforceSpreadSheetID = PropertiesService.getScriptProperties().getProperty('salesforceSpreadSheetID');
    var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);

    var contacts = parse_contact_sheet(ss);
    var mailmerge_ss = SpreadsheetApp.create("Contact Update MailMerge", 500, 4)
    mailmerge_ss.appendRow(["FirstName", "email", "form_link"]);
    var domainname = PropertiesService.getScriptProperties().getProperty('domainname');

    // Iterate through array of user data and create prefilled form for each one
    for (var contact in contacts) {
        var prefilledFormLink = create_form_response(contact, updateContactsForm)
        var email = contact["First Name"].toLowerCase() + "." + contact["Last Name"].toLowerCase() + "@" + domainname;
        email = email.replace(" ", ".");
        email = email.replace(" ", ".");
        mailmerge_ss.appendRow([contact["First  Name"],
                                email,
                                prefilledFormLink]);
    }
}
