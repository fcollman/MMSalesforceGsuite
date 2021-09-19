# Minds Matter Salesforce Gsuite Deployment Instructions

Last modified September 18, 2021

## Background

In 2018-2019 Minds Matter of Seattle’s board decided to undertake a project to improve knowledge management within the organization in order to make information more accessible and better spread institutional knowledge throughout the turnover of volunteers. Like many organizations, there is a clear need to be able to share information easily, but also securely and seemlessly throughout the organization. Relatedly, a large overhead was being spent in maintaining and curating email lists for communication, while using Google’s gsuite tools (docs, gmail, classroom) to share information between volunteers, students, ec members and board members.

Although some organization members had minds matter gsuite accounts, others did not. This meant there was an ad hoc system of sharing documents with volunteers personal gmail accounts as new volunteers entered roles. A unified drive folder helped the EC mitigate this problem, but individual accounts still owned key documents. This meant when a volunteer left a role, there was no systematic way to tranfer all of their key documents to another user. A lot of time was being spent asking and answering where certain pieces of information were being held and how people could get access to them. This represented a long term liability for the organization.

The board and EC evaluated a number of options, but ultimately decided that Gsuite services actually did fit the organization overall needs. It would minimize the institutional disruption, as several of the services (drive, classroom, groups) were already being utilized by the org. What was missing was a low effort way to organize and maintain the gsuite account. If every Minds Matter community member had their own account, and a backend system could maintain membership in the organization and appropriate google groups, then permissions could be easily managed through the use of group sharing. Furthermore, google sites could be utilized to provide an easy to edit Intranet site that could be shared privately with only the appropriate members of the org.

In order to realize this vision, the core organizational capability that was missing in the ad-hoc solution was the guarantee that there was a single source of truth about who were the current set of volunteers, ec members, students and board members that was both actively maintained AND automatically synchronized with all the permissions and communication pathways.

Salesforce was the obvious choice for what this actively maintained source of truth should be, but there was not an obvious mechanism for translating changes in salesforce into changes in gsuite accounts and group permissions. So we decided to develop a gsuite script plugin to facilitate synchronization between salesforce and our gsuite domain that would automate the creation of user accounts, and membership in the appropriate google groups. With this core capability, intranet sites could be developed using embedded google drive documents that contained institutional knowledge and facts organized and laid out according to the ideas of non-technical members of the EC staff. Students and volunteers can also now use their mindsmatterseattle gmail account to easily contact any member of the organization through directory sharing.

This document outlines the steps required to deploy this synchronization system and is meant to provide a roadmap for other Minds Matter chapters that might want to replicate what Minds Matter Seattle has done.

## Gsuites/Google Workspace set-up

1. Setup a [Google domain](https://domains.google/) with an "admin" account. **This is an account that will run the infrastructure,** but is not tied to a particular individual in the organization, so that the system will keep working in the event that any individual leaves the org.
   Enable directory sharing in the admin console: https://support.google.com/a/answer/60218?hl=en

2. If you have existing Gsuite accounts that do not follow the pattern FirstName.LastName@googledomain.org (ex: FirstName.LastName@mindsmatterXXX.org), add aliases for these users with the pattern FirstName.LastName@mindsmatterXXX.org so the apps scripts (that you set up later) recognizes that these users already "exist."
   Replace all spaces in First and Last names with “.” Later, you can use the “dry run” variable of the `addUser` function in `Code.js` to test what will happen before it does.

## Salesforce Steps

1. **IMPORTANT**: Clean the Salesforce data so it accurately reflects your chapter's current volunteers and students including EC status, board status, instructor group status, etc. _**Salesforce Data must match precisely!**_ Ideally, you should establish a process for updating Salesforce information as students and volunteers enter and leave the organization.

2. Setup a Salesforce report that includes all the volunteers and students you want to set up with Gsuite accounts. We set ours up as follows:

Filtered By:1 AND (2 OR 3) Edit

    a) Chapter equals Seattle

    b) Application Status equals Current

    c) Application Status equals Accepted

It should have the following columns

    Year
    Application Status
    Contact Record Type
    First Name
    Last Name
    Email
    Phone
    Role (Non-Leadership)
    Leadership
    Leadership Sub-Role
    Student Year Association

