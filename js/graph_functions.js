//Angela Fan

//data global
var user_data;

//margins and bounding boxes for each graph visualization
var bb_win_loss, bb_hero_pie, bb_item_percent, bb_hero_chord;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1060 - margin.left - margin.right;

var height = 1000 - margin.bottom - margin.top;

bb_win_loss = {
    x: 0,
    y: 0,
    w: 250,
    h: 30
};

bb_hero_pie = {
    x: 0,
    y: 100,
    w: 300,
    h: 300
};

bb_item_percent = {
    x: 400,
    y: 5,
    w: 600,
    h: 300
};

bb_hero_chord = {
    x: 350,
    y: 380,
    w: 400,
    h: 400
};


//set up those boxes
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

var hero_pie_graph = svg.append("g")
	.attr("class", "hero_pie")
	.attr("transform", "translate(" + (bb_hero_pie.x + (bb_hero_pie.w / 2)) + "," + (bb_hero_pie.y+(bb_hero_pie.h / 2 + 10)) + ")");

var item_percent_graph = svg.append("g")
	.attr("class", "item_percent")
	.attr("visibility", "hidden")
	.attr("transform", "translate(" + bb_item_percent.x + "," + bb_item_percent.y + ")");

var hero_chord_graph = svg.append("g")
	.attr("class", "hero_chord")
	//.attr("visibility", "hidden")
	.attr("transform", "translate(" + (bb_hero_chord.x+(bb_hero_chord.w/2)) + "," + (bb_hero_chord.y +(bb_hero_chord.h / 2)) + ")");

var item_percent_x, item_percent_y, item_percent_xAxis, item_percent_yAxis, item_percent_color;

//tool tip setup
var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0,0]);

svg.call(tip);

//function calls
d2.loadJson(function() {
	loadData("david");
});

//loadData("robbie");

draw_win_loss();

draw_item_percent();


function loadData(username) {
	 
	d2.loadUserData(username, function(error,data) {

        user_data = data;

        //update function calls
        update_win_loss(user_data);

        update_item_percent(user_data);

        create_flare(data);

        create_matrix(data, 8);

    })
}


//win loss rect graph
function draw_win_loss() {

	win_loss_graph.append("rect")
			.attr("width", bb_win_loss.w)
			.attr("height", bb_win_loss.h)
			.attr("x", 0)
			.attr("y", 0)
			.attr("class", "loss")

	win_loss_graph.append("rect")
			.attr("width", bb_win_loss.w/2)
			.attr("height", bb_win_loss.h)
			.attr("x", 0)
			.attr("y", 0)
			.attr("class", "win")

	win_loss_graph
			.append("text")
			.attr("x", 5)
			.attr("y", 20)
			.attr("class", "win text")
			.attr("text-anchor", "start")
			.text("HWELLO!!!")
			.style("fill", "black");

	win_loss_graph
			.append("text")
			.attr("x", 245)
			.attr("y", 20)
			.attr("class", "loss text")
			.attr("text-anchor", "end")
			.text("HWELLO!!!")
			.style("fill", "black");

	win_loss_graph.append("text")
			.attr("transform", "translate(130,-10)")
			.attr("text-anchor", "middle")
			.text("Win-Loss Percentage")
			.style("font-weight", null);
}

//update the win loss graph if user filters data
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
		.attr("width", (win_count/total_matches)*bb_win_loss.w)
		
	d3.select(".win.text")
		.text(((win_count/total_matches) * 100).toFixed(1) + "%");

	d3.select(".loss.text")
		.text(((total_matches - win_count)/total_matches * 100).toFixed(1) + "%");

	d3.select(".win_loss")
		.attr("visibility", null);

}


