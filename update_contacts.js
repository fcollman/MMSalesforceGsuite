//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below will solicit users in the "SEA Current Contacts" spreadsheet to update  
// their contact info via a custom Google form. Code adapted from examples in  
// https://developers.google.com/apps-script/reference/forms
//
//////////////////////////////////////////////////////////////////////////////////////////

function create_form(data, formName, description=null) {
    // Creates a custom form pre-filled with fields from data
    // Arguments:
    //  - data (dict): dictionary of key, value pairs that will form the fields; for updating contacts, 
    //      required keys included "First Name", "Last Name", "Mailing Street", "Mailing State/Province",
    //      "Mailing Zip/Postal Code", "Mobile",
    //      "Phone", "Email", "Employer"
    //  - formName (str): name to give Google form
    //  - description (optional): description of the form
    //
    // Returns:
    //  - Google form link url 
    
    var form = FormApp.create(formName);
    if (description) {
        form.setDescription(description);
    }

    var formResponse = form.createResponse();
    for (var key in data) {
        // TODO: Add field descriptions and specify which ones are required*
        var item = form.addTextItem()
        item.setTitle(key)
        var response = item.createResponse(data[key]);
        formResponse.withItemResponse(response)
    }
    var url = formResponse.withItemResponse(response).toPrefilledUrl();
    Logger.log('Form URL: ' + url);

    return url
}

function parse_contact_sheet(currentUsersSheet) {
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

}

function create_update_forms(usersSheet) {
    // Parses a spreadsheet of current contacts and creates
    // a pre-filled Google form for each contact.
    // Form links will be emailed to contacts using MailMerge.js 

    var contacts = parse_contact_sheet("SEA Current Contacts")
    var formTitle = "Contact Info Update Form"
    var formDescription = "Form for updating your contact information with Minds Matter"

    // Iterate through array of user data and create prefilled form for each one
    for (var contact in contacts) {
        var prefilledForm = create_form(contact, formTitle, formDescription)
        // write out link to new sheet
        // maybe write out form id too...
    }
}
