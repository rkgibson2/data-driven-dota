d2.loadJson(function(){

//herolist = new Array();
hero_keys = d2.getKeys("heroes");

for(var i=1;  i<hero_keys.length; i++)
{
     var hero =  d2.getHeroInfo(hero_keys[i]);;
     if (hero)
     {
        var herodname = hero.dname.toLowerCase().replace(/ /g,"_").replace(/'/g,"");
        if (hero.stat == "strength")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#strimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#strimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width","80px").attr("value",herodname);
	d3.select("#strimages").select("#"+heroname).on("click", highlight);
	}
         if (hero.stat == "agility")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#agiimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#agiimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width", "80px").attr("value",herodname);;
	    d3.select("#agiimages").select("#"+heroname).on("click", highlight); 
        } 
         if (hero.stat == "intelligence")
        {
             var heroname = hero.name;//.toLowerCase().replace(/ /g,"_");
             d3.select("#intimages").append("img").attr("id",heroname).attr("class","pic");
             d3.select("#intimages").select("#" + heroname).attr('src', function() { return "../img/heroes/" +herodname+".jpg"; }).attr("width", "80px").attr("value",herodname);; 
	d3.select("#intimages").select("#"+heroname).on("click", highlight);
        }  
     }
}

});

function highlight(){
	
		if (!this.classList.contains("selected"))
		{
			d3.select(this).attr("class","pic selected");
			d3.select(this).style("border","2px solid red");
		}
		else
		{
			$(this).removeClass("selected");
			d3.select(this).style("border","2px solid black");
		}
}

function selected(){
var selectedheroes = d3.selectAll(".selected")[0];
selectedarr = new Array ();
selectedheroes.forEach(function(d){
// decide how we want to represent the selection? 
// array?
selectedarr.push(d.getAttribute("value"));
});
console.log(selectedarr);
}
