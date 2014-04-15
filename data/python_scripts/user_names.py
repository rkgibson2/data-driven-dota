import json
import requests
import time

# Gather data for 10 users from the Web API.
# Robbie Gibson

class APIProblem(Exception):
    pass

api_key = '7F56AE3AB4357C3E54E73235A0ADE818'
url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
parameters = { 'key': api_key }

# magic number for conversion between Steam ID-64 and Steam ID-32
id_conversion_number = 76561197960265728

# magic number for private accounts
private_id = 4294967295

accounts = [{'user': 'robbie', 'id': 76561198072761520},
            {'user': 'benjy', 'id': 76561198044701967},
            {'user': 'david', 'id': 76561198046156567},
            {'user': 'aui_2000', 'id': 76561198000813202},
            {'user': 'merlini', 'id': 76561198028025765},
            {'user': 'dendi', 'id': 76561198030654385}]


with open('match_details.json', 'r') as infile:
    user_details = json.load(infile)

# dict of account id's mapped to user names
user_list = {}

# set of account ids, so we only get info the second time we see them
user_once = set([])

# set of account ids we've seen twice (don't get them again)
user_twice = set([])

# loop through each user
for user, details in user_details.items():
    # loop through each match
    for match_index, match in enumerate(details['matches']):
        # loop through each player in each match
        for player_index, player in enumerate(match['players']):
            # check if the player has an id (isn't a bot) and isn't the private id
            if 'account_id' in player and player['account_id'] != private_id:
                account_id = player['account_id']

                # haven't seen before
                if account_id not in user_once:
                    print 'User: ' + str(user) + ', match number: ' + '%3d'%(match_index + 1) + ', player number: ' + '%2d'%(player_index + 1) + ', account: ' + '%9d'%account_id + ' first time'
                    user_once.add(account_id)
                else:
                    # second time we've seen this user, so pull data
                    if account_id not in user_twice:
                        print 'User: ' + str(user) + ', match number: ' + '%3d'%(match_index + 1) + ', player number: ' + '%2d'%(player_index + 1) + ', account: ' + '%9d'%account_id + ' second time, getting data'
                        time.sleep(2)
                        parameters['steamids'] = account_id + id_conversion_number
                        data = requests.get(url, params=parameters).json()['response']['players']
                        user_list[account_id] = data
                        user_twice.add(account_id)
                    # seen more than twice, so we've already got them
                    else:
                        print 'User: ' + str(user) + ', match number: ' + '%3d'%(match_index + 1) + ', player number: ' + '%2d'%(player_index + 1) + ', account: ' + '%9d'%account_id + ' already pulled'

    with open(user + '_usernames.json', 'w') as outfile:
        json.dump(user_list, outfile, sort_keys=True, indent=4)