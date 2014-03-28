var bb_win_loss, bb_hero_pie, bb_item_percent;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bb_win_loss = {
    x: 0,
    y: 0,
    w: 250,
    h: 30
};

bb_hero_pie = {
    x: 0,
    y: 100,
    w: 400,
    h: 300
};

bb_item_percent = {
    x: 0,
    y: 100,
    w: 400,
    h: 300
};

svg = d3.select("#stat_graphs").append("svg").attr({
	width: width + margin.left + margin.right,
	height: height + margin.bottom + margin.top
})
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var win_loss_graph = svg.append("g")
	.attr("class", "win_loss")
	.attr("visibility", "hidden")
	.attr("transform", "translate(" + bb_win_loss.x + "," + bb_win_loss.y + ")");

var user_data;

loadData("david");

draw_win_loss();

function loadData(username) {
	 
	d3.json("../data/" + username + "_match_details.json", function(error,data) {

        //we want to look at the radiant win variable and indicate if our user won or lost
        //we want to pull out their player array 
        data.matches.forEach(function(d,i) {
            our_player = d.players.filter(function(e) {
                return (e.account_id == data.id32)
            })
            //pull out player array
            d.player_info = our_player[0];

            //figure out if player was on radiant or dire
            if (d.player_info.player_slot&128) {
                d.player_side = "dire";
            }
            else {
                d.player_side = "radiant";
            }

            //figure out if the player won or lost based on his/her side
            if ((d.player_side == "radiant" && d.radiant_win == true) ||
            	(d.player_side == "dire" && d.radiant_win == false)) {
                d.player_win = true;
            }
            else {
                d.player_win = false;
            }

        })

        user_data = data;

        update_win_loss(user_data);

    })
}


function draw_win_loss() {

	win_loss_graph.append("rect")
				.attr("width", bb_win_loss.w)
				.attr("height", bb_win_loss.h)
				.attr("x", 0)
				.attr("y", 0)
				.attr("class", "loss");

	win_loss_graph.append("rect")
				.attr("width", bb_win_loss.w/2)
				.attr("height", bb_win_loss.h)
				.attr("x", 0)
				.attr("y", 0)
				.attr("class", "win");
}

function update_win_loss(data) {

	var win_count = 0;
	var total_matches = data.matches.length;

	data.matches.map(function(d,i) {
		if (d.player_win == true) {
			win_count += 1;
		}
	});

	if (d3.select(".win_loss").attr("visibility") == "hidden") {
		var duration = 0;
	}
	else {
		duration = 250;
	}

	d3.select(".win")
		.transition()
		.duration(duration)
		.attr("width", (win_count/total_matches)*bb_win_loss.w);

	d3.select(".win_loss")
		.attr("visibility", null);

}

// svg.append("rect")
// 	.attr("width", width)
// 	.attr("height", height)
// 	.attr("x", 0)
// 	.attr("y", 0)
// 	.attr("fill", "steelblue");

// console.log("hello");
