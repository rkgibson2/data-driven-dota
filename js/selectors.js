setTimeout(function(){

//herolist = new Array();
for(var i=1;  i<=110 ;i++)
{
     var hero =  d2.getHeroInfo(i);;
     if (hero)
     {
        var herodname = hero.dname.toLowerCase().replace(/ /g,"_");
        if (hero.stat == "strength")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#strimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#strimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width", "80px"); 
        }
         if (hero.stat == "agility")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#agiimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#agiimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width", "80px"); 
        } 
         if (hero.stat == "intelligence")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#intimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#intimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width", "80px"); 
        }  
     }
}

},2000);
