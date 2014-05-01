var xScaleOverview;
var yScaleOverview;
var yAxisOverview;
var xAxisOverview;
var svgTimeLine;
var bbOverview = {
	x: 0,
	y: 10,
	w: 900,
	h: 50
};
var margin = {
	top: 10,
	right: 10,
	bottom: 30,
	left: 70
};
//tool tip setup
var tiptimeline = d3.tip()
	.attr("class", "d3-tip")
	.offset([0, 0]);
var bbOverviewVis;
var brush;
var dots;
var matches;
var xdomain;

// used for printing start dates
var date_string_utc = d3.time.format.utc("%a %b %-d, %Y %X")

function create_timeline(userdata)
{
    d3.select("#timeline").select("svg").remove();
	// user matches array
	matches = userdata.matches;
	// bbOverview = timeline
	// add svg
	var width = 980 - margin.left - margin.right;
	var height = 120 - margin.bottom - margin.top;
	svgTimeLine = d3.select("#timeline").append("svg").attr(
	{
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	}).append("g").attr(
	{
		transform: "translate(" + margin.left + "," + margin.top + ")"
	});
	svgTimeLine.call(tiptimeline);
	// store domain from matches
	xdomain = d3.extent(matches,
		function (d)
		{
			return (new Date(d.start_time * 1000));
		});
	// set up x and y scale
	xScaleOverview = d3.time.scale().domain(xdomain).range([10, bbOverview.w - 10]);
	yScaleOverview = d3.scale.ordinal().domain(["strength", "agility", "intelligence"]).rangePoints([0, 50], 1, 0);
	// setup axis with scales and position
	xAxisOverview = d3.svg.axis()
		.scale(xScaleOverview)
		.ticks(10)
		.orient("bottom");
	yAxisOverview = d3.svg.axis()
		.scale(yScaleOverview)
		.ticks(3)
		.orient("left");
	// add a "g" for our overview visualization	
	bbOverviewVis = svgTimeLine.append("g");
	// add "g", call the axis and class/place them
	bbOverviewVis.append("g")
		.attr("class", "xx axis")
		.attr("transform", "translate(0," + bbOverview.h + ")")
		.attr("clip-path", "url(#timeline_clip)")
		.call(xAxisOverview);
	bbOverviewVis.append("g")
		.attr("class", "yy axis")
		.call(yAxisOverview);
	var clip = svgTimeLine.append("defs").append("svg:clipPath")
		.attr("id", "timeline_clip")
		.append("svg:rect")
		.attr("id", "clip-rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", bbOverview.w)
		.attr("height", height);

	// translate our vis space 
	bbOverviewVis.attr(
	{
		"transform": "translate(" + bbOverview.x + "," + (bbOverview.y) + ")"
	});
	// add brush function
	brush = d3.svg.brush()
		.x(xScaleOverview)
	// on selection
	.on("brush", brushmove)
	// end of selection
	.on("brushend", brushend);
	// add the brush to the svg
	svgTimeLine.append("g")
		.attr("class", "timeline_brush")
		.call(brush)
		.selectAll('rect')
		.attr('height', 50)
		.attr("y", 10);

	// add description text
	svgTimeLine.append("text")
		.attr("class", "text")
		.attr("text-anchor", "middle")
		.attr("y", height + 15)
		.attr("x", width / 2)
		.text("Select a region on the timeline to filter your games. Click a dot to see the end-game screen for that game.")
		.style("font-size", "12px");

	// add the nodes to the overview vis
	dots = svgTimeLine.append("g").attr(
		{
			"transform": "translate(" + bbOverview.x + "," + (bbOverview.y) + ")"
		})
		.attr("class", "dotgroup").selectAll(".dot")
		.data(matches, function(d) { return d.match_id })
		.enter()
		.append("circle")
		.attr("class", function(d) {
			return (d.player_win) ? "dot win" : "dot loss"
		})
      	.attr("match_id", function(d) { return d.match_id })
		.attr("clip-path", "url(#timeline_clip)")
		// add a circular node at the correct coordinates from our dataSet
		.attr("cx", function (d)
		{
			return xScaleOverview((new Date(d.start_time * 1000)))
		})
		.attr("cy", function (d)
		{
			return yScaleOverview(d2.getHeroInfo(d.player_info.hero_id).stat)
		})
		.attr("r", 3)
		.on("click", update_end_screen);
		
	d3.selection.prototype.moveToFront = function() {
		return this.each(function(){
		this.parentNode.appendChild(this);
		});
	};
		
	// mouseover tips
	svgTimeLine.selectAll(".dot").on("mouseover", function (d)
	{
      	// update dota styling
    	sel = d3.selectAll("[match_id='" + d.match_id + "']")
    		.classed("match_dot_hover", true)
    		.attr("r", 5);

    	sel.moveToFront();

		var tooltip = true;
		var score = d.player_info.kills + "/" + d.player_info.deaths + "/" + d.player_info.assists;
		var time = new Date(d.start_time * 1000);
		var basic_tip = "<div id='tooltip_text'><strong>K/D/A: " + score + "</strong>" + "<br>" + date_string_utc(time) + "</br></div>";
		var img_tip = "<div id='hero_sunburst_tip'><img src='" + (d2.getHeroInfo(d.player_info.hero_id).img) +
			"'' width='64px' height='36px'></div>";
		tiptimeline.html(img_tip + basic_tip);
		if (tooltip)
		{
			tiptimeline.show(d);
		}
	})
		.on("mouseout", function (d)
		{
	      	// update dot styling, but only if not selected
	      	if (d3.select(this).classed("end_screen_selected") == false) {
	      		d3.selectAll("#timeline .match_dot_hover").attr("r", 3)
	    		d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
	    	}

	    	// but we always want to remove the match_dot_hover class
	    	d3.selectAll("#timeline .match_dot_hover").classed("match_dot_hover", false)
	    	d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false)

			tiptimeline.hide(d);
		});
};

