var user_data;
var timelinesvg = d3.select("#timeline").append("svg");
d2.loadJson(function (){


d2.loadUserData("robbie", function(error, data) {
    user_data = data;
    var matches = user_data.matches;
    matches.forEach(function(d){
        var hero = d2.getHeroInfo(d.player_info.hero_id)
        d3.select("#timeline").append("img").attr("id","ID"+d.match_id).attr("class","timelinepic");
        d3.select("#timeline").select("#ID"+d.match_id).attr('src', hero.img).attr("width", "55px").attr("value", d.id);
});    
});

});
