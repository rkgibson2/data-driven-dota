//Angela Fan

//data global
var user_data;

//margins and bounding boxes for each graph visualization
var bb_win_loss, bb_hero_pie, bb_item_percent, bb_hero_chord, bb_gpm, bb_xpm;

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
    x: 450,
    y: 380,
    w: 400,
    h: 400
};

bb_user_interact = {
	x: 0,
	y: 450,
	h: 400,
	w: 400
}

bb_gpm = {
	x: 0,
	y: 450,
	h: 400,
	w: 400
}

bb_xpm = {
	x: 500,
	y: 450,
	h: 400,
	w: 400
}

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

var user_interact_graph = svg.append("g")
	.attr("class", "user_interact")
	.attr("transform", "translate(" + bb_hero_chord.x + "," + bb_hero_chord.y + ")");

var gpm_graph = svg.append("g")
	.attr("class", "gpm")
	.attr("transform", "translate(" + bb_gpm.x + "," + bb_gpm.y + ")");

var xpm_graph = svg.append("g")
	.attr("class", "xpm")
	.attr("transform", "translate(" + bb_xpm.x + "," + bb_xpm.y + ")");

var item_percent_x, item_percent_y, item_percent_xAxis, item_percent_yAxis, item_percent_color;

//tool tip setup
var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0,0]);

svg.call(tip);

