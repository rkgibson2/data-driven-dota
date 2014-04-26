import json
import requests


with open('abilities.json', 'r') as ability_file:
    data = json.load(ability_file)

for _, ability in data.items():
    if 'img' in ability:
        ability['img'] = ability['img'][1:]
        print ability['img']

with open('abilities.json', 'w') as outfile:
     json.dump(data, outfile, sort_keys=True, indent=4)