function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//creates hero sunburst graph based on hero flare json data
function hero_pie(data) {

	var radius = Math.min(bb_hero_pie.w, bb_hero_pie.h) / 2;

	var color = d3.scale.ordinal()
				.domain(["flare","agility", "strength", "intelligence"])
				//get them to be the correct dota colors
				.range(["white", "#2BAC00", "#E38800","#1A88FC"])
				//.range(["white","#167c13", "#b9500b", "#257dae"]);

	var x = d3.scale.linear()
    	.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
	    .range([0, radius]);

	var partition = d3.layout.partition()
    	.value(function(d) { return d.count; });

	var arc = d3.svg.arc()
	    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
	    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
	    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
	    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

	var path = hero_pie_graph.selectAll("path")
	      	.data(partition.nodes(data))
	    .enter().append("path")
		    .attr("d", arc)
		    .attr("class", "hero_pie")
		    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
		    .on("click", click)
		    .on("mouseover", function(d) {
		    	var tooltip = true;

		    	var name;
		    	var number_text;

		    	if (d.value == 1) {
		    		number_text = " game";
		    	}
		    	else {
		    		number_text = " games"
		    	}

		    	if ("dname" in d) {
		    		name = d.dname;
		    	}
		    	else if (d.name == "flare") {
		    		tooltip = false
		    	}
		    	else {
		    		name = capitalizeFirstLetter(d.name) + " Heroes";
		    	}
		    
		    	var basic_tip = "<div id='tooltip_text'><strong>"+ name +"</strong>"+ "<br>" + d.value + number_text + "</br></div>";

		    	if ("dname" in d) {
		    		var img_tip = "<div id='hero_sunburst_tip'><img src='" + d.img + "'' width='64px' height='36px'></div>";
		    	}
		    	else {
		    		var img_tip = "";
		    	}

		    	tip.html(img_tip + basic_tip);

		    	if (tooltip) {
		    		tip.show(d);
		    	}

		    	d3.select(this)
		    		.style("fill", "brown");
		    })
		    .on("mouseout", function(d) {
		    	tip.hide(d);

		    	d3.select(this)
		    		.style("fill", function(d) { return color((d.children ? d : d.parent).name); });
		    });

	function click(d) {
	    path.transition()
	      .duration(750)
	      .attrTween("d", arcTween(d));
  	}

	d3.select(self.frameElement).style("height", height + "px");

	// Interpolate the scales!
	function arcTween(d) {
	  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	      yd = d3.interpolate(y.domain(), [d.y, 1]),
	      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
	  return function(d, i) {
	    return i
	        ? function(t) { return arc(d); }
	        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
	  };
	}

	hero_pie_graph.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -bb_hero_pie.h/2 - 10)
		.text("Heroes Played")

}

//creates sunburst parent-child nested array-dict object whatever format
//for use in the hero sunburst 
function create_flare(data) {
	
	hero_flare = {};

	hero_flare.name = "flare"
	hero_flare.children = [{},{},{}];

	hero_flare.children[0].name = "agility";
	hero_flare.children[1].name = "strength";
	hero_flare.children[2].name = "intelligence";

	hero_flare.children[0].children = [];
	hero_flare.children[1].children = [];
	hero_flare.children[2].children = [];

	d3.json("../data/heroes.json", function(error,dat) {

		for (d in dat) {
			dat[d].count = 0;

			if (dat[d].stat == "agility") {
				hero_flare.children[0].children.push(dat[d])
			}

			if (dat[d].stat == "strength") {
				hero_flare.children[1].children.push(dat[d]);
			}

			if (dat[d].stat == "intelligence") {
				hero_flare.children[2].children.push(dat[d]);
			}

		}

		data.matches.forEach(function(d,i) {

			current_hero_stat = d2.getHeroInfo(d.player_info.hero_id).stat;

			if (current_hero_stat == "agility") {
				var cur = hero_flare.children[0].children;
				for (var i=0; i < cur.length; i++) {
					if (cur[i].dname == d2.getHeroName(d.player_info.hero_id)) {
						cur[i].count += 1;
					}
				}
			}

			if (current_hero_stat == "strength") {
				var cur = hero_flare.children[1].children;
				for (var i=0; i < cur.length; i++) {
					if (cur[i].dname == d2.getHeroName(d.player_info.hero_id)) {
						cur[i].count += 1;
					}
				}

			}

			if (current_hero_stat == "intelligence") {
				var cur = hero_flare.children[2].children;
				for (var i=0; i < cur.length; i++) {
					if (cur[i].dname == d2.getHeroName(d.player_info.hero_id)) {
						cur[i].count += 1;
					}
				}

			}

		})

		//console.log(hero_flare)
	
		hero_pie(hero_flare);

	})
}

