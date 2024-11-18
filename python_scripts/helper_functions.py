import datetime
import os
import pickle

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pandas as pd

# GLOBAL VARS
# If modifying these scopes, delete the file token.pickle.
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
]

CALENDER_ID = "c_822m07aktpjne3gfbr7cj8gjks@group.calendar.google.com"
RANGE_TO_READ = "Computer_Readable!A1:I"
TOKEN_FILE = "token.pickle"
CREDS_FILE = "credentials.json"


def read_credentials():
    # check for CREDS_FILE
    if os.path.exists(CREDS_FILE):
        pass
    else:
        raise FileNotFoundError(
            "`credentials.json` not found! Please create a credential file before running the notebook."
        )
    # read the `token.pickle`
    if os.path.exists(TOKEN_FILE):
        print("Reading token...")
        with open(TOKEN_FILE, "rb") as token:
            creds = pickle.load(token)
            print("Successfully loaded credentials!")
            return creds
    else:
        print("`token.pickle` not found, starting authentication...")
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN_FILE, "wb") as token:
            print("Creating token.pickle file...")
            pickle.dump(creds, token)
            print(
                "token.pickle not successfully created! You should see a `token.pickle` file in the python_scripts directory"
            )
        return creds


def read_google_sheet(sheet_id, creds, range_name=RANGE_TO_READ):
    service = build("sheets", "v4", credentials=creds)
    sheet = service.spreadsheets()

    try:
        rows = sheet.values().get(spreadsheetId=sheet_id, range=range_name).execute()
        data = rows.get("values")
    except:
        print("Error in pulling data!")

    df = pd.DataFrame(data[1:], columns=data[0])
    time_data_list = []

    # add a starttime and endtime column
    for k, row in df.iterrows():
        start, end = [x.strip() for x in row.Time.split(" - ")]
        try:
            starttime = datetime.datetime.strptime(
                row.Date + " " + start, "%m/%d/%Y %I:%M %p"
            )
        except ValueError:
            starttime = datetime.datetime.strptime(
                row.Date + " " + start, "%m/%d/%Y %I %p"
            )

        try:
            endtime = datetime.datetime.strptime(
                row.Date + " " + end, "%m/%d/%Y %I:%M %p"
            )
        except ValueError:
            endtime = datetime.datetime.strptime(row.Date + " " + end, "%m/%d/%Y %I %p")

        time_data_list.append((starttime, endtime))

    time_df = pd.DataFrame(time_data_list, columns=["starttime", "endtime"])

    # merge
    df = df.join(time_df)

    # create an empty column to fill in with the calendar event IDs
    if "calendarEventID" in df.columns:
        pass
    else:
        df["calendarEventID"] = None

    return df
