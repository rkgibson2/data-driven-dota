var records;

function updateRecords(data){
records = 
{
    "longest_match":
    {
        "value":0,
        "match":0
    },
    "most_kills": {
        "value":0,
        "match":0
    },
    "most_assists": {
        "value":0,
        "match":0
    },
    "most_last_hits":{
        "value":0,
        "match":0
    },
    "most_denies":{
        "value":0,
        "match":0
    },
    "most_gold_per_min":{
        "value":0,
        "match":0
    },
     "most_xp_per_min":{
        "value":0,
        "match":0
    },
    "most_hero_damage":{
        "value":0,
        "match":0
    },
    "most_hero_healing":{
        "value":0,
        "match":0
    },
    "most_tower_damage":{
        "value":0,
        "match":0
    },
    "best_kda_ratio":{
        "value":0,
        "match":0
    }
}
data.matches.forEach(function(d){
records = 
{
    "longest_match": 
    {
        "value": d.duration > records["longest_match"]["value"] ? d.duration : records["longest_match"]["value"],
        "match": d.duration > records["longest_match"]["value"] ? d : records["longest_match"]["match"]
    },
    "most_kills": {
        "value": d.player_info.kills > records["most_kills"]["value"] ? d.player_info.kills : records["most_kills"]["value"],
        "match": d.player_info.kills > records["most_kills"]["value"] ? d : records["most_kills"]["match"]
    },
    "most_assists": {
        "value": d.player_info.assists > records["most_assists"]["value"] ? d.player_info.assists : records["most_assists"]["value"],
        "match": d.player_info.assists > records["most_assists"]["value"] ? d : records["most_assists"]["match"]
    },
    "most_last_hits":{
        "value": d.player_info.last_hits  > records["most_last_hits"]["value"] ? d.player_info.last_hits : records["most_last_hits"]["value"],
        "match": d.player_info.last_hits  > records["most_last_hits"]["value"] ? d : records["most_last_hits"]["match"]
    },
    "most_denies":{
        "value": d.player_info.denies > records["most_denies"]["value"] ? d.player_info.denies : records["most_denies"]["value"],
        "match": d.player_info.denies > records["most_denies"]["value"] ? d : records["most_denies"]["match"]
    },
    "most_gold_per_min":{
        "value": d.player_info.gold_per_min  > records["most_gold_per_min"]["value"] ? d.player_info.gold_per_min : records["most_gold_per_min"]["value"],
        "match": d.player_info.gold_per_min  > records["most_gold_per_min"]["value"] ? d : records["most_gold_per_min"]["match"]
    },
    "most_xp_per_min":{
        "value": d.player_info.xp_per_min > records["most_xp_per_min"]["value"] ? d.player_info.xp_per_min : records["most_xp_per_min"]["value"],
        "match": d.player_info.xp_per_min > records["most_xp_per_min"]["value"] ? d : records["most_xp_per_min"]["match"]
    },
    "most_hero_damage":{
        "value": d.player_info.hero_damage > records["most_hero_damage"]["value"] ? d.player_info.hero_damage : records["most_hero_damage"]["value"],
        "match": d.player_info.hero_damage > records["most_hero_damage"]["value"] ? d : records["most_hero_damage"]["match"]
    },
    "most_hero_healing":{
       "value": d.player_info.hero_healing > records["most_hero_healing"]["value"] ? d.player_info.hero_healing : records["most_hero_healing"]["value"],
       "match": d.player_info.hero_healing > records["most_hero_healing"]["value"] ? d : records["most_hero_healing"]["match"]
    },
    "most_tower_damage":{
       "value": d.player_info.tower_damage > records["most_tower_damage"]["value"] ? d.player_info.tower_damage : records["most_tower_damage"]["value"],
       "match": d.player_info.tower_damage > records["most_tower_damage"]["value"] ? d : records["most_tower_damage"]["match"]
    },
    "best_kda_ratio":{
       "value": (d.player_info.assists + d.player_info.kills + d.player_info.deaths)  > records["best_kda_ratio"]["value"] ? (d.player_info.assists + d.player_info.kills + d.player_info.deaths)  : records["best_kda_ratio"]["value"],
       "match": (d.player_info.assists + d.player_info.kills + d.player_info.deaths)  > records["best_kda_ratio"]["value"] ? d : records["best_kda_ratio"]["match"]
    }
}

});
}

function displayRecords(){



}