Add these fields to get them into Gsuites:

```
Mailing Street
Mailing City
Mailing State/Province
Mailing Zip/Postal Code
Mailing Country
Mobile
```

3. Create a spreadsheet in your admin accounts Gdrive. We call ours “SEA Current Contacts”. You will need the ID of the spreadsheet later (to be salesforceSpreadSheetID). Note: We decided to give everyone in ec@ and board access to this spreadsheet by sharing it with the groups ec@ and board@. This should automatically add and remove access to this information as users are added to and remove from these groups.

4. Install the “Data connector for salesforce” add-on from Google drive. Use it to connect to your Salesforce account and pull the report into the sheet created in Step 7.
   https://gsuite.google.com/marketplace/app/data_connector_for_salesforce/857627895310
   Note the name of the sheet’s tab (salesforceSheetName)

5. Use the auto-refresh option of Data Connector to setup automated pulling of this data.

## Google Apps Scripts Set up

1. First, clone [this repository](https://github.com/fcollman/MMSalesforceGsuite) to your local machine.

2. Install `clasp`: https://github.com/google/clasp. `clasp` enables local development of apps scripts and
   syncs to Google Install the script in your google code repo from development machine
3. Enable API usage on admin in google from the settings page: https://script.google.com/home/usersettings

4. Sync local app scripts code from repo to Google using clasp:

```
    $ cd MMSalesforceGsuite/
    $ clasp login
    # Use admin credentials
    $ clasp create --title "SalesforceSync"
    $ clasp push  # pushes current directory to script.google.com
```

Note: If you cannot do this step, you can fall back to copy/pasting code from this repo
into code files of the same name in the script.google.com UI.

5. Run the `setup.js` script to create two additional spreadsheets ("User Creation" and "UserSuspension") in the script.google.com UI: My Projects --> google group --> click `setup.gs` in left panel -> Click "Run" in top menu bar --> "Run function" --> "setupSpreadsheets."

To check that the script worked, go back to GDrive files. You should see two additional files: "User Creation" and "UserSuspension". Check for
the creation of the appropriate script variables by going back to the app scripts UI and check:
File > Project properties > Script properties

        newUserSheetID = XXX # equal to sheet ID of "User Creation"
        userSuspensionSheetID = XXX # equal to sheet ID of "UserSuspension"

6. Set up additonal script properties manually:
   Project properties > script properties > + Add row

```
salesforceSpreadSheetID # set to sheet ID of sheet created in
salesforceSheetName = [note from above]
domainname = mindsmatterXXXX.org [your google domain]

```

<!--
5. Create a “User Creation” spreadsheet in gdrive in the admin account, with these columns

    First Name,mmemail,private-email,password

Note the ID of spreadsheet (newUserSheetID)
TODO: Make the generation of this spreadsheet automated

11. Create a “UserSuspension” spreadsheet owned by admin (note ID “userSuspensionSheetID”)

    Add a “SuspendedUsers” tab to spreadsheet.

    Add “Name” and “Email” columns

    TODO: maybe make this spreadsheet follow the bulk user update format. To allow easier semi-automated user suspension.

    TODO: make the creation of this spreadsheet a function you can run

13. Setup variables at script.google.com
    Open project on web browser
    Hit file>project properties > script properties

        newUserSheetID = [note from above]
        salesforceSpreadSheetID = [note from above]
        userSuspensionSheetID = [note from above]
        salesforceSheetName = [note from above]
        domainname = mindsmatterXXXX.org [your google domain]

TODO: make the spreadsheet creation and variable setting automated.
-->

7. Configure desired groups
   edit groups_conf.js to reflect the groups you want to have managed by the script.
   each configuration follows a format

   "GROUP_NAME":{
   "name": "the name of my group",
   "description": "the description of my group",
   "combination": "or" or "and" (controls whether all or any of the filters must be met),
   "filters":[
   one or more of these...
   {
   "column": "a column name from the salesforce report",
   "condition": "equals" or "contains" depending on whether you want to search or match,
   "value": "the value you are matching or searching for"
   }
   ]
   "do_remove": true or false, whether you want the script to actively remove members that don't meet these criteria
   }

   run setup_groups function to automatically create all the groups that have not yet been created. If groups were created before, you may need to transfer ownership of that group to the admin account.

8. Do a dry run of user creation.
   Edit dry_run = false, to dry_run = true (~line 282) in script.
   Manually trigger script on script.google.com “run>run function>syncGoogleWithSalesforce”
   Wait ~5 minutes for 140 users (till tan box goes away) (more with more users)
   view> logs to see what would have happened. Iterate on fixing data in salesforce till desired resullt is achieved.
   If satisfied, edit dry_run=true, and rerun. Accounts should be created and group memberships.

   Fix missing group memberships, manually add appropriate volunteers to google classrooms if you are using this gsuite feature. Todo: make this automated and optional.

9. Create your intranet sites using sites.google.com
10. Grant editing permissions to site based upon group membership or individuals you desire.
    Make visibility settings based upon organization wide permissions, or group membership. We created different sites for “internal” (all of org), “ec” and “board”.
    This can be done in parallel with the above steps by volunteers and staff that have gsuite accounts. Making admin the owner of these sites however will ensure that permissions can be transferred over time.

11. Run a mail merge to notify new users of their accounts.
    Write a draft email template in the admin account gmail page introducing new users to their account. Below is our example

```

    Hi {{First Name}},

    Your Minds Matter of Seattle account

    {{mmemail}}

    has been created for you. Your password is

    {{password}}

    This account allows you to receive email, and login to a set of google gsuite resources to gain access to Minds Matter specific information.

    To access your account, go to www.gmail.com, and login with your email and password.  If you already have a google account, you may need to click in the upper right to "add an account".  Once you have successfully logged in, changed your password and passed two factor authentication, you should be able to use your computer to access the full suite of gsuite services.

    For example use it to login to the internal minds matter site (https://sites.google.com/mindsmatterseattle.org/internal).  It will also allow you to create and share google documents with students and volunteers.

    If you’d like to forward your minds matter email to a personal email you may do so by following these instructions https://support.google.com/mail/answer/10957?hl=en.

    If you have any problems accessing your account, please email admin@mindsmatterseattle.org.

    Best,
    Minds Matter Seattle Technology Team

```

12. Identify the ID of the draft email you saved...
    open the gscript project.
    open MailMerge.gs
    run>run function>getDraftId
    view>Logs
    note the ID after the : of the subject line
    save this ID in the project properties:
    file>project properties>Script properties. Set newAccountDraftID = IDNOTEDABOVE

13. Test run_merge
    Add some data to the UserCreation spreadsheet
    run the run_merge function
    Those people should receive emails with the text filled in
    and the rows should be marked "done"

14. Add special accounts you want to be protected, add them to a script property
    Name: protectedAccounts
    Value (example): admin,finance,marketing,seniorzoom,sophomorezoom,juniorzoom
    Test auditActive
    run the auditactive script
    check the suspendedUsers spreadsheet to see who would be marked for suspension
15. Setup triggers
    Go to script.google.com, select the project you created.
    click vertical dots on right hand side of screen, next to Project Details
    select Triggers
    click Add Trigger button (bottom right corner)

    Suggested triggers to add
    auditActive (every day)
    syncGoogleWithSalesforce_v2 (every 12 hours)
    run_merge (every 12 hours)

<!--
Install a mail merge add-on on your “User Creation” spreadsheet.  We use “Yet another Mail Merge”.  Run the add-on to email users.  Free version limited to emailing 50 people per day, $40/year to make it more than that.
Prepare to deal with questions about logins and people losing login email or not receiving it due to types in email address, or not understanding how to add a gsuite account to their google login if they are using gmail for personal use. One helpful tip is that the admin console allows you to download a list of users and when they have last logged in.  We used this to setup a separate mail merge spreadsheet which emailed users at their personal logins if they hadn’t yet logged in.  I set this up by doing a merge between the login spreadsheet and the user creation spreadsheet in python.

    TODO: make this capability easier to do.  We also used this to manually approach and assist volunteers and students who were not yet using the system.  We did have to utilize people’s personal emails for the first session as well because we did not have confidence that everyone was using and checking their new minds matter accounts. -->

## TODOS

See github issues...

```

```
