/**
 * Lists users in a G Suite domain.
 */
function generateRandom() {
  var data = "xxxxxx";
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*-";
  var text = ""; //Reset text to empty string
  for (var j = 1; j <= data.length; j++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function addUser(firstName, lastName, default_email, home_email, phone, dry_run) {
  var userID = PropertiesService.getScriptProperties().getProperty('newUserSheetID');
  var ss = SpreadsheetApp.openById(userID);
  var sheet = ss.getSheets()[0]
  var pwd = "MM2019" + firstName + generateRandom();
  console.log('Creating User  %s, %s, %s', default_email, home_email, pwd)

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
    try {
      user = AdminDirectory.Users.insert(user);
      sheet.appendRow([firstName, default_email, home_email, pwd]);
    }
    catch (e) {
      console.log("User %s insert failed: " + e, user)
    }
  }

  //Logger.log('%s',user);

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
    console.log("User %s added as a member of group %s.", userEmail, groupEmail);
  }
  else {
    console.log("User %s not added as a member of group %s because they are already member", userEmail, groupEmail);
  }
}

function isUser(email) {
  try {
    var user = AdminDirectory.Users.get(email);
    return true;
  }
  catch (e) {
    console.log('user not found reason: ' + e);
    return false;
  }
}

function auditGroup(group, correctEmails, do_remove, dry_run) {
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var groupEmail = group.getEmail();
  console.log('auditing ' + groupEmail);
  // console.log('correctEmails' + correctEmails);
  users = group.getUsers();
  var found_correct = []
  for (ce = 0; ce < correctEmails.length; ce++) {
    found_correct.push(false);
  }
  // for all users in group validate that they should be there
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var validated_user = false;
    for (var ce = 0; ce < correctEmails.length; ce++) {
      var correctEmail = correctEmails[ce];
      if (correctEmail.indexOf(user) != -1) {
        validated_user = true;
        found_correct[ce] = true;
      }

    }
    if (user == 'admin@' + domainname) {
      validated_user = true;
    }
    if (do_remove) {
      if (!validated_user) {
        // remove user
        if (!dry_run) {
          AdminDirectory.Members.remove(groupEmail, user.getEmail());
        }
        console.log('removing ' + user)
      }
    }

  }
  // for all users that should be in group make sure they are there
  for (var ce = 0; ce < correctEmails.length; ce++) {
    var correctEmail = correctEmails[ce];
    if (!found_correct[ce]) {
      addGroupMember(correctEmail, group.getEmail(), dry_run);
      Utilities.sleep(1000);
    }
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
      console.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return allUsers;
}

