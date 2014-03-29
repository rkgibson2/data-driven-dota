import json
import requests
import time

data = requests.get('http://www.dota2.com/jsfeed/itemdata').json()['itemdata']


with open('items.json', 'r+') as item_file:
    item_list = json.load(item_file)

for key, value in data.items():
    for item in item_list:
        if value['id'] == item['id']:
            for key2, value2 in value.items():
                item[key2] = value2

            print item.keys()

with open('items.json', 'w') as outfile:
    json.dump(item_list, outfile, indent=4)