import json
import requests
import time

class APIProblem(Exception):
    pass

api_key = '7F56AE3AB4357C3E54E73235A0ADE818'

# magic number for conversion between Steam ID-64 and Steam ID-32
id_conversion_number = 76561197960265728

account = {'user': 'angela', 'id': 76561198084830623}

def fetch_match_history(account_id):

    if account_id == 4294967295:
        raise APIProblem ("ID reserved for private account")

    parameters = { 'key': api_key, 'account_id': account_id }

    # first API call
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/'
    data = requests.get(url, params=parameters).json()['result']

    if data['status'] != 1:
        raise APIProblem (data['status'] + ': ' + data['statusDetail'])

    matches = data['matches']

    # if we still have matches left, call again
    while data['results_remaining'] != 0:
        # Start at match one less than last match of previous call
        parameters['start_at_match_id'] = int(matches[-1]['match_id']) - 1
        parameters['date_max'] = matches[-1]['start_time']

        data = requests.get(url, params=parameters).json()['result']

        new_matches = data['matches']

        matches = matches + new_matches  
    
    return matches


# fetch match details for a list of match_ids
def fetch_match_details(match_ids):

    parameters = { 'key': api_key}
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/'

    match_list = []

    for match in match_ids:
        print match

        # make sure we don't call too many times
        time.sleep(1)
        parameters['match_id'] = match
        data = requests.get(url, params=parameters).json()['result']

        if 'error' in data:
            raise APIProblem ("Non-existent match")

        match_list += [data]

    return match_list

# get match history for each account
matches_list = fetch_match_history(account['id'])

# get ids for each match from matches_list
match_id_list = [i['match_id'] for i in matches_list]

# get match details from id_list
match_details = fetch_match_details(match_id_list)

player_result = {}

player_result['user'] = account['user']
player_result['id64'] = account['id']
player_result['id32'] = account['id'] - id_conversion_number

print player_result
print len(match_details)

player_result['matches'] = match_details

with open('angela_match_details.json', 'w') as outfile:
  json.dump(player_result, outfile, sort_keys=True)