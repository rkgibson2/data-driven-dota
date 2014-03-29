import json
import requests

with open('items.json', 'r+') as item_file:
    item_list = json.load(item_file)

for item in item_list:
    if item['name'] != 'empty':
        item['img'] = 'img/items/' + item['name'] + '.jpg'

with open('items.json', 'w') as outfile:
    json.dump(item_list, outfile, sort_keys=True, indent=4)