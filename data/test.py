import json
import requests

ability_list = requests.get('https://raw.githubusercontent.com/kronusme/dota2-api/master/data/abilities.json').json()['abilities']


with open('abilities.json', 'r') as ability_file:
    data = json.load(ability_file)

for key, value in data.items():
    for ability in ability_list:
        if key == ability['name']:
            for key2, value2 in value.items():
                ability[key2] = value2


with open('abilities.json', 'w') as outfile:
     json.dump(ability_list, outfile, sort_keys=True, indent=4)