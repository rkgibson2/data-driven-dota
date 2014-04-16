/*var user_data;
//var timelinesvg = d3.select("#timeline").append("svg");
d2.loadJson(function (){


d2.loadUserData("robbie", function(error, data) {
    user_data = data;
    var matches = user_data.matches;
   matches.forEach(function(d){
        var hero = d2.getHeroInfo(d.player_info.hero_id)
        d3.select("#timeline").append("img").attr("id","ID"+d.match_id).attr("class","timelinepic");
        d3.select("#timeline").select("#ID"+d.match_id).attr('src', hero.img).attr("width", "30px").attr("value", d.id);
});   

//var yScale = d3.scale.ordinal().range([0,5000]);
//var y_axis = d3.svg.axis().scale(yScale).orient("left");


//d3.select("#timeline").append("svg").append("g").attr("class","y axis").call(y_axis);



});

});*/
/*
var user_data;
d2.loadJson(function ()
{
	d2.loadUserData("robbie", function (error, data)
	{
		user_data = data;
		// user matches array
		var matches = user_data.matches;
        // bbOverview = timeline
		var bbOverview = {
			x: 0,
			y: 10,
			w: 900,
			h: 50
		};
		var margin = {
			top: 50,
			right: 50,
			bottom: 50,
			left: 150
		};
		// add svg
		var width = 1260 - margin.left - margin.right;
		var height = 800 - margin.bottom - margin.top;
		var svg = d3.select("#timeline").append("svg").attr(
		{
			width: width + margin.left + margin.right,
			height: height + margin.top + margin.bottom
		}).append("g").attr(
		{
			transform: "translate(" + margin.left + "," + margin.top + ")"
		});
		
		
		//tool tip setup
        var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([0,0]);

        svg.call(tip);
		
		
		// store domain from matches
		var xdomain = d3.extent(matches,
			function (d)
			{
				return (new Date(d.start_time * 1000));
			});
		// set up x and y scale
		var xScaleOverview = d3.time.scale().domain(xdomain).range([10, bbOverview.w-10]);
		var yScaleOverview = d3.scale.ordinal().domain(["strength", "agility", "intelligence"]).rangePoints([0, 50], 1, 0);
		// setup axis with scales and position
		var xAxisOverview = d3.svg.axis()
			.scale(xScaleOverview)
			.ticks(10)
			.orient("bottom");
		var yAxisOverview = d3.svg.axis()
			.scale(yScaleOverview)
			.ticks(3)
			.orient("left");
		// add a "g" for our overview visualization	
		var bbOverviewVis = svg.append("g");
		// add "g", call the axis and class/place them
		bbOverviewVis.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + bbOverview.h + ")")
			.attr("clip-path", "url(#clip)")
			.call(xAxisOverview);
		bbOverviewVis.append("g")
			.attr("class", "y axis")
			.call(yAxisOverview);
		var clip = svg.append("defs").append("svg:clipPath")
			.attr("id", "clip")
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
		var brush = d3.svg.brush()
			.x(xScaleOverview)
			// on selection
			.on("brush", brushmove)
			// end of selection
			.on("brushend", brushend);
	    // add the brush to the svg
		svg.append("g")
			.attr("class", "brush")
			.call(brush)
			.selectAll('rect')
			.attr('height', 50)
			.attr("y", 10);
          // add the nodes to the overview vis
		var dots = svg.append("g").attr({
			"transform": "translate(" + bbOverview.x + "," + (bbOverview.y) + ")"
		}).selectAll(".dot")
			.data(matches)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("clip-path", "url(#clip)")
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
			.style("fill", function(d){return d.player_win? "green" : "red"})
			.style("stroke", "black");
			// mouseover tips
			dots.on("mouseover", function (d)
			{
			var tooltip = true;

		    	var score = d.player_info.kills + "/" + d.player_info.deaths + "/" +  d.player_info.assists;
		    	var time = String(new Date(d.start_time*1000));
	
		       	var basic_tip = "<div id='tooltip_text'><strong>"+ score +"</strong>"+ "<br>" + (time) + "</br></div>";

		    	var img_tip = "<div id='hero_sunburst_tip'><img src='" + (d2.getHeroInfo(d.player_info.hero_id).img)+ "'' width='64px' height='36px'></div>";

		    	
		    	tip.html(img_tip + basic_tip);

		    	if (tooltip) {
		    		tip.show(d);
		    	}
		    })
		    .on("mouseout", function(d) {
		    	tip.hide(d);
			});
		function brushmove()
		{
			var extent = brush.extent();
			dots.classed("selected", function (d)
			{
			    // selection
				is_brushed = extent[0] <= (new Date(d.start_time * 1000)) && (new Date(d.start_time * 1000)) <= extent[1];
				return is_brushed;
			});
		}

		function brushend()
		{
		    // add a clear brush selection if we have brushed in
			get_button = d3.select(".clear-button");
			if (get_button.empty() === true)
			{
				clear_button = svg.append('text')
					.attr("y", bbOverview.h + 50)
					.attr("x", bbOverview.w - 100)
					.attr("class", "clear-button")
					.text("Clear Brush");
			}
			// change the xscale domain to the brush selection extent
			xScaleOverview.domain(brush.extent());
			// transition data points
			transition_data();
			// redraw axis with new labels
			reset_axis();
			// reclass dots as no longer selected
			dots.classed("selected", false);
			// clear the brush 
			d3.select(".brush").call(brush.clear());
			// add the on click events for the button
			clear_button.on('click', function ()
			{
			    // reset everything
				xScaleOverview.domain(xdomain);
				transition_data();
				reset_axis();
				clear_button.remove();
			});
		}
        // transitioning data points
		function transition_data()
		{
		    // rebind data and transition
			svg.selectAll(".dot")
				.data(matches)
				.transition()
				.duration(500)
				.attr("cx", function (d)
				{
					return xScaleOverview((new Date(d.start_time * 1000)));
				});
		}
        // redraw axis with new scale
		function reset_axis()
		{
			svg.transition().duration(500)
				.select(".x.axis")
				.call(xAxisOverview);
		}
	});
});
*/
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
	top: 50,
	right: 50,
	bottom: 50,
	left: 150
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

