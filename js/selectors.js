var selectedarr = new Array();
// selecting label headings, highlights or unhighlights all imgs in that div
var labels = ["str", "int", "agi"];
labels.forEach(function (d) {
    d3.select("#" + d + "label").on("click", function () {
        var images = d3.select("#" + d + "images").selectAll("img");
        var numselected = d3.select("#" + d + "images").selectAll(".pic.selected")[0].length;
        if (numselected != images[0].length) {
            images.attr("class", "pic selected");
            images.style("border", "2px solid red");
        } else if (numselected == images[0].length) {
            images.classed("selected", false);
            images.style("border", "2px solid black");
        }
    });
});


function highlight()
{
	if (!this.classList.contains("selected"))
	{
		d3.select(this).attr("class", "pic selected");
		d3.select(this).style("border", "2px solid red");
	}
	else
	{
		$(this).removeClass("selected");
		d3.select(this).style("border", "2px solid black");
	}
}

function selected()
{
    // remove timeline clear selection button if filter was done after a brush
    d3.select(".clear-button_timeline").remove();
    // super triple filter by all three types - game mode, lobby type and hero
    tripleFilterUpdate();
}

function sorting(a, b)
{
	return a.dname.localeCompare(b.dname)
};


function updateFilteredSelectionByHero(){

   filtered_data = {
		    id32: user_data.id32,
		    id64: user_data.id64,
		    matches: [],
		    user: user_data.user
	    }
	    // copy the user_data matches
        filtered_data.matches.push.apply(filtered_data.matches, user_data.matches);


var selectedheroes = d3.selectAll(".selected")[0];
	selectedarr = [];//new Array();
	selectedheroes.forEach(function (d)
	{
		selectedarr.push(+d.getAttribute("value"));
	});

	// if filter is empty, use all heroes
	if (selectedarr.length == 0) {
		// already copied above so just return
		return;
	} else {
        // filter for only selected heroes
		filtered_data.matches = filtered_data.matches.filter(function(d,i) {
			var player_hero_id = d.player_info.hero_id;

			return selectedarr.indexOf(player_hero_id) > -1
		})
	}
}

function reselectHeroes(){
    // first reset selection to blank
    resetSelectedHeroes();
    // then select previous selection
    selectedarr.forEach(function(d,i){d3.select("#" + d2.getHeroInfo(d).name)
        .classed("selected",true).style("border", "2px solid red");
});
}
