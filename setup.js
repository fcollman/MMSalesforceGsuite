//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below performs steps 10, 11, and 13 of the Deployment Steps 
// outlined here: https://github.com/fcollman/MMSalesforceGsuite.   
//
//////////////////////////////////////////////////////////////////////////////////////////

function createSpreadsheet(name, sheetName, columnNames) {
    // Create a new Google sheet and return the sheet ID.
    // Arguments:
    //  - name: name of the Google sheet
    //  - sheetName: optional; set name of first sheet in Google sheet. 
    //      default is null.
    //  - columnNames (array): list of column names to set in first row of sheet.
    var sheet = SpreadsheetApp.create(name);
    
    activeSheet = sheet.getActiveSheet();
    activeSheet.setName(sheetName);

    
    var n_columns = columnNames.length;
    var first_row = activeSheet.getRange(1, 1, 1, n_columns);
    first_row.setValues([columnNames]);
    Logger.log('Spreadshet URL: ' + sheet.getUrl());
    
    return sheet.getId();
}


function setupSpreadsheets() {
    // Checks for script properties 'newUserSheetID' and 'userSuspensionSheetID'
    // If properties are not set, this function will:
    //  1. Create google sheets "User Creation" and "UserSuspension"
    //  2. Set script properties to the respective sheet IDs.
    
    var scriptProperties = PropertiesService.getScriptProperties();
    var propertiesToCheck = {
        "newUserSheetID": ["User Creation", "Sheet1"],
        "userSuspensionSheetID": ["UserSuspension", "SuspendedUsers"]
    }

    sheetColumnsMap = {
        "Sheet1": ["First Name", "mmemail" , "privateEmail", "password"],
        "SuspendedUsers": ["Name", "Email"]
    }

    for (var key in propertiesToCheck) {
        var prop = scriptProperties.getProperty(key);
        if (!prop) {
            var sheetProperties = propertiesToCheck[key];
            var spreadsheetName=sheetProperties[0], gsheetName=sheetProperties[1];
            var colNames = sheetColumnsMap[gsheetName];
            var sheetID = createSpreadsheet(spreadsheetName, sheetName=gsheetName, columnNames=colNames);
            scriptProperties.setProperty(key, sheetID);
        }
    }
}

