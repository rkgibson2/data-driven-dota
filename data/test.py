import json
import requests


with open('items.json', 'r') as item_file:
    data = json.load(item_file)

new_data = {}

for item in data:
    new_data[item['id']] = item

with open('items.json', 'w') as outfile:
     json.dump(new_data, outfile, sort_keys=True, indent=4)