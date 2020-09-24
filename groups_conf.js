var seattle_groups_config={
    "active": {
        "filters": [
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Volunteer"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Board Member"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Employee"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Seattle All",
        "description": "All Minds Matter Seattle active members",
        "do_remove": true
    },
    "board":{
            "filters":[
                {
                    "column":"Leadership",
                    "condition": "contains",
                    "value": "Chapter Board"
                }
            ],
            "name": "Minds Matter of Seattle Board",
            "description":  "Minds Matter of Seattle Board",
            "do_remove": true
        },
    "ec":{
        "filters":[
            {
                "column":"Leadership",
                "condition": "contains",
                "value": "Chapter Executive Committee"
            }
        ],
        "name": "Minds Matter Executive Council",
        "description":  "Minds Matter Executive Council",
        "do_remove": true
    },
    "volunteers":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Volunteer"
            }
        ],
        "name": "Minds Matter Volunteers",
        "description":  "Minds Matter  Volunteers",
        "do_remove": true
    },
    "wct-instructors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Instructor  W&CT or Enrichment"
            },
            {
                "column":"Leadership Sub-Role",
                "condition":"contains",
                "value":"Program Director  W&CT/Enrichment"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Writing and Critical Thinking Instructors",
        "description":  "Minds Matter Writing and Critical Thinking Instructors",
        "do_remove": false
    },
    "testprep-instructors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Instructor  Test Prep"
            },
            {
                "column":"Leadership Sub-Role",
                "condition":"contains",
                "value":"Program Director  Test Prep"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Test Prep Instructors",
        "description":  "Minds Matter Test Prep Instructors",
        "do_remove": false
    },
    "senior-enrichment-instructors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "College Counselor"
            },
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "College Application Support"
            },
            {
                "column":"Leadership Sub-Role",
                "condition":"contains",
                "value":"College Counselor Lead"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Test Prep Instructors",
        "description":  "Minds Matter Test Prep Instructors",
        "do_remove": true
    },
    "summerprograms":{
        "filters":[
            {
                "column":"Leadership Sub-Role",
                "condition": "contains",
                "value": "Director of Summer Programs"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Summer Program Directors",
        "description":  "Minds Matter Summer Program Directors",
        "do_remove": true
    },
    "math-instructors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Instructor  Math"
            },
            {
                "column":"Leadership Sub-Role",
                "condition":"contains",
                "value":"Program Director  Math"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Math Instructors",
        "description":  "Minds Matter Math Instructors",
        "do_remove": true
    },
    "students2021":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2021
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2021",
        "description":  "Minds Matter Students Graduating 2021"
    },
    "students2022":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2022
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2022",
        "description":  "Minds Matter Students Graduating 2022"
    },
    "students2023":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023",
        "description":  "Minds Matter Students Graduating 2023"
    },
    "2021mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Senior"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2021",
        "description":  "Minds Matter Mentors for Students Graduating 2021",
        "do_remove": false
    },
    "2022mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Junior"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2022",
        "description":  "Minds Matter Mentors for Students Graduating 2022",
        "do_remove": false
    },
    "2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023",
        "description":  "Minds Matter Mentors for Students Graduating 2023",
        "do_remove": false
    }
}