function update_timeline(filtereddata)
{

	matches = filtereddata.matches;
	// store domain from matches
	xdomain = d3.extent(matches,
		function (d)
		{
			return (new Date(d.start_time * 1000));
		});
	// set up x and y scale
	xScaleOverview = d3.time.scale().domain(xdomain).range([10, bbOverview.w - 10]);
	yScaleOverview = d3.scale.ordinal().domain(["strength", "agility", "intelligence"]).rangePoints([0, 50], 1, 0);
	transition_data(matches);
	xAxisOverview = d3.svg.axis()
		.scale(xScaleOverview)
		.ticks(10)
		.orient("bottom");
	yAxisOverview = d3.svg.axis()
		.scale(yScaleOverview)
		.ticks(3)
		.orient("left");
	reset_axis();
	// add brush function
	brush = d3.svg.brush()
		.x(xScaleOverview)
		// on selection
		.on("brush", brushmove)
		// end of selection
		.on("brushend", brushend);

	// add the brush to the svg
	svgTimeLine.select("g.timeline_brush")
		.call(brush)
		.selectAll('rect')
		.attr('height', 50)
		.attr("y", 10);
		

		
};

function brushmove()
{
	var extent = brush.extent();
	d3.selectAll(".dot").classed("selected", function (d)
	{
		// selection
		is_brushed = extent[0] <= (new Date(d.start_time * 1000)) && (new Date(d.start_time * 1000)) <= extent[1];
		return is_brushed;
	});
}

