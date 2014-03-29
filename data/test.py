import json
import requests

with open('heroes.json', 'r+') as hero_file:
    hero_list = json.load(hero_file)

for hero in hero_list:
    if 'img' in hero:
        hero['img'] = '/' + hero['img']
        print hero['img']

with open('heroes.json', 'w') as outfile:
    json.dump(hero_list, outfile, indent=4)