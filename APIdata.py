import json
import requests

class APIProblem(Exception):
    pass

api_key = '7F56AE3AB4357C3E54E73235A0ADE818'
robbie_id = '76561198072761520'

"""
url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/'
data = requests.get(url, params=parameters).text
data = json.loads(data)  # load a json string into a collection of lists and dicts


matches = data['result']['matches']

print json.dumps(matches, indent=2)  # dump an object into a json string

"""

# fetch_match_history for a Steam 64-bit account ID. The input must be a integer.
def fetch_match_history(account_id):

    if account_id == 4294967295:
        raise APIProblem ("ID reserved for private account")

    parameters = { 'key': api_key, 'account_id': account_id }

    # first API call
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/'
    data = requests.get(url, params=parameters).json()['result']

    if data['status'] == 15:
        raise PrivateID ("Private or non-existent account")

    matches = data['matches']

    # if we still have matches left, call again
    while data['results_remaining'] != 0:
        parameters['start_at_match_id'] = matches[-1]['match_id']

        data = requests.get(url, params=parameters).json()['result']

        new_matches = data['matches']

        # delete the first element, because we already have that one
        del new_matches[0]

        matches = matches + new_matches
    
    # df = pd.DataFrame.from_dict(data)    
    
    return matches

try:
    value = fetch_match_history(robbie_id)
except APIProblem, e:
    print e

print len(value)