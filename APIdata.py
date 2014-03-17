import json
import requests

api_key = '7F56AE3AB4357C3E54E73235A0ADE818'
account_id = '76561198072761520'

parameters = {
				'key': api_key,
				'account_id': account_id
	     	}



url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/'
data = requests.get(url, params=parameters).text
data = json.loads(data)  # load a json string into a collection of lists and dicts

print parameters['key']

# print json.dumps(data, indent=2)  # dump an object into a json string


"""def fetch_match_history(account_id): 
    
    # we can call the API six times and we'll grab all available data from the API
    # if account id = 4294967295
    
    # first API call
    url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=7F56AE3AB4357C3E54E73235A0ADE818&date_max&account_id=' + account_id
    data = requests.get(url).text
    data = json.loads(data)
    
    df = pd.DataFrame.from_dict(data)    
    
    return df

fetch_match_history(account_id) """