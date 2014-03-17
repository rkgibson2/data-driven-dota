import json
import requests

class APIProblem(Exception):
    pass

api_key = '7F56AE3AB4357C3E54E73235A0ADE818'
robbie_id = 76561198072761520
david_id = 76561198046156567
benjy_id = 76561198044701967


# fetch_match_history for a Steam 64-bit account ID. The input must be a integer.
def fetch_match_history(account_id):

    if account_id == 4294967295:
        raise APIProblem ("ID reserved for private account")

    parameters = { 'key': api_key, 'account_id': account_id }

    # first API call
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/'
    data = requests.get(url, params=parameters).json()['result']

    if data['status'] == 15:
        raise APIProblem ("Private or non-existent account")

    matches = data['matches']

    # if we still have matches left, call again
    while data['results_remaining'] != 0:
        parameters['start_at_match_id'] = matches[-1]['match_id']
        parameters['date_max'] = matches[-1]['start_time']

        data = requests.get(url, params=parameters).json()['result']

        new_matches = data['matches']

        # delete the first element, because we already have that one
        del new_matches[0]

        matches = matches + new_matches  
    
    return matches

try:
    id_list = fetch_match_history(robbie_id)
except APIProblem, e:
    print e

# fetch match details for a list of match_ids
def fetch_match_details(match_ids):

    parameters = { 'key': api_key}
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/'

    match_list = []

    for match in match_ids:
        parameters['match_id'] = match
        data = requests.get(url, params=parameters).json()['result']

        if 'error' in data:
            raise APIProblem ("Non-existent match")

        match_list = match_list + [data]

    return match_list

match_id_list = [i['match_id'] for i in id_list]

match_details = fetch_match_details(match_id_list)

with open('robbie_details.txt', 'w') as outfile:
  json.dump(match_details, outfile)