function create_timeline(userdata)
{
    d3.select("#timeline").select("svg").remove();
	// user matches array
	matches = userdata.matches;
	// bbOverview = timeline
	// add svg
	var width = 1260 - margin.left - margin.right;
	var height = 200 - margin.bottom - margin.top;
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
	// add the nodes to the overview vis
	dots = svgTimeLine.append("g").attr(
	{
		"transform": "translate(" + bbOverview.x + "," + (bbOverview.y) + ")"
	}).attr("class", "dotgroup").selectAll(".dot")
		.data(matches, function(d) { return d.match_id })
		.enter()
		.append("circle")
		.attr("class", "dot")
		
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
		.style("fill", function (d)
		{
			return d.player_win ? "green" : "red"
		})
		.style("stroke", "black");
		
		
		
	// mouseover tips
	svgTimeLine.selectAll(".dot").on("mouseover", function (d)
	{
		var tooltip = true;
		var score = d.player_info.kills + "/" + d.player_info.deaths + "/" + d.player_info.assists;
		var time = String(new Date(d.start_time * 1000));
		var basic_tip = "<div id='tooltip_text'><strong>" + score + "</strong>" + "<br>" + (time) + "</br></div>";
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
	dots.classed("selected", function (d)
	{
		// selection
		is_brushed = extent[0] <= (new Date(d.start_time * 1000)) && (new Date(d.start_time * 1000)) <= extent[1];
		return is_brushed;
	});
}

function brushend()
{
	// add a clear brush selection if we have brushed in
	get_button = d3.select(".clear-button_timeline");
	if (get_button.empty() === true)
	{
		clear_button = svgTimeLine.append('text')
			.attr("y", bbOverview.h + 50)
			.attr("x", bbOverview.w - 100)
			.attr("class", "clear-button_timeline")
			.text("Clear Brush");
	}
	// change the xscale domain to the brush selection extent
	xScaleOverview.domain(brush.extent());
	// transition data points
	transition_data(matches);
	// redraw axis with new labels
	reset_axis();
	// reclass dots as no longer selected
	dots.classed("selected", false);
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
	//console.log(matches.length)
	// rebind data and transition
	svgTimeLine.selectAll(".dot")
		.data(matchdata, function(d) { return d.match_id})
		.transition()
		.duration(500)
		.attr("cx", function (d)
		{
			return xScaleOverview((new Date(d.start_time * 1000)));
		}).attr("cy", function (d)
		{
			return yScaleOverview(d2.getHeroInfo(d.player_info.hero_id).stat)
		});
		
var newdots = svgTimeLine.select(".dotgroup").selectAll(".dot")
		.data(matchdata, function(d) { return d.match_id })
		.enter()
		.append("circle")
		.attr("class", "dot")
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
		.style("fill", function (d)
		{
			return d.player_win ? "green" : "red"
		})
		.style("stroke", "black");
		
newdots.on("mouseover", function (d)
	{
		var tooltip = true;
		var score = d.player_info.kills + "/" + d.player_info.deaths + "/" + d.player_info.assists;
		var time = String(new Date(d.start_time * 1000));
		var basic_tip = "<div id='tooltip_text'><strong>" + score + "</strong>" + "<br>" + (time) + "</br></div>";
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
			tiptimeline.hide(d);
		});	
	
	
	
	svgTimeLine.selectAll(".dot")
		.data(matchdata, function(d) { return d.match_id }).exit().transition().remove();
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

    update_gpm(filtered_data);

    update_xpm(filtered_data);	
	

};
