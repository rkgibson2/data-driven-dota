import json
import requests

with open('heroes.json', 'r+') as hero_file:
    hero_list = json.load(hero_file)

for hero in hero_list:
    del hero['u']

with open('heroes.json', 'w') as outfile:
    json.dump(hero_list, outfile, sort_keys=True, indent=4)