//function calls
d2.loadJson(function() {

	// Benjy's stuff
	hero_keys = d2.getKeys("heroes");
	var intheroes = new Array();
	var agiheroes = new Array();
	var strheroes = new Array();
	for (var i = 0; i < hero_keys.length; i++)
	{
		var hero = d2.getHeroInfo(hero_keys[i]);;
		if (hero)
		{
			if (hero.stat == "strength")
			{
				strheroes.push(hero);
			}
			else if (hero.stat == "agility")
			{
				agiheroes.push(hero);
			}
			else if (hero.stat == "intelligence")
			{
				intheroes.push(hero);
			}
		}
	};
	strheroes.sort(sorting);
	agiheroes.sort(sorting);
	intheroes.sort(sorting);
	strheroes.forEach(function (d)
	{
		var heroname = d.name;
		d3.select("#strimages").append("img").attr("id", heroname).attr("class", "pic");
		d3.select("#strimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
		d3.select("#strimages").select("#" + heroname).on("click", highlight);
	});
	agiheroes.forEach(function (d)
	{
		var heroname = d.name;
		d3.select("#agiimages").append("img").attr("id", heroname).attr("class", "pic");
		d3.select("#agiimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
		d3.select("#agiimages").select("#" + heroname).on("click", highlight);
	});
	intheroes.forEach(function (d)
	{
		var heroname = d.name;
		d3.select("#intimages").append("img").attr("id", heroname).attr("class", "pic");
		d3.select("#intimages").select("#" + heroname).attr('src', d.img).attr("width", "80px").attr("value", d.id);
		d3.select("#intimages").select("#" + heroname).on("click", highlight);
	});

	loadData("david");
});

//loadData("robbie");

draw_win_loss();

draw_item_percent();

draw_gpm();

draw_xpm();

function loadData(username) {
	 
	d2.loadUserData(username, function(error,data) {

        user_data = data;

        //update function calls
        update_win_loss(user_data);

        update_item_percent(user_data);

        create_flare(data);

        create_matrix(data);

        update_gpm(user_data);

        update_xpm(user_data);

        //update chord diagram
		d3.select("input[name=hero_filter]").on("change", function() { 
			d3.select("#hero_filter .filterInput").text(this.value);
			rerender(data);  
		});

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


function create_matrix (data) {


	var filter_value = d3.select("input[name=hero_filter]")[0][0].value;
	//d3.select("input[name=hero_filter]")[0][0].value;

	var matrix = [];

	for (var k = 0; k < 111; k++) {
		var new_array = [];
		for (var l = 0; l < 111; l++) {
			new_array.push(0);
		}
		matrix.push(new_array);
	}

	for (var i = 0; i < data.matches.length; i++) {

		var set = [];
		var gamemode = data.matches[i].game_mode;
		var continue_on = false;

		//filter out gamemodes we don't want, like ones with five players, etc.
		if (gamemode == 15 || gamemode == 7 || gamemode == 0 || 
			gamemode == 6 || gamemode == 8 || gamemode == 9 || 
			gamemode == 10 || gamemode == 11 || gamemode == 12 || 
			gamemode == 13 || gamemode == 14 || gamemode ==  15 || gamemode == 18) {
			continue;
		}

		//filter out games with less than 10 players
		if (data.matches[i].players.length < 10) {
			continue;
		}

		//filter out games where a player did not pick a hero
		data.matches[i].players.map(function(d) {
			if (d.hero_id == 0) {
				continue_on = true;
			}
		})

		if (continue_on == true) {
			continue;
		}

		for (var j = 0; j < 9; j++) {
			set.push(data.matches[i].players[j].hero_id);
		}

		var combinations_rad = k_combinations(set.slice(0,5),2);
		var combinations_dire = k_combinations(set.slice(5,10),2);

		for (var c = 0; c < combinations_rad.length; c ++) {
			matrix[combinations_rad[c][0]][combinations_rad[c][1]] += 1; 
			matrix[combinations_rad[c][1]][combinations_rad[c][0]] += 1; 
		}
		for (var c = 0; c < combinations_dire.length; c ++) {
			matrix[combinations_dire[c][0]][combinations_dire[c][1]] += 1; 
			matrix[combinations_dire[c][1]][combinations_dire[c][0]] += 1; 
		}
	}

	var new_dict = {};
	var lookup_dict = {};
	var counter = 0;
	var new_arr = [];


	for (var y = 1; y < 111; y ++) {
		for (var z = 1; z < 111; z++) {
			if (matrix[y][z] <= filter_value) {
				matrix[y][z] = 0;
			}
			else {
				//it stays 
				// if (y == 24 || z == 24) {
				// 	// console.log(y,z)
				// 	// console.log(matrix[y][z])
				// }
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

	draw_hero_chord_graph(new_arr, lookup_dict);
}


function draw_hero_chord_graph(matrix, lookup_dict) {

	//console.log(lookup_dict)

	var chord = d3.layout.chord()
	    .padding(.05)
	    .sortSubgroups(d3.descending)
	    .matrix(matrix);

	var hero_chord_width = bb_hero_chord.w,
	    hero_chord_height = bb_hero_chord.h,
	    innerRadius = Math.min(hero_chord_width, hero_chord_height) * .41,
	    outerRadius = innerRadius * 1.1;

	var fill = d3.scale.ordinal()
	    .domain(["agility", "strength", "intelligence"])
	    .range(["#2BAC00", "#E38800","#1A88FC"]);

	var groupings = [];

	for (var i = 0; i < chord.groups().length; i++) {
		chord.groups()[i].hero_id = lookup_dict[chord.groups()[i].index]
	}

	var arcs = hero_chord_graph.append("g").attr("class","arcs").selectAll("path")
	    .data(chord.groups)
	  .enter()
	  	.append("path")
	  	.on("mouseover", function(d,i) {

	  		var hero_info = d2.getHeroInfo(d.hero_id);

	  		var basic_tip = "<div id='tooltip_text'><strong>"+ hero_info.dname +"</strong></div>";

	    	var img_tip = "<div id='hero_sunburst_tip'><img src='" + hero_info.img + "'' width='64px' height='36px'></div>";

	    	tip.html(img_tip + basic_tip);

	    	tip.show(d);

	    	fade(.1)(d,i);

	    })
	    .on("mouseout", function(d,i){
	    	tip.hide(d);

	    	fade(1)(d,i);

	   	})	    
	   	.style("fill", function(d) { 
	    	//console.log(d)
	    	//console.log(lookup_dict)
	    	return fill(d2.getHeroInfo(d.hero_id).stat); 
	    })
	    .style("opacity", 0)
	   	.transition().duration(1000)
	   	.style("opacity", 1)
	    .style("stroke", "white")
	    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
	    

	hero_chord_graph.append("g")
	    .attr("class", "chord")
	  .selectAll("path")
	    .data(chord.chords)
	  .enter()
	  	.append("path")
	  	.style("fill", function(d) { 
	    	return fill(d2.getHeroInfo(lookup_dict[d.target.index]).stat); 
	    })
	    .style("opacity", 0)
	  	.transition().duration(1000)
	    .attr("d", d3.svg.chord().radius(innerRadius))
	    .style("opacity", .7);

	hero_chord_graph
			.append("text")
			.attr("y", -210)
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.text("Heroes Played Together Most Often");

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

function rerender(data) {

	d3.selectAll(".chord")
		.transition()
		.style("opacity", 0)
		.duration(1000)
		.remove();

	d3.selectAll(".arcs")
		.transition()
		.style("opacity", 0)
		.duration(1000)
		.remove();

	create_matrix(data);

}

var gpm_, gpm_y, gpm_color, gpm_xAxis, gpm_yAxis;

function draw_gpm() {
	gpm_x = d3.scale.linear()
    .range([0, bb_gpm.w]);

	gpm_y = d3.scale.linear()
	    .range([bb_gpm.h, 0]);

	gpm_color = d3.scale.ordinal()
		.domain([true,false])
		.range(["green", "red"]);

	gpm_xAxis = d3.svg.axis()
	    .scale(gpm_x)
	    .orient("bottom");

	gpm_yAxis = d3.svg.axis()
	    .scale(gpm_y)
	    .orient("left");

	gpm_graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bb_gpm.h + ")")
      .call(gpm_xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", bb_gpm.w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Average GPM of Hero");

  	gpm_graph.append("g")
      .attr("class", "y axis")
      .call(gpm_yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("GPM of hero in game");

   	gpm_graph.append('line')
   		.attr("class", "forty-five")
	    .attr('x1', gpm_x(0))
	    .attr('x2', gpm_x(1))
	    .attr('y1', gpm_y(0))
	    .attr('y2', gpm_y(1))
	    .style("stroke", "black")
	    .style("stroke-width", "3px");


}

function update_gpm(data) {
	//console.log(data);

	var gpm_dict = {};

	data.matches.map(function(d) {
		var player = d.player_info;	
		if (!(player.hero_id in gpm_dict)) {
			gpm_dict[player.hero_id] = []
		}
		gpm_dict[player.hero_id].push(d);
	});

	var gpm_array = [];

	//now calculate all of the averages
	for (id in gpm_dict) {
		var total = gpm_dict[id].reduce(function(rest,match) {
			return (rest + match.player_info.gold_per_min);
		}, 0)
		var hero_average = total/gpm_dict[id].length;

		gpm_dict[id].map(function(d) { 
			d.player_info.hero_avg_gpm = hero_average; 
			gpm_array.push(d)
		});
	}

	//console.log(gpm_array)

	var max_value = Math.max(
		d3.max(gpm_array, function(d) {
			return d.player_info.hero_avg_gpm;}), 
		d3.max(gpm_array, function(d) {
			return d.player_info.gold_per_min;
	}));


	gpm_x.domain([0, max_value]);

	gpm_y.domain([0, max_value]);

	var datapoints = gpm_graph.selectAll(".dot")
      .data(gpm_array)

    datapoints
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return gpm_x(d.player_info.hero_avg_gpm); })
      .attr("cy", function(d) { return gpm_y(d.player_info.gold_per_min); })
      .style("fill", function(d) { return gpm_color(d.player_win); })
      .on("mouseover", function(d) {
      	var format = d3.format(".2f");

      	var text = "<strong>" + d2.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>GPM this Game: " + d.player_info.gold_per_min + "<br>Average GPM on this hero: " + format(d.player_info.hero_avg_gpm); 
      	
      	tip.html(text);
      	tip.show(d)
      })
      .on("mouseout", function(d) {
      	tip.hide(d);
      });

    datapoints.exit().remove();

   	gpm_graph.select(".x.axis")
   		.call(gpm_xAxis);

   	gpm_graph.select(".y.axis")
   		.call(gpm_yAxis);

   	gpm_graph.select(".forty-five")
   		.attr("x2", gpm_x(max_value))
   		.attr("y2", gpm_y(max_value));

}

var xpm_x, xpm_y, xpm_color, xpm_xAxis, xpm_yAxis;

function draw_xpm() {
	xpm_x = d3.scale.linear()
    .range([0, bb_xpm.w]);

	xpm_y = d3.scale.linear()
	    .range([bb_xpm.h, 0]);

	xpm_color = d3.scale.ordinal()
		.domain([true,false])
		.range(["green", "red"]);

	xpm_xAxis = d3.svg.axis()
	    .scale(xpm_x)
	    .orient("bottom");

	xpm_yAxis = d3.svg.axis()
	    .scale(xpm_y)
	    .orient("left");

	xpm_graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bb_xpm.h + ")")
      .call(xpm_xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", bb_xpm.w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Average XPM of Hero");

  	xpm_graph.append("g")
      .attr("class", "y axis")
      .call(xpm_yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("XPM of hero in game");

   	xpm_graph.append('line')
   		.attr("class", "forty-five")
	    .attr('x1', xpm_x(0))
	    .attr('x2', xpm_x(1))
	    .attr('y1', xpm_y(0))
	    .attr('y2', xpm_y(1))
	    .style("stroke", "black")
	    .style("stroke-width", "3px");


}

function update_xpm(data) {
	//console.log(data);

	var xpm_dict = {};

	data.matches.map(function(d) {
		var player = d.player_info;	
		if (!(player.hero_id in xpm_dict)) {
			xpm_dict[player.hero_id] = []
		}
		xpm_dict[player.hero_id].push(d);
	});

	var xpm_array = [];

	//now calculate all of the averages
	for (id in xpm_dict) {
		var total = xpm_dict[id].reduce(function(rest,match) {
			return (rest + match.player_info.xp_per_min);
		}, 0)
		var hero_average = total/xpm_dict[id].length;

		xpm_dict[id].map(function(d) { 
			d.player_info.hero_avg_xpm = hero_average; 
			xpm_array.push(d)
		});
	}

	//console.log(gpm_array)

	var max_value = Math.max(
		d3.max(xpm_array, function(d) {
			return d.player_info.hero_avg_xpm;}), 
		d3.max(xpm_array, function(d) {
			return d.player_info.xp_per_min;
	}));


	xpm_x.domain([0, max_value]);

	xpm_y.domain([0, max_value]);

	var datapoints = xpm_graph.selectAll(".dot")
      .data(xpm_array)

    datapoints
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return xpm_x(d.player_info.hero_avg_xpm); })
      .attr("cy", function(d) { return xpm_y(d.player_info.xp_per_min); })
      .style("fill", function(d) { return xpm_color(d.player_win); })
      .on("mouseover", function(d) {
      	var format = d3.format(".2f");

      	var text = "<strong>" + d2.getHeroName(d.player_info.hero_id) + "</strong>" + "<br>XPM this Game: " + d.player_info.xp_per_min + "<br>Average XPM on this hero: " + format(d.player_info.hero_avg_xpm); 
      	
      	tip.html(text);
      	tip.show(d)
      })
      .on("mouseout", function(d) {
      	tip.hide(d);
      });

    datapoints.exit().remove();

   	xpm_graph.select(".x.axis")
   		.call(xpm_xAxis);

   	xpm_graph.select(".y.axis")
   		.call(xpm_yAxis);

   	xpm_graph.select(".forty-five")
   		.attr("x2", xpm_x(max_value))
   		.attr("y2", xpm_y(max_value));

}