//draws the item percent bar chart
function draw_item_percent() {

	var formatPercent = d3.format(".0%");

	item_percent_color = d3.scale.linear();

	item_percent_x = d3.scale.ordinal()
			.rangeRoundBands([0, bb_item_percent.w], .3 ,.5)
			.domain(["item1"]);

	item_percent_y = d3.scale.linear()
			.range([bb_item_percent.h,0])

	item_percent_xAxis = d3.svg.axis()
				.scale(item_percent_x)
				.orient("bottom")
				.ticks(0);

	item_percent_yAxis = d3.svg.axis()
			    .scale(item_percent_y)
			    .orient("left")
			    .tickFormat(formatPercent);

	item_percent_graph.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + bb_item_percent.h + ")")
				.call(item_percent_xAxis);

	item_percent_graph.append("g")
				.attr("class", "y axis")
				.call(item_percent_yAxis);

	item_percent_graph.append("g")
				.attr("class", "bars")
				.selectAll(".bar")
				.data([{"name": "item1", "percent": .5}], function(d) {
					return d.name;
				})
			  .enter().append("rect")
			  	.attr("class", "bar")
			  	.attr("x", function(d) {
			  		return item_percent_x(d.name);
			  	})
			  	.attr("y", function(d) {
			  		return item_percent_y(d.percent);
			  	})
			  	.attr("height", function(d) {
			  		return bb_item_percent.h - item_percent_y(d.percent);
			  	})
			  	.attr("width", function() {
			  		return item_percent_x.rangeBand();
			  	})
			  	.on("mouseover", function(d) {
			  		tip.html(d.dname);
			  		tip.show(d);
			  	})
			  	.on("mouseout", function(d) {
			  		tip.hide(d);
			  	});

	item_percent_graph.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -40)
		.attr("x", 350)
		.text("Items Purchased as Percentage of Games Played");

}