function brushend()
{
	brush_domain = brush.extent();

	// equal domain ends means click on graph
	// coerce dates to numbers to check equality
	if (+brush_domain[1] == +brush_domain[0]) {
		console.log("SAME");
		return;
	}
	// add a clear brush selection if we have brushed in
	get_button = d3.select(".clear-button_timeline");

	if (get_button.empty() === true)
	{
		clear_button = svgTimeLine.append("g")
			.attr("transform", "translate(" + (bbOverview.w - 100) + "," + (bbOverview.h + 50) + ")")
			.attr("class", "clear-button_timeline");

		clear_button.append("rect")
			.attr("width", 102)
			.attr("height", 20)
			.attr("y", -17)
			.attr("x", -4)
			.attr("rx", "10px")
			.attr("ry", "10px")
			.style("fill", "white");

		clear_button
			.append('text')
			.attr("y", 0)
			.attr("x", 0)
			.text("Clear Zoom")
			.style("fill", "black");

	}
	// change the xscale domain to the brush selection extent
	xScaleOverview.domain(brush_domain);
	// transition data points
	transition_data(matches);
	// redraw axis with new labels
	reset_axis();
	// reclass dots as no longer selected
	d3.selectAll(".dot").classed("selected", false);
	// clear the brush 
	d3.select(".timeline_brush").call(brush.clear());
	// add the on click events for the button
	clear_button.on('click', function ()
	{
		// reset everything
		xScaleOverview.domain(xdomain);
		transition_data(matches);
		reset_axis();
		clear_button.remove();
		update_graphs();
	});
	update_graphs();
}
// transitioning data points
function transition_data(matchdata)
{
	// console.log(matches.length)
	// rebind data and transition
	var dots = svgTimeLine.select(".dotgroup").selectAll(".dot")
		.data(matchdata, function(d) { return d.match_id })

	// transition existing elements
	dots.transition()
		.duration(500)
		.attr("cx", function (d)
		{
			return xScaleOverview((new Date(d.start_time * 1000)));
		}).attr("cy", function (d)
		{
			return yScaleOverview(d2.getHeroInfo(d.player_info.hero_id).stat)
		});
		
	// append and transition new elements
	dots.enter()
		.append("circle")
		.attr("class", function(d) {
			return (d.player_win) ? "dot win" : "dot loss"
		})
      	.attr("match_id", function(d) { return d.match_id })
		.attr("clip-path", "url(#timeline_clip)")
		// add a circular node at the correct coordinates from our dataSet
		.attr("cx", function (d)
		{
			return xScaleOverview((new Date(d.start_time * 1000)))
		})
		.attr("cy", function (d)
		{
			return yScaleOverview(d2.getHeroInfo(d.player_info.hero_id).stat)
		})
		.attr("r", 3)
		.on("mouseover", function (d)
		{
	      	// update dota styling
	    	d3.selectAll("[match_id='" + d.match_id + "']").classed("match_dot_hover", true).attr("r", 5)

			var tooltip = true;
			var score = d.player_info.kills + "/" + d.player_info.deaths + "/" + d.player_info.assists;
			var time = new Date(d.start_time * 1000);
			var basic_tip = "<div id='tooltip_text'><strong>K/D/A: " + score + "</strong>" + "<br>" + date_string_utc(time) + "</br></div>";
			var img_tip = "<div id='hero_sunburst_tip'><img src='" + (d2.getHeroInfo(d.player_info.hero_id).img) +
				"'' width='64px' height='36px'></div>";
			tiptimeline.html(img_tip + basic_tip);
			if (tooltip)
			{
				tiptimeline.show(d);
			}
		})
		.on("mouseout", function (d)
		{
	      	// update dot styling, but only if not selected
	      	if (d3.select(this).classed("end_screen_selected") == false) {
	      		d3.selectAll("#timeline .match_dot_hover").attr("r", 3)
	    		d3.selectAll("#stat_graphs .match_dot_hover").attr("r", 3.5)
	    	}

	    	// but we always want to remove the match_dot_hover class
	    	d3.selectAll("#timeline .match_dot_hover").classed("match_dot_hover", false)
	    	d3.selectAll("#stat_graphs .match_dot_hover").classed("match_dot_hover", false)
	    	
			tiptimeline.hide(d);
		})
		.on("click", update_end_screen);	
	
	// remove dots with no data
	dots.exit().transition().remove();
}
// redraw axis with new scale
function reset_axis()
{
	svgTimeLine.transition().duration(500)
		.select(".xx.axis")
		.call(xAxisOverview);
}

function update_graphs(){

	filtered_data = {
		id32: user_data.id32,
		id64: user_data.id64,
		matches: [],
		user: user_data.user
	}
	
	var extent = xScaleOverview.domain();

	filtered_data.matches = matches.filter(function(d){if ((extent[0] <= (new Date(d.start_time * 1000))) && ((new Date(d.start_time * 1000)) <= extent[1])) return 1});


    update_win_loss(filtered_data);

    update_item_percent(filtered_data);

    hero_pie(update_flare(filtered_data));

    create_matrix(filtered_data);

	d3.select("input[name=hero_filter]").on("change", function() { 
		d3.select("#hero_filter .filterInput").text(this.value);
		rerender(filtered_data);  
	});

    update_gpm(filtered_data);

    update_xpm(filtered_data);	

    update_user_interact(filtered_data);

	updateRecords(filtered_data);
};
