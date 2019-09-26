/**
 * Lists users in a G Suite domain.
 */
function generateRandom() {
  var data = "xxxxxx";
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&<>*-";
  var text = ""; //Reset text to empty string
  for (var j = 1; j <= data.length; j++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function addUser(firstName, lastName, default_email, home_email, phone, dry_run) {
  var userID = PropertiesService.getScriptProperties().getProperty('newUserSheetID');
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/"+ userID);
  var sheet = ss.getSheets()[0]
  var pwd = "MM2019" + firstName + generateRandom();

  var user = {
    primaryEmail: default_email,
    name: {
      givenName: firstName,
      familyName: lastName
    },
    // Generate a random password string.
    password: pwd,
    changePasswordAtNextLogin: true,
    phones: [
      {
        primary: true,
        value: phone,
        type: "home"
      }
    ],
    emails: [{
      address: home_email,
      type: "home"
    }]
  };
  if (!dry_run) {
    user = AdminDirectory.Users.insert(user);
    sheet.appendRow([firstName, default_email, home_email, pwd]);
  }

  //Logger.log('%s',user);
  Logger.log('User created %s, %s, %s', user.primaryEmail, home_email, pwd);

}

function addGroupMember(userEmail, groupEmail, dry_run) {
  
    group = GroupsApp.getGroupByEmail(groupEmail)
    if (!group.hasUser(userEmail)) {
      var member = {
        email: userEmail,
        role: "MEMBER"
      };
      if (!dry_run) {
        member = AdminDirectory.Members.insert(member, groupEmail);
      }
      Logger.log("User %s added as a member of group %s.", userEmail, groupEmail);
    }
  }
  
function isUser(email) {
  try {
    var user = AdminDirectory.Users.get(email);
    return true;
  }
  catch (e) {
    return false;
  }
}

/**
 * Lists all the users in a domain sorted by first name.
 */
function listAllUsers() {
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var pageToken;
  var page;
  var allUsers = []
  do {
    page = AdminDirectory.Users.list({
      domain: domainname,
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        allUsers.push(user)
        //Logger.log('%s (%s)', user.name.fullName, user.primaryEmail);
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return allUsers;
}


function syncGoogleWithSalesforce() {
  var dry_run = false;
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var salesforceSpreadSheetID = PropertiesService.getScriptProperties().getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);
  var volunteer_group = GroupsApp.getGroupByEmail("volunteers@" + domainname);
  var ec_group = GroupsApp.getGroupByEmail("ec@"+domainname);
  var board_group = GroupsApp.getGroupByEmail("board@"+domainname);
  var active_group = GroupsApp.getGroupByEmail("active@"+domainname);

  var student_groups = {}
  var student_year_inds = {}
  var current_student_inds = []
  var volunteer_inds = [];
  var ec_inds = [];
  var board_inds = [];
  var math_inds = [];
  var testprep_inds = [];
  var writing_inds = [];
  var enrich_inds = [];

  for (i = 2020; i <= 2022; i++) {
    student_groups[i] = GroupsApp.getGroupByEmail("students" + i + "@" + domainname);
    student_year_inds[i] = [];
  }

  Logger.log(ss.getName());
  
  var salesforceSheetName = PropertiesService.getScriptProperties().getProperty('salesforceSheetName');
  var sheet = ss.getSheetByName(salesforceSheetName);
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1, 1, 1, lastColumn - 1);
  var rangeValues = searchRange.getValues();


  var volunteerTypeCol = -1;
  var emailCol = -1;
  var leadershipCol = -1;
  var yearCol = -1;
  var rolenonleadCol = -1;
  var firstNameCol = -1;
  var lastNameCol = -1;
  var phoneCol = -1;


  for (i = 0; i < lastColumn; i++) {
    if (rangeValues[0][i] === 'Contact Record Type') volunteerTypeCol = i;
    else if (rangeValues[0][i] === 'Email') emailCol = i;
    else if (rangeValues[0][i] === 'Leadership') leadershipCol = i;
    else if (rangeValues[0][i] === 'Year') yearCol = i;
    else if (rangeValues[0][i] === 'Role (Non-Leadership)') rolenonleadCol = i;
    else if (rangeValues[0][i] === 'First Name') firstNameCol = i;
    else if (rangeValues[0][i] === 'Last Name') lastNameCol = i;
    else if (rangeValues[0][i] === 'Mobile') phoneCol = i;
  }

  Logger.log("CRT is " + volunteerTypeCol + ", Email is " + emailCol);
  Logger.log("yearCol is " + yearCol);
  data = rangeData.getValues();

  // allCurrentUsers = listAllUsers();

  for (i = 1; i < lastRow - 1; i++) {
    phone = data[i][phoneCol];
    var email = data[i][firstNameCol].toLowerCase() + "." + data[i][lastNameCol].toLowerCase() + "@" + domainname;
    email = email.replace(" ", ".");
    email = email.replace(" ", ".");

    if (data[i][volunteerTypeCol] === 'Volunteer') {
      volunteer_inds.push(i);
      if (!isUser(email)) {
        addUser(data[i][firstNameCol],
          data[i][lastNameCol],
          email,
          data[i][emailCol],
          data[i][phoneCol],
          dry_run);
      }

      if (!volunteer_group.hasUser(email)) {
        addGroupMember(email, volunteer_group.getEmail(), dry_run);
      }
      Utilities.sleep(1000)
    }
    if (data[i][leadershipCol].toString().indexOf('Chapter Board') != -1) {
      board_inds.push(i);
      if (!isUser(email)) {
        addUser(data[i][firstNameCol],
          data[i][lastNameCol],
          email,
          data[i][emailCol],
          data[i][phoneCol],
          dry_run);
      }

      if (!board_group.hasUser(email)) {
        addGroupMember(email, board_group.getEmail(), dry_run);
      }
      Utilities.sleep(1000)
    }
    if (data[i][leadershipCol].toString().indexOf('Chapter Executive Committee') != -1) {
      ec_inds.push(i);
      if (!ec_group.hasUser(email)) {
        addGroupMember(email, ec_group.getEmail(), dry_run);
      }

    }

    if (data[i][volunteerTypeCol] === 'Student') {
      current_student_inds.push(i);
      student_year_inds[data[i][yearCol]].push(i);
      if (data[i][yearCol] > 2019) {
        if (!isUser(email)) {
          addUser(data[i][firstNameCol],
            data[i][lastNameCol],
            email,
            data[i][emailCol],
            data[i][phoneCol],
            dry_run);
        }
        if (!student_groups[data[i][yearCol]].hasUser(email)) {
          addGroupMember(email, student_groups[data[i][yearCol]].getEmail(), dry_run);
        }

      }
      Utilities.sleep(1000)
    }
    if (isUser(email)) {
      if (!active_group.hasUser(email)) {
        addGroupMember(email, active_group.getEmail(), dry_run);
      }
    }

    //  TODO: auto add math instrucgtors, WCT, test prep and senior enrichment
    //  instructors to their appropriate groups
    if (data[i][rolenonleadCol]) {
      if (data[i][rolenonleadCol].toString().indexOf('Math') != -1) {
        math_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('W&CT') != -1) {
        writing_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('Test Prep') != -1) {
        testprep_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('Senior') != -1) {
        enrich_inds.push(i);
      }
    }

  }

}

function isUserByEmail(user, rows, emailCol) {
  for (var r = 1; r < rows.length; r++) {
    var email = rows[r][emailCol];
    for (var e = 0; e < user.emails.length; e++) {
      if (email.indexOf(user.emails[e].address) != -1) {
        return true;
      }
    }
  }
  return false;
}
function isUserbyName(user, rows, fCol, lCol) {
  for (var r = 1; r < rows.length; r++) {
    var fullname = rows[r][fCol] + " " + rows[r][lCol]
    if (fullname.indexOf(user.name.fullName) != -1) {
      return true;
    }

  }
  return false;
}

// function for checking that current gsuite users should exist in the domain
// useful for automatatically suspending accounts of former org members
function auditActive() {
  all_users = listAllUsers()
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var salesforceSpreadSheetID = PropertiesService.getScriptProperties().getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);
  
  var salesforceSheetName = PropertiesService.getScriptProperties().getProperty('salesforceSheetName');
  var sheet = ss.getSheetByName(salesforceSheetName);

  var userSuspensionSheetID = PropertiesService.getScriptProperties().getProperty('userSuspensionSheetID');
  var suspendedSpreadSheet = SpreadsheetApp.openById(userSuspensionSheetID);
  var suspendedSheet = suspendedSpreadSheet.getSheetByName("SuspendedUsers");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var rangeValues = rangeData.getValues();
  var user;

  var volunteerTypeCol = -1;
  var emailCol = -1;
  var leadershipCol = -1;
  var yearCol = -1;
  var rolenonleadCol = -1;
  var firstNameCol = -1;
  var lastNameCol = -1;
  var phoneCol = -1;

  var admin_accounts = "admin@"+domainname+ ",marketing@" +domainname
  for (i = 0; i < lastColumn; i++) {
    if (rangeValues[0][i] === 'Contact Record Type') volunteerTypeCol = i;
    else if (rangeValues[0][i] === 'Email') emailCol = i;
    else if (rangeValues[0][i] === 'Leadership') leadershipCol = i;
    else if (rangeValues[0][i] === 'Year') yearCol = i;
    else if (rangeValues[0][i] === 'Role (Non-Leadership)') rolenonleadCol = i;
    else if (rangeValues[0][i] === 'First Name') firstNameCol = i;
    else if (rangeValues[0][i] === 'Last Name') lastNameCol = i;
    else if (rangeValues[0][i] === 'Mobile') phoneCol = i;
  }
  suspendedSheet.deleteRows(2, suspendedSheet.getMaxRows()-1)
  for (i = 1; i < all_users.length; i++) {
    user = all_users[i];
    if (!user.suspended){
      if (admin_accounts.indexOf(user.primaryEmail) == -1) {
        if (!isUserbyName(user, rangeValues, firstNameCol, lastNameCol)) {
          //Logger.log("User not found by name in active salesforce: " + user.name.fullName);
          if (!isUserByEmail(user, rangeValues, emailCol)) {
            suspendedSheet.appendRow([user.name.fullName, user.primaryEmail])
            Logger.log("User not found by name or email in active salesforce: " + user.name.fullName);
          }
        }
      }
    }
  }
}

// function for suspending the accounts in the suspendedUsers spreadsheet
function suspendUsers() {
  var userSuspensionSheetID = PropertiesService.getScriptProperties().getProperty('userSuspensionSheetID');
  var suspendedSpreadSheet = SpreadsheetApp.openById(userSuspensionSheetID);
  var suspendedSheet = suspendedSpreadSheet.getSheetByName("SuspendedUsers");

  var rangeData = suspendedSheet.getDataRange();
  var lastRow = rangeData.getLastRow();
  var rangeValues = rangeData.getValues();
  for (i = 1; i < lastRow - 1; i++) {
    user_email = rangeValues[i][1]
    var user = AdminDirectory.Users.get(email);
    user.suspended = true;
    AdminDirectory.Users.update(user);
  }
}