//updates the item percent bar chart based on user's data selection
function update_item_percent(data) {

	var items = []

	//initialize all items with a count of 0
	d3.json("../data/items.json", function(error,dat) {

		var extent_array = [];

		for (id in dat) {
			extent_array.push(dat[id].cost);
		}

		item_percent_color.domain(d3.extent(extent_array))
		item_percent_color.range(["gray","#FFD700"])

		for (id in dat) {
			dat[id].count = 0;
		}

	var total_count = data.matches.length;

	//count all of the items
	data.matches.forEach(function(d,i) {
		for (j in dat) {
			if (dat[j].id == d.player_info.item_0) {
				dat[j].count += 1;
			}		
			else if (dat[j].id == d.player_info.item_1) {
				dat[j].count += 1;
			}		
			else if (dat[j].id == d.player_info.item_2) {
				dat[j].count += 1;
			}		
			else if (dat[j].id == d.player_info.item_3) {
				dat[j].count += 1;
			}		
			else if (dat[j].id == d.player_info.item_4) {
				dat[j].count += 1;
			}		
			else if (dat[j].id == d.player_info.item_5) {
				dat[j].count += 1;
			}		
		}
	})

	//consolidate into correct form that we want
	for (k in dat) {
		if (dat[k].count != 0 && dat[k].name != "empty") {
			dat[k].percent = dat[k].count/total_count
			items.push(dat[k])
		}
	}

	if (d3.select(".item_percent").attr("visibility") == "hidden") {
		var duration = 0;
	}
	else {
		duration = 250;
	}
	
	item_percent_x.domain(items.map(function(d) {
		return d.name;
	}));
	item_percent_y.domain([0, d3.max(items, function(d) {
		return d.percent;
	})]);

	var bars = item_percent_graph.select(".bars")
				.selectAll(".bar")
				.data(items, function(d) {
					return d.name;
				})

	bars.exit()
		.transition()
		.duration(duration)
		.attr("width", 0)
		.remove();

	bars.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("fill", function(d) {
			if (d.dname == "Aegis of the Immortal") {
				return "red";
			}
			if (d.dname == "Cheese") {
				return "red";
			}
			return item_percent_color(d.cost);
		})
		.on("mouseover", function(d) {

			if (d.dname == "Aegis of the Immortal" || d.dname == "Cheese") {
				var cost = "Dropped Item";
			}
			else {
				cost = d.cost
			}

			var basic_tip = "<div id='tooltip_text'><strong><span style='color:red';>" + d.dname + "</span></strong>" + "<br> Number of Games: " + d.count + "<br> Cost: " + cost + "<br></div>"
	  		var img_tip = "<div id='item_percent_tooltip_img'><img src='" + d.img + "' height='40px' width='53.125px'></div>"

	  		tip.html(img_tip + basic_tip);
	  		tip.show(d);
	  	})
	  	.on("mouseout", function(d) {
	  		tip.hide(d);
	  	})
		.transition().duration(duration);
		
	bars
		.transition()
		.duration(duration)
		.attr("x", function(d) {
			return item_percent_x(d.name);
		})
		.attr("y", function(d) {
			return item_percent_y(d.percent);
		})
		.attr("height", function(d) {
			return bb_item_percent.h - item_percent_y(d.percent);
		})
		.attr("width", item_percent_x.rangeBand);

	item_percent_graph.select(".y.axis")
		.transition()
		.duration(duration)
		.call(item_percent_yAxis);

	item_percent_graph.select(".x.axis")
		.transition()
		.duration(duration)
		.call(item_percent_xAxis);

	d3.select(".item_percent")
		.attr("visibility", null);

})

	//sorting by value

	d3.select("input#value").on("change", change);

	var sortTimeout = setTimeout(function() {
	    d3.select("input").property("checked", true).each(change);
	  }, 2000);

	function change() {
	    clearTimeout(sortTimeout);

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = item_percent_x.domain(items.sort(this.checked
	        ? function(a, b) { return b.percent - a.percent; }
	        : function(a, b) { return d3.ascending(a.name, b.name); })
	        .map(function(d) { return d.name; }))
	        .copy();

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 10; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.name); });

	    transition.select(".x.axis")
	        .call(item_percent_xAxis)
	      .selectAll("g")
	        .delay(delay);
	}

	//sorting by item

	d3.select("input#item").on("change", change_item);

	function change_item() {

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = item_percent_x.domain(items.sort(this.checked
	        ? function(a, b) { return d3.ascending(a.name, b.name); }
	        : function(a, b) { return d3.ascending(a.percent, b.percent); })
	        .map(function(d) { return d.name; }))
	        .copy();

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 10; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.name); });

	    transition.select(".x.axis")
	        .call(item_percent_xAxis)
	      .selectAll("g")
	        .delay(delay);
	  }

	//sorting by cost

	d3.select("input#cost").on("change", change_cost);

	function change_cost() {

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = item_percent_x.domain(items.sort(this.checked
	        ? function(a, b) { 
	        	if (a.dname == "Aegis of the Immortal" || a.dname == "Cheese") {
	        		a.cost = 100000;
	        	}
	        	if (b.dname == "Aegis of the Immortal" || b.dname == "Cheese") {
	        		b.cost = 100000;
	        	}
	        	return d3.ascending(a.cost, b.cost); 
	        }
	        : function(a, b) { return d3.ascending(a.name, b.name); })
	        .map(function(d) { return d.name; }))
	        .copy();

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 10; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.name); });

	    transition.select(".x.axis")
	        .call(item_percent_xAxis)
	      .selectAll("g")
	        .delay(delay);
	  }

	//filtering with the slider


	//possibly use this jquery code to dynamically update the max value
	// $('#page').page();
	// $('#cvote').val(3);
	// $('#cvote').slider('refresh');


}

function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
		
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


function reset_index(hero_id) {

	//hero id 107 is now 0
	//hero id 109 is not 24
	//hero id 110 is now 105
	//every other hero id is mapped to the correct index
	//when labeling the chord diagram, relabel hero ids 107, 109, 110

	if (hero_id == 109) {
		return 24;
	}
	if (hero_id == 110) {
		return 105;
	}
	if (hero_id == 107) {
		return 0;
	}
	else {
		return hero_id;
	}
}