function setupGroups() {
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var groups_config = groups_config_dict[domainname];
  var pageToken;
  var existing_groups = AdminDirectory.Groups.list({
    domain: domainname,
    maxResults: 200,
    pageToken: pageToken
  })
  var existingGroupEmails = []
  for (var group in existing_groups.groups) {
    existingGroupEmails.push(existing_groups.groups[group].email);
  }
  for (var group in groups_config) {
    if (existingGroupEmails.indexOf(group + "@" + domainname) == -1) {
      console.log("creating group: " + group + "@" + domainname);
      AdminDirectory.Groups.insert({
        email: group + "@" + domainname,
        name: groups_config[group].name,
        description: groups_config[group].description
      });
      Utilities.sleep(1000);
      var owner = {
        email: "admin@" + domainname,
        role: "OWNER",
        delivery_settings: "NONE"
      };
      AdminDirectory.Members.insert(owner, group + "@" + domainname);
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
  var salesforceSpreadSheetID = PropertiesService.getScriptProperties().getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);

  var salesforceSheetName = PropertiesService.getScriptProperties().getProperty('salesforceSheetName');
  var sheet = ss.getSheetByName(salesforceSheetName);

  var userSuspensionSheetID = PropertiesService.getScriptProperties().getProperty('userSuspensionSheetID');
  var suspendedSpreadSheet = SpreadsheetApp.openById(userSuspensionSheetID);
  var protectedAccounts = PropertiesService.getScriptProperties().getProperty('protectedAccounts');
  var suspendedSheet = suspendedSpreadSheet.getSheetByName("SuspendedUsers");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var rangeValues = rangeData.getValues();
  var user;
  var columnDict = {}

  for (i = 0; i < lastColumn; i++) {
    columnDict[rangeValues[0][i]] = i;
  }

  if (suspendedSheet.getMaxRows() > 1) {
    suspendedSheet.deleteRows(2, suspendedSheet.getMaxRows() - 1)
  }
  for (i = 1; i < all_users.length; i++) {
    user = all_users[i];
    if (!user.suspended) {
      if (protectedAccounts.indexOf(user.primaryEmail.split('@')[0]) == -1) {
        if (!isUserbyName(user, rangeValues, columnDict['First Name'], columnDict['Last Name'])) {
          //Logger.log("User not found by name in active salesforce: " + user.name.fullName);
          if (!isUserByEmail(user, rangeValues, columnDict['Email'])) {
            suspendedSheet.appendRow([user.name.fullName, user.primaryEmail])
            console.log({ message: 'User Marked For Suspension', fullName: user.name.fullName, email: user.primaryEmail });
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
  for (i = 1; i < lastRow; i++) {
    user_email = rangeValues[i][1]
    var user = AdminDirectory.Users.get(user_email);
    user.suspended = true;
    AdminDirectory.Users.update(user, user_email);
    console.log({ message: 'User Suspended', fullName: user.name.fullName, email: user.primaryEmail });

  }
}

function syncGoogleWithSalesforce_v2() {
  var dry_run = false;
  var do_remove_default = true;
  var domainname = PropertiesService.getScriptProperties().getProperty('domainname');
  var groups_config = groups_config_dict[domainname];
  //console.log(groups_config);
  groupDict = {}
  correctEmailDict = {}
  for (var group in groups_config) {
    google_group = GroupsApp.getGroupByEmail(group + "@" + domainname);
    groupDict[group] = google_group
    correctEmailDict[group] = []
    Utilities.sleep(1000)
  }

  var salesforceSpreadSheetID = PropertiesService.getScriptProperties().getProperty('salesforceSpreadSheetID');
  var ss = SpreadsheetApp.openById(salesforceSpreadSheetID);

  var salesforceSheetName = PropertiesService.getScriptProperties().getProperty('salesforceSheetName');
  var sheet = ss.getSheetByName(salesforceSheetName);
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1, 1, 1, lastColumn - 1);
  var rangeValues = searchRange.getValues();

  var columnDict = {}

  for (i = 0; i < lastColumn; i++) {
    columnDict[rangeValues[0][i]] = i;
  }

  data = rangeData.getValues();

  for (i = 1; i < lastRow; i++) {
    phone = data[i][columnDict["Phone"]];
    var email = data[i][columnDict["First Name"]].toLowerCase() + "." + data[i][columnDict["Last Name"]].toLowerCase() + "@" + domainname;
    email = email.replace(" ", ".");
    email = email.replace(" ", ".");
    var is_user = isUser(email);

    // make a user if we they are not in the system
    if (!is_user) {
      // avoid making emails for older alumni in system
      if (data[i][columnDict["Contact Record Type"]] != 'Alumni') {
        addUser(data[i][columnDict['First Name']],
          data[i][columnDict['Last Name']],
          email,
          data[i][columnDict['Email']],
          data[i][columnDict['Phone']],
          dry_run);
        is_user = true;
      }
    }
    for (var group in groups_config) {
      gc = groups_config[group]
      if (gc['combination'] == "or") {
        for (var k = 0; k < gc['filters'].length; k++) {
          var filt = gc['filters'][k]
          if (filt['condition'] == 'contains') {
            if (data[i][columnDict[filt['column']]].toString().indexOf(filt['value']) != -1) {
              correctEmailDict[group].push(email);
            }
          }
          if (filt['condition'] == 'equals') {
            if (data[i][columnDict[filt['column']]] == filt['value']) {
              correctEmailDict[group].push(email);
            }
          }
        }
      }
      else {
        var isgood = true;
        for (var k = 0; k < gc['filters'].length; k++) {
          var filt = gc['filters'][k];
          if (filt['condition'] == 'contains') {
            if (data[i][columnDict[filt['column']]].toString().indexOf(filt['value']) == -1) {
              isgood = false;
            }
          }
          if (filt['condition'] == 'equals') {
            if (data[i][columnDict[filt['column']]] != filt['value']) {
              isgood = false;
            }
          }
        }
        if (isgood) {
          correctEmailDict[group].push(email);
        }
      }
    }
  }
  console.log(correctEmailDict);
  for (var group in groups_config) {
    google_group = groupDict[group];
    var do_remove = groups_config[group]['do_remove']
    if (do_remove == null) {
      do_remove = do_remove_default;
    }
    auditGroup(google_group, correctEmailDict[group], do_remove, dry_run);
    Utilities.sleep(1000)
  }
}