import json
import requests

data = requests.get('http://www.dota2.com/jsfeed/heropediadata?feeds=herodata').json()['herodata']


with open('heroes.json', 'r+') as hero_file:
    hero_list = json.load(hero_file)

# get rid of "npc_dota_hero_"
for hero in hero_list:
    hero['name']=hero['name'].split('npc_dota_hero_')[1]

for hero, hero_data in data.items():
    for hero_obj in hero_list:
        if hero == hero_obj['name']:
            for key, value in hero_data.items():
                hero_obj[key] = value

with open('heroes.json', 'w') as outfile:
    json.dump(hero_list, outfile, sort_keys=True, indent=4)