function create_matrix (data, filter_value) {

	var matrix = [];

	for (var k = 0; k < 107; k++) {
		var new_array = [];
		for (var l = 0; l < 107; l++) {
			new_array.push(0);
		}
		matrix.push(new_array);
	}

	// var matrix_obj = {};

	// for (var i = 0; i < 107; i++) {
	// 	matrix_obj[i] = {};
	// 	for (var j = 0; j < 107; j++) {
	// 		matrix_obj[i][j] = 0;
	// 	}
	// }

	for (var i = 0; i < data.matches.length; i++) {
		var set = [];
		var gamemode = data.matches[i].game_mode

		//filter out gamemodes we don't want, like ones with five players, etc.
		if (gamemode == 15 || gamemode == 7 || gamemode == 0 || 
			gamemode == 6 || gamemode == 8 || gamemode == 9 || 
			gamemode == 10 || gamemode == 11 || gamemode == 12 || 
			gamemode == 13 || gamemode == 14 || gamemode ==  15 || gamemode == 18) {
			continue;
		}

		if (data.matches[i].players.length < 10) {
			continue;
		}

		for (var j = 0; j < 9; j++) {
			set.push(data.matches[i].players[j].hero_id);
		}

		var combinations_rad = k_combinations(set.slice(0,5),2);
		var combinations_dire = k_combinations(set.slice(5,10),2);

		for (var c = 0; c < combinations_rad.length; c ++) {
			matrix[reset_index(combinations_rad[c][0])][reset_index(combinations_rad[c][1])] += 1; 
			matrix[reset_index(combinations_rad[c][1])][reset_index(combinations_rad[c][0])] += 1; 
		}
		for (var c = 0; c < combinations_dire.length; c ++) {
			matrix[reset_index(combinations_dire[c][0])][reset_index(combinations_dire[c][1])] += 1; 
			matrix[reset_index(combinations_dire[c][1])][reset_index(combinations_dire[c][0])] += 1; 
		}
	}

	var new_dict = {};
	var lookup_dict = {};
	var counter = 0;
	var new_arr = [];

	for (var y = 0; y < 107; y ++) {
		for (var z = 0; z < 107; z++) {
			// if (matrix[y][z] != 0) {
			// 	new_dict[y] = {};
			// 	new_dict[y][z] = matrix[y][z]
			// }
			// if (matrix[z][y] != 0) {
			// 	new_dict[z] = {};
			// 	new_dict[z][y] = matrix[z][y]
			// }
			if (matrix[y][z] < filter_value) {
				matrix[y][z] = 0;
			}
			else {
				//it stays 
				if (!(y in new_dict)) {
					new_dict[y] = counter;
					new_arr[counter] = [];
					lookup_dict[counter] = y;
					counter++;
				}
				if (!(z in new_dict)) {
					new_dict[z] = counter;
					new_arr[counter] = [];
					lookup_dict[counter] = z;
					counter++;
				}
				new_arr[new_dict[y]][new_dict[z]] = matrix[y][z];
			}
		}
	}

	for (var i = 0; i < new_arr.length; i++) {
		for (var j = 0; j < new_arr.length; j++){
			if (new_arr[i][j] === undefined) {
				new_arr[i][j] = 0;
			}
		}
	}

	// var dense_matrix = [];

	// for (var y = 0; y < Object.keys(new_dict).length; y ++) {
	// 	var new_array = [];
	// 	//console.log(new_dict[y]);

	// 	for (var key in new_dict[y]) {
	// 	  new_array.push(new_dict[y][key])
	// 	}

	// 	dense_matrix.push(new_array);
	// }
	// console.log(dense_matrix)

	draw_hero_chord_graph(new_arr, lookup_dict);
}

