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
        "most_deaths": {
            "value":0,
            "match":0
        },
        "most_last_hits":{
            "value":0,
            "match":0
        },
        "most_hero_damage":{
            "value":0,
            "match":0
        },
        "most_tower_damage":{
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
            "most_deaths": {
                "value": d.player_info.deaths > records["most_deaths"]["value"] ? d.player_info.deaths : records["most_deaths"]["value"],
                "match": d.player_info.deaths > records["most_deaths"]["value"] ? d : records["most_deaths"]["match"]
            },
            "most_last_hits":{
                "value": d.player_info.last_hits  > records["most_last_hits"]["value"] ? d.player_info.last_hits : records["most_last_hits"]["value"],
                "match": d.player_info.last_hits  > records["most_last_hits"]["value"] ? d : records["most_last_hits"]["match"]
            },
            "most_hero_damage":{
                "value": d.player_info.hero_damage > records["most_hero_damage"]["value"] ? d.player_info.hero_damage : records["most_hero_damage"]["value"],
                "match": d.player_info.hero_damage > records["most_hero_damage"]["value"] ? d : records["most_hero_damage"]["match"]
            },
            "most_tower_damage":{
               "value": d.player_info.tower_damage > records["most_tower_damage"]["value"] ? d.player_info.tower_damage : records["most_tower_damage"]["value"],
               "match": d.player_info.tower_damage > records["most_tower_damage"]["value"] ? d : records["most_tower_damage"]["match"]
            }
        }

    });

    // change longest match to show duration in minutes and seconds, not seconds
    var hours = Math.floor(records["longest_match"]["value"] / 60);
    var seconds = records["longest_match"]["value"] % 60;

    // if seconds is one digit, pad with 0
    seconds = (seconds / 10 < 1) ? "0" + seconds : seconds 

    records["longest_match"]["value"] = hours + ":" + seconds

    // change hero and tower damage numbers to include thousands separator
    var thousands = d3.format(",d")

    records["most_hero_damage"]["value"] = thousands(records["most_hero_damage"]["value"])
    records["most_tower_damage"]["value"] = thousands(records["most_tower_damage"]["value"])

    displayRecords();
    }

function displayRecords(){
    for (key in records) {
        d3.select("#" + key)
            .html($("#" + key).data().value + "<br>" +records[key].value)
            .classed("dullness",true)
            .classed("brightnessfilter",true)
            .style("background-image", "url(" + d2.getHeroInfo(records[key].match.player_info.hero_id).img + ")")
            .on("click",function() {
                update_end_screen(records[this.id].match);
            });

    }

    $('#show_records').modal('hide');
}
