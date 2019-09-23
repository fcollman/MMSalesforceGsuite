/**
 * Lists users in a G Suite domain.
 */
function generateRandom() {
  var data = "xxxxxx";
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&<>*-";
  var text = ""; //Reset text to empty string
  for(var j=1;j<=data.length;j++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
}

function addUser(firstName,lastName,default_email,home_email, phone, dry_run) {

  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1YbzhNu58kQ4UGUx-tE1Gk7TVs0F2fQPZPlEf2XBlyRA/edit#gid=0");
  var sheet = ss.getSheets()[0]
  var pwd = "MM2019"+firstName+generateRandom();
  
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
  if(!dry_run){
    user = AdminDirectory.Users.insert(user);
    sheet.appendRow([firstName, default_email, home_email, pwd]);
  }
  
  //Logger.log('%s',user);
  Logger.log('User created %s, %s, %s', user.primaryEmail, home_email, pwd);

}

function addGroupMember(userEmail,groupEmail, dry_run) {
  if(!dry_run){
    group = GroupsApp.getGroupByEmail(groupEmail)
    if (!group.hasUser(userEmail)){
      var member = {
        email: userEmail,
        role: "MEMBER"
      };
      
      member = AdminDirectory.Members.insert(member, groupEmail);
    }
  }
  
  
  Logger.log("User %s added as a member of group %s.", userEmail, groupEmail);
}

function syncronize_group(data, inds, group){
      try{
        if (! group.hasUser(data[i][emailCol])){
          var memberRole = {
            email: data[i][emailCol],
            role: 'MEMBER'
          };
          member = AdminDirectory.Members.insert(memberRole, "testgoogle@mindsmatterseattle.org");
        }
      }
      catch(e){
         Logger.log("could not process " + data[i][emailCol]);
      }
  
}

function isUser(email){
  try{ 
   var user = AdminDirectory.Users.get(email);
   return true;
  }
  catch(e){
    return false;
  }
}

function test_isUser(){
  Logger.log(isUser("fcollman@mindsmatterseattle.org"));
  Logger.log(isUser("notauser@mindsmatterseattle.org"));
}
/**
 * Lists all the users in a domain sorted by first name.
 */
function listAllUsers() {
  var pageToken;
  var page;
  var allUsers = []
  do {
    page = AdminDirectory.Users.list({
      domain: 'mindsmatterseattle.org',
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



function listAcceptedUsers() {
  var dry_run = false;
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1GehPeKo-Elb53xzevzK2iUDOqeSj3mY0bySqYcDIxQM/edit#gid=410618021");
  var volunteer_group = GroupsApp.getGroupByEmail("volunteers@mindsmatterseattle.org");
  var ec_group = GroupsApp.getGroupByEmail("ec@mindsmatterseattle.org");
  var board_group = GroupsApp.getGroupByEmail("board@mindsmatterseattle.org");
  var active_group = GroupsApp.getGroupByEmail("active@mindsmatterseattle.org");
  
  var student_groups = {}
  var student_year_inds = {}
  var current_student_inds =[]
  var volunteer_inds=[];
  var ec_inds=[];
  var board_inds=[];
  var math_inds =[];
  var testprep_inds =[];
  var writing_inds=[];
  var enrich_inds=[];
  
  for (i = 2020 ; i <= 2022 ; i++){
    student_groups[i] = GroupsApp.getGroupByEmail("students"+i+"@mindsmatterseattle.org");
    student_year_inds[i]  = [];
  }
  
  Logger.log(ss.getName());
  var sheet = ss.getSheets()[1];
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1,1, 1, lastColumn-1);
  var rangeValues = searchRange.getValues();


  var volunteerTypeCol=-1;
  var emailCol=-1;
  var leadershipCol=-1;
  var yearCol=-1;
  var rolenonleadCol=-1;
  var firstNameCol = -1;
  var lastNameCol = -1;
  var phoneCol = -1;
  var backgroundCol = -1;
  
  for ( i = 0; i < lastColumn; i++){
    if (rangeValues[0][i] === 'Contact Record Type') volunteerTypeCol=i;
    else if(rangeValues[0][i] === 'Email') emailCol=i;   
    else if(rangeValues[0][i] === 'Leadership') leadershipCol=i;
    else if (rangeValues[0][i] === 'Year') yearCol=i;
    else if (rangeValues[0][i] === 'Role (Non-Leadership)') rolenonleadCol=i;
    else if (rangeValues[0][i] === 'First Name') firstNameCol=i;
    else if (rangeValues[0][i] === 'Last Name') lastNameCol=i;
    else if (rangeValues[0][i] === 'Mobile') phoneCol=i;
    else if (rangeValues[0][i] === 'Last Background Check') backgroundCol=i;
  }

  Logger.log("CRT is " + volunteerTypeCol + ", Email is " + emailCol);
  Logger.log("yearCol is " + yearCol);
  data = rangeData.getValues();
  
  // allCurrentUsers = listAllUsers();
  
  for (i = 1 ; i < lastRow - 1 ; i++){

       
      phone = data[i][phoneCol];
      var email = data[i][firstNameCol].toLowerCase() + "." + data[i][lastNameCol].toLowerCase() + "@mindsmatterseattle.org";
      email=email.replace(" ",".");
      email=email.replace(" ",".");
      
      if (data[i][volunteerTypeCol] === 'Volunteer'){
        volunteer_inds.push(i);
        if (!isUser(email)){
          addUser(data[i][firstNameCol],
                  data[i][lastNameCol],
                  email,
                  data[i][emailCol],
                  data[i][phoneCol],
                  dry_run);
        }
       
         addGroupMember(email, volunteer_group.getEmail(), dry_run);
          Utilities.sleep(1000) 
      }
      if (data[i][leadershipCol].toString().indexOf('Chapter Board') != -1){
        board_inds.push(i);
        if (!isUser(email)){
          addUser(data[i][firstNameCol],
                  data[i][lastNameCol],
                  email,
                  data[i][emailCol],
                  data[i][phoneCol],
                  dry_run);
        }
         addGroupMember(email, board_group.getEmail(), dry_run );
          Utilities.sleep(1000) 
      }
      if (data[i][leadershipCol].toString().indexOf('Chapter Executive Committee')!= -1){
        ec_inds.push(i);
        addGroupMember(email, ec_group.getEmail(), dry_run);
        
      }
      if (data[i][volunteerTypeCol] === 'Student'){
        current_student_inds.push(i);
        student_year_inds[data[i][yearCol]].push(i);
        if (data[i][yearCol]>2019){
          if (!isUser(email)){
            addUser(data[i][firstNameCol],
                    data[i][lastNameCol],
                    email,
                    data[i][emailCol],
                    data[i][phoneCol],
                    dry_run);
          }
            Utilities.sleep(1000) 
        addGroupMember(email, student_groups[data[i][yearCol]].getEmail(), dry_run);
          
        }
      }
      if (isUser(email)){
          addGroupMember(email, active_group.getEmail(), dry_run);
      }
      
      //  if (data[i][volunteerTypeCol] === 'Alumni'){
      //    student_year_inds[data[i][yearCol]].push(i);
      //  }
      if (data[i][rolenonleadCol]){
        if (data[i][rolenonleadCol].toString().indexOf('Math')!= -1){
          math_inds.push(i);
        }
        if (data[i][rolenonleadCol].toString().indexOf('W&CT')!= -1){
          writing_inds.push(i);
        }
        if (data[i][rolenonleadCol].toString().indexOf('Test Prep')!= -1){
          testprep_inds.push(i);
        }
        if (data[i][rolenonleadCol].toString().indexOf('Senior')!= -1){
          enrich_inds.push(i);
        }
      }
    
  }
  Logger.log("volunteers are " + volunteer_inds);
  Logger.log("ec are " + ec_inds);
  Logger.log("board are " + board_inds);
  Logger.log("student_year_inds[2020] are " + student_year_inds[2020]);         
  
}

function listUsers() {
  var dry_run=false;
  var ss = SpreadsheetApp.openById("1GehPeKo-Elb53xzevzK2iUDOqeSj3mY0bySqYcDIxQM");
  var volunteer_group = GroupsApp.getGroupByEmail("volunteers@mindsmatterseattle.org");
  var ec_group = GroupsApp.getGroupByEmail("ec@mindsmatterseattle.org");
  var board_group = GroupsApp.getGroupByEmail("board@mindsmatterseattle.org");
  var active_group = GroupsApp.getGroupByEmail("active@mindsmatterseattle.org");
  
  var student_groups = {}
  var student_year_inds = {}
  var current_student_inds =[]
  var volunteer_inds=[];
  var ec_inds=[];
  var board_inds=[];
  var math_inds =[];
  var testprep_inds =[];
  var writing_inds=[];
  var enrich_inds=[];
  
  for (i = 2020 ; i <= 2022 ; i++){
    student_groups[i] = GroupsApp.getGroupByEmail("students"+i+"@mindsmatterseattle.org");
    student_year_inds[i]  = [];
  }
  
  Logger.log(ss.getName());
  var sheet = ss.getSheetByName("SEA - Volunteer Report");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(1,1, 1, lastColumn-1);
  var rangeValues = searchRange.getValues();


  var volunteerTypeCol=-1;
  var emailCol=-1;
  var leadershipCol=-1;
  var yearCol=-1;
  var rolenonleadCol=-1;
  var firstNameCol = -1;
  var lastNameCol = -1;
  var phoneCol = -1;
  
  
  for ( i = 0; i < lastColumn; i++){
    if (rangeValues[0][i] === 'Contact Record Type') volunteerTypeCol=i;
    else if(rangeValues[0][i] === 'Email') emailCol=i;   
    else if(rangeValues[0][i] === 'Leadership') leadershipCol=i;
    else if (rangeValues[0][i] === 'Year') yearCol=i;
    else if (rangeValues[0][i] === 'Role (Non-Leadership)') rolenonleadCol=i;
    else if (rangeValues[0][i] === 'First Name') firstNameCol=i;
    else if (rangeValues[0][i] === 'Last Name') lastNameCol=i;
    else if (rangeValues[0][i] === 'Mobile') phoneCol=i;
  }

  Logger.log("CRT is " + volunteerTypeCol + ", Email is " + emailCol);
  Logger.log("yearCol is " + yearCol);
  data = rangeData.getValues();
  
  // allCurrentUsers = listAllUsers();
  
  for (i = 1 ; i < lastRow - 1 ; i++){
    phone = data[i][phoneCol];
    var email = data[i][firstNameCol].toLowerCase() + "." + data[i][lastNameCol].toLowerCase() + "@mindsmatterseattle.org";
    email=email.replace(" ",".");
    email=email.replace(" ",".");
    
    if (data[i][volunteerTypeCol] === 'Volunteer'){
         volunteer_inds.push(i);
            if (!isUser(email)){
               addUser(data[i][firstNameCol],
                       data[i][lastNameCol],
                       email,
                       data[i][emailCol],
                       data[i][phoneCol],
                       dry_run);
      }

      if (!volunteer_group.hasUser(email)){
        addGroupMember(email, volunteer_group.getEmail(), dry_run);
      }
           Utilities.sleep(1000) 
    }
    if (data[i][leadershipCol].toString().indexOf('Chapter Board') != -1){
      board_inds.push(i);
       if (!isUser(email)){
         addUser(data[i][firstNameCol],
                       data[i][lastNameCol],
                       email,
                       data[i][emailCol],
                       data[i][phoneCol],
                       dry_run);
       }

      if(!board_group.hasUser(email)){
         addGroupMember(email, board_group.getEmail(), dry_run);
         }
           Utilities.sleep(1000) 
    }
    if (data[i][leadershipCol].toString().indexOf('Chapter Executive Committee')!= -1){
      ec_inds.push(i);
      if(!ec_group.hasUser(email)){
         addGroupMember(email, ec_group.getEmail(), dry_run);
         }
   
    }
    
    if (data[i][volunteerTypeCol] === 'Student'){
      current_student_inds.push(i);
      student_year_inds[data[i][yearCol]].push(i);
      if (data[i][yearCol]>2019){
             if (!isUser(email)){
               addUser(data[i][firstNameCol],
                       data[i][lastNameCol],
                       email,
                       data[i][emailCol],
                       data[i][phoneCol],
                       dry_run);
             }
          if(!student_groups[data[i][yearCol]].hasUser(email)){
             addGroupMember(email, student_groups[data[i][yearCol]].getEmail(), dry_run);
          }
          
        }
           Utilities.sleep(1000) 
      }
    if (isUser(email)){
      if(!active_group.hasUser(email)){
        addGroupMember(email, active_group.getEmail(), dry_run);
      }
    }
    
  //  if (data[i][volunteerTypeCol] === 'Alumni'){
  //    student_year_inds[data[i][yearCol]].push(i);
  //  }
    if (data[i][rolenonleadCol]){
      if (data[i][rolenonleadCol].toString().indexOf('Math')!= -1){
        math_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('W&CT')!= -1){
        writing_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('Test Prep')!= -1){
        testprep_inds.push(i);
      }
      if (data[i][rolenonleadCol].toString().indexOf('Senior')!= -1){
        enrich_inds.push(i);
      }
    }
  
  }
  Logger.log("volunteers are " + volunteer_inds);
  Logger.log("ec are " + ec_inds);
  Logger.log("board are " + board_inds);
  Logger.log("student_year_inds[2020] are " + student_year_inds[2020]);         
  
}
  
function isUserByEmail(user, rows, emailCol){
 for (var r=1; r<rows.length; r++) { 
    var email = rows[r][emailCol];
    for (var e=0; e<user.emails.length; e++){
     if (email.indexOf(user.emails[e].address) !=-1){
          return true;
      }
   }
 }
 return false;
}
function isUserbyName(user, rows, fCol, lCol){
  for (var r=1; r<rows.length; r++) { 
      var fullname = rows[r][fCol] + " " + rows[r][lCol]
      if (fullname.indexOf(user.name.fullName) != -1){
        return true;
      }
   
  }
  return false;
}


                   
function auditActive(){
  all_users = listAllUsers()
  var ss = SpreadsheetApp.openById("1GehPeKo-Elb53xzevzK2iUDOqeSj3mY0bySqYcDIxQM");
  var sheet = ss.getSheetByName("SEA - Volunteer Report");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var rangeValues  = rangeData.getValues(); 
  var user;
  
  var volunteerTypeCol=-1;
  var emailCol=-1;
  var leadershipCol=-1;
  var yearCol=-1;
  var rolenonleadCol=-1;
  var firstNameCol = -1;
  var lastNameCol = -1;
  var phoneCol = -1;
  
  var admin_accounts = "admin@mindsmatterseattle.org,marketing@mindsmatterseattle.org"
  for ( i = 0; i < lastColumn; i++){
    if (rangeValues[0][i] === 'Contact Record Type') volunteerTypeCol=i;
    else if(rangeValues[0][i] === 'Email') emailCol=i;   
    else if(rangeValues[0][i] === 'Leadership') leadershipCol=i;
    else if (rangeValues[0][i] === 'Year') yearCol=i;
    else if (rangeValues[0][i] === 'Role (Non-Leadership)') rolenonleadCol=i;
    else if (rangeValues[0][i] === 'First Name') firstNameCol=i;
    else if (rangeValues[0][i] === 'Last Name') lastNameCol=i;
    else if (rangeValues[0][i] === 'Mobile') phoneCol=i;
  } 
  
  for (i = 1 ; i < all_users.length; i++){
    user = all_users[i];
    if (admin_accounts.indexOf(user.primaryEmail) == -1){ 
        if (!isUserbyName(user, rangeValues, firstNameCol, lastNameCol)){
          //Logger.log("User not found by name in active salesforce: " + user.name.fullName);
          if (!isUserByEmail(user, rangeValues, emailCol)){ 
              Logger.log("User not found by name or email in active salesforce: " + user.name.fullName);
          }   
        }
    }
  }
}