function draw_hero_chord_graph(matrix, lookup_dict) {

	var chord = d3.layout.chord()
	    .padding(.05)
	    .sortSubgroups(d3.descending)
	    .matrix(matrix);

	var hero_chord_width = bb_hero_chord.w,
	    hero_chord_height = bb_hero_chord.h,
	    innerRadius = Math.min(hero_chord_width, hero_chord_height) * .41,
	    outerRadius = innerRadius * 1.1;

	var fill = d3.scale.ordinal()
	    .domain(["strength", "agility", "intelligence"])
	    .range(["#2BAC00", "#E38800","#1A88FC"]);

	// var groupings = {};
	// for (var i = 0; i < 106; i++) {
	// 	if (chord.groups()[i].value != 0) {
	// 		//console.log(chord.groups()[i].endAngle)
	// 		//chord.groups()[i].endAngle = chord.groups()[i].endAngle + (chord.groups()[i].value*.01)
	// 		groupings[i] = chord.groups()[i].value;
	// 	}
	// }

	// //console.log(groupings)

	// var padding = 0.05;

	// var k = 0;

	// for(var i in Object.keys(groupings)) { 
	// 	if (groupings[String(i)]) {
	// 		k += groupings[i]; 
	// 		//console.log(k)
	// 	}
	// }




	// var ngroups = Object.keys(groupings).length;
	
	// k = ((2 * 3.1415 - padding * ngroups) / k);

	// var connections = [];
	// for (var i in Object.keys(groupings)) {
	// 	if (groupings[String(i)]) {
	// 		connections.push([{group: parseInt(i), value: groupings[i]}])
	// 	}
	// }

	// //console.log(chord.chords())

	// var polygons = [];
	// var poly = {edges: [],
	//             vertices: {}
	//         };
	 
	// var i, j;
	// i = -1; while (++i < connections.length) {
	//     if (connections[i].length >= 1) {
	//         j = 0; while (++j < connections[i].length) {
	//             poly.edges.push({
	//                                 source: connections[i][j-1],
	//                                 target: connections[i][j]
	//                             });
	//             poly.vertices[connections[i][0].group + ''] = '';
	//         }
	//         poly.vertices[connections[i][0].group + ''] = '';
	//         if (poly.edges.length >= 1) {
	//             poly.edges.push({
	//                             source: connections[i][0],
	//                             target: connections[i][j-1]
	//                             });
	//         }
	//         polygons.push(poly);
	//         poly = {edges: [],
	//                 vertices: {}
	//             };
	//     }
	// };
		 
	// //console.log(polygons)
	
	// var h, samebase, subgroups = [];

	// // var id_array = [];

	// for (var id = 0; id < Object.keys(groupings).length; id++){
	// 	id_array.push(parseInt(Object.keys(groupings)[id]))
	// }
 
	// //for (item in id_array) {
	// i = -1; while (++i < ngroups) {
	//     subgroups[i] = [];
	//     j = -1; while (++j < polygons.length) {
	//         samebase = {'ribbons': [],
	//                     'basevalue': 0};
	//         h = -1; while (++h < polygons[j].edges.length) {
	//             if (polygons[j].edges[h].source.group === i) {
	//                 samebase.ribbons.push(polygons[j].edges[h]);
	//                 samebase.basevalue = polygons[j].edges[h].source.value;
	//             } 
	//             else if (polygons[j].edges[h].target.group === i) {
	//                 samebase.ribbons.push(polygons[j].edges[h]);
	//                 samebase.basevalue = polygons[j].edges[h].target.value;
	//             }
	//         }
	//         subgroups[i].push(samebase);
	//     }
	// }

	// i = -1; while (++i < connections.length) {
	//     if (connections[i].length === 1) {
	//         subgroups[connections[i][0].group].push({
	//                    'ribbons': [],
	//                    'basevalue': connections[i][0].value
	//                  });
	//     }
	// }

	// var range = function(n) {
	//     var out = [], i = -1;
	//     while(++i<n) {out.push(i);}
	//     return out;
	// }

	// var subgroupIndex = [];
	// i = -1; while (++i < ngroups) {
 //    	subgroupIndex.push(range(subgroups[i].length));
	// }

	// var pt, pt1, pt2, groups = [];
 
 // 	var groupIndex = range(ngroups);

	// var x = 0, i = -1; while (++i < ngroups) {
	//     var di = groupIndex[i];
	//     var x0 = x, j = -1; while (++j < subgroupIndex[di].length) {
	//         var dj = subgroupIndex[di][j],
	//         v = subgroups[di][dj].basevalue,
	//         a0 = x,
	//         a1 = x += v * k;
	//         h = -1; while(++h < subgroups[di][dj].ribbons.length) {
	//             pt1 = subgroups[di][dj].ribbons[h].source;
	//             pt2 = subgroups[di][dj].ribbons[h].target;
	//             if (pt1.group === di) { pt = pt1; }
	//             else { pt = pt2; }
	//             pt['geometry'] = {
	//                 index: di,
	//                 subindex: dj,
	//                 startAngle: a0,
	//                 endAngle: a1,
	//                 value: v
	//             };
	//         }
	//     }
	//     groups[di] = {
	//         index: di,
	//         startAngle: x0,
	//         endAngle: x,
	//         value: (x - x0) / k
	//     };
	//     x += padding;
	// }

	// // //console.log(groups)

	// var chords = [];

	// // //console.log(polygons)
 
	// i = -1; while (++i < polygons.length) {
	//     j = -1; while (++j < polygons[i].edges.length) {
	//         var source = polygons[i].edges[j].source,
	//         target = polygons[i].edges[j].target;
	//         //console.log(source)
	//         if (source.value || target.value) {
	//             chords.push(source.value < target.value
	//                         ? {source: target, target: source, groups: polygons[i].vertices}
	//                         : {source: source, target: target, groups: polygons[i].vertices});
	//         }
	//     }
	// }

	// console.log(groups)

	// //console.log(chords)

	// for (var index = 0; index < chord.chords().length; index ++) {
	// 	chord.chords()[index].source.group = chord.chords()[index].source.index;
	// 	chord.chords()[index].target.group = chord.chords()[index].target.index;

	// }

	// console.log(chord.chords())

	var groupings = [];

	for (var i = 0; i < chord.groups().length; i++) {
		chord.groups()[i].hero_id = lookup_dict[chord.groups()[i].index]
	}

	//console.log(chord.groups())

	var arcs = hero_chord_graph.append("g").selectAll("path")
	    .data(chord.groups)
	  .enter().append("path")
	    .style("fill", function(d) { 
	    	return fill(d2.getHeroInfo(d.hero_id).stat); 
	    })
	    .style("stroke", "white")
	    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
	    .on("mouseover", function(d,i) {
	    	var cur_hero_name = d2.getHeroName(d.hero_id)

	    	tip.html(cur_hero_name)
	    	tip.show(d);

	    	fade(.1)(d,i);

	    })
	    .on("mouseout", function(d,i){
	    	tip.hide(d);

	    	fade(1)(d,i);

	   	});

	var ticks = hero_chord_graph.append("g").selectAll("g")
	    .data(chord.groups)
	  .enter().append("g").selectAll("g")
	    .data(groupTicks)
	  .enter().append("g")
	    .attr("transform", function(d) {
	      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
	          + "translate(" + outerRadius + ",0)";
	    });

	hero_chord_graph.append("g")
	    .attr("class", "chord")
	  .selectAll("path")
	    .data(chord.chords)
	  .enter().append("path")
	    .attr("d", d3.svg.chord().radius(innerRadius))
	    .style("fill", function(d) { 
	    	return fill(d2.getHeroInfo(lookup_dict[d.target.index]).stat); 
	    })
	    .style("opacity", .7);

	// Returns an array of tick angles and labels, given a group.
	function groupTicks(d) {
	  var k = (d.endAngle - d.startAngle) / d.value;
	  return d3.range(0, d.value, 1000).map(function(v, i) {
	    return {
	      angle: v * k + d.startAngle,
	      label: i % 5 ? null : v / 1000 + "k"
	    };
	  });
	}

	hero_chord_graph
			.append("text")
			.attr("y", -210)
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.text("Heroes Played Together Most Often")
			.style("fill", "black");

	hero_chord_graph
			.append("text")
			.attr("y", -195)
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.text("in your dataset")
			.style("fill", "black")
			.style("font-size", "12px");

	// Returns an event handler for fading a given chord group.
	function fade(opacity) {
	  return function(g, i) {
	  	//console.log(i)
	    hero_chord_graph.selectAll(".chord path")
	        .filter(function(d) { 
	        	//console.log(d)
	        	return d.source.index != i && d.target.index != i; 
	        })
	      .transition()
	        .style("opacity", opacity);
	  };
	}
}