var co_groups_config  = {
    "active": {
        "filters": [
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Volunteer"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Board Member"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Employee"
            }
        ],
        "combination": "or",
        "name": "Minds Matter Colorado All",
        "description": "All Minds Matter Colorado active members",
        "do_remove": true
    },
    "board":{
            "filters":[
                {
                    "column":"Leadership",
                    "condition": "contains",
                    "value": "Chapter Board"
                }
            ],
            "name": "Minds Matter of Colorado Board",
            "description":  "Minds Matter of Colorado Board",
            "do_remove": true
        },
    "lt":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Employee"
            }
        ],
        "name": "Minds Matter Colorado Leadership",
        "description":  "Minds Matter Colorado Leadership",
        "do_remove": true
    },
    "ec":{
        "filters":[
            {
                "column":"Leadership",
                "condition": "contains",
                "value": "Chapter Executive Committee"
            }
        ],
        "name": "Minds Matter Executive Council",
        "description":  "Minds Matter Executive Council",
        "do_remove": true
    },
    "volunteers":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Volunteer"
            }
        ],
        "name": "Minds Matter Volunteers",
        "description":  "Minds Matter Volunteers",
        "do_remove": true
    },
    "2021mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2021
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2021",
        "description":  "Minds Matter Students Graduating 2021"
    },
    "2022mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2022
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2022",
        "description":  "Minds Matter Students Graduating 2022"
    },
    "2023mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023",
        "description":  "Minds Matter Students Graduating 2023"
    },
    "2021mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Senior"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2021",
        "description":  "Minds Matter Mentors for Students Graduating 2021",
        "do_remove": false
    },
    "2022mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Junior"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2022",
        "description":  "Minds Matter Mentors for Students Graduating 2022",
        "do_remove": false
    },
    "2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023",
        "description":  "Minds Matter Mentors for Students Graduating 2023",
        "do_remove": false
    },
    "gw-2021mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2021
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2021 at GW site",
        "description":  "Minds Matter Students Graduating 2021 at GW site"
    },
    "gw-2022mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2022
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2022 at GW site",
        "description":  "Minds Matter Students Graduating 2022 at GW site"
    },
    "gw-2023mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023 at GW site",
        "description":  "Minds Matter Students Graduating 2023 at GW site"
    },
    "gw-2021mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Senior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2021 at GW site",
        "description":  "Minds Matter Mentors for Students Graduating 2021 at GW site",
        "do_remove": false
    },
    "gw-2022mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Junior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2022 at GW site",
        "description":  "Minds Matter Mentors for Students Graduating 2022 at GW site",
        "do_remove": false
    },
    "gw-2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - George Washington HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023 at GW site",
        "description":  "Minds Matter Mentors for Students Graduating 2023 at GW site",
        "do_remove": false
    },
    "dmlk-2021mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2021
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2021 at MLK site",
        "description":  "Minds Matter Students Graduating 2021 at MLK site"
    },
    "dmlk-2022mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2022
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2022 at MLK site",
        "description":  "Minds Matter Students Graduating 2022 at MLK site"
    },
    "dmlk-2023mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023 at MLK site",
        "description":  "Minds Matter Students Graduating 2023 at MLK site"
    },
    "dmlk-2021mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Senior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2021 at MLK site",
        "description":  "Minds Matter Mentors for Students Graduating 2021 at MLK site",
        "do_remove": false
    },
    "dmlk-2022mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Junior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2022 at MLK site",
        "description":  "Minds Matter Mentors for Students Graduating 2022 at MLK site",
        "do_remove": false
    },
    "dmlk-2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - MLK Early College"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023 at MLK site",
        "description":  "Minds Matter Mentors for Students Graduating 2023 at MLK site",
        "do_remove": false
    },
    "west-2021mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2021
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2021 at West site",
        "description":  "Minds Matter Students Graduating 2021 at West site"
    },
    "west-2022mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2022
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2022 at West site",
        "description":  "Minds Matter Students Graduating 2022 at West site"
    },
    "west-2023mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023 at West site",
        "description":  "Minds Matter Students Graduating 2023 at West site"
    },
    "west-2021mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Senior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2021 at West site",
        "description":  "Minds Matter Mentors for Students Graduating 2021 at West site",
        "do_remove": false
    },
    "west-2022mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Junior"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2022 at West site",
        "description":  "Minds Matter Mentors for Students Graduating 2022 at West site",
        "do_remove": false
    },
    "west-2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Denver - West HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023 at West site",
        "description":  "Minds Matter Mentors for Students Graduating 2023 at West site",
        "do_remove": false
    },
    "harrison-2023mentees":{
        "filters":[
            {
                "column":"Contact Record Type",
                "condition": "equals",
                "value": "Student"
            },
            {
                "column":"Year",
                "condition":"equals",
                "value":2023
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Colorado Springs - Harrison HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Students Graduating 2023 at Harrison site",
        "description":  "Minds Matter Students Graduating 2023 at Harrison site"
    },
    "harrison-2023mentors":{
        "filters":[
            {
                "column":"Role (Non-Leadership)",
                "condition": "contains",
                "value": "Mentor"
            },
            {
                "column":"Student Year Association",
                "condition":"equals",
                "value":"Sophomore"
            },
            {
                "column":"Site (Colorado)",
                "condition":"equals",
                "value":"Colorado Springs - Harrison HS"
            }
        ],
        "combination": "and",
        "name": "Minds Matter Mentors for Students Graduating 2023 at Harrison site",
        "description":  "Minds Matter Mentors for Students Graduating 2023 at Harrison site",
        "do_remove": false
    }
}

var groups_config_dict  = {
    'mindsmatterseattle.org': seattle_groups_config,
    'mindsmatterco.org': co_groups_config
}