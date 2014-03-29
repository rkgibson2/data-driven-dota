import json
import requests

data = requests.get('http://www.dota2.com/jsfeed/abilitydata').json()['abilitydata']

with open('abilities.json', 'w') as outfile:
    json.dump(data, outfile, sort_keys=True, indent=4)