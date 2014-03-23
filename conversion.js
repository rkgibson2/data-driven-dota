var heroData = [];
var itemData = [];
function loadHeroJson()
{
	d3.json("heroes.json", function (error, data)
	{
		// an array of all the hero names indexed appropriately - starting at 1
		heroData = data["result"]["heroes"];
	});
};

function loaditemJson()
{
	d3.json("items.json", function (error, data)
	{
		// an array of all the hero names indexed appropriately - starting at 1
		itemData = data["items"];
	});
};


// can change the function names
// and the function args - depends on our implementation
function idToHeroLocalizedName(id, heroData)
{
	var hero = heroData[id];
	return hero["localized_name"];
}


function idToItemName(id, itemData)
{
	var item = itemData[id];
	return item["name"];
}

loadHeroJson();
loaditemJson();

function functionlist()
{
	console.log("loadHeroJson - run at start up - stored in heroData\n"
	+ "loaditemJson - run at start up - stored in itemData\n"
	+  "idToHeroLocalizedName(id,heroData) - returns normal hero name\n"
		+ "idToItemName(id,itemData) - returns normal item name\n"
		+ "displayHeroImg(heroname) - heroname must be the same as our named img files\n"
		+ "displayItemImg(itemname) - itemname must be the same as our named img files\n"
		+ "TRY nested commands like: displayHeroImg(idToHeroLocalizedName(14,heroData))\n"
		+ "OR displayItemImg(idToItemName(43,itemData));\n"
	);
}

function displayHeroImg(heroname){
d3.select("body").select(".heropicture").remove();

d3.select("body").selectAll(".heropicture").data([heroname.toLowerCase().replace(/ /g,"_")])
    .enter().append('img')
    .attr('class', 'heropicture')
    .attr('src', function(d) { return "../img/heroes/" +d+".jpg"; });
};


function displayItemImg(itemname){
d3.select("body").select(".itempicture").remove();

d3.select("body").selectAll(".itempicture").data([itemname])
    .enter().append('img')
    .attr('class', 'itempicture')
    .attr('src', function(d) { return "../img/items/" +d+".jpg"; });
};

