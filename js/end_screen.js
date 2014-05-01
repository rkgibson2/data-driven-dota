var user_data;

var remaining = 2;

var ability_svg;

margin = {
        top: 10,
        right: 25,
        bottom: 25,
        left: 25
    };

width = 700 - margin.left - margin.right;

height = 230 - margin.bottom - margin.top;

var ability_g_dimension = 70;
var ability_img_dimension = 50;

var ability_tip = d3.tip().attr('class', 'd3-tip').html("init").offset([-5,0]);

var end_screen_height = d3.select("#end_screen").style("height")

create_end_screen();

function create_end_screen() {
    // copy all the player slots
    for (var i = 1; i < 5; i++) {
        $( "#radiant .slot0" ).clone().removeClass().addClass("slot" + i).appendTo("#radiant tbody")
        $( "#dire .slot0" ).clone().removeClass().addClass("slot" + i).appendTo("#dire tbody")
    }


    // add hidden div with svg for ability build
    ability_svg = d3.select(".ability_build").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });

    ability_svg.call(ability_tip);
}

function update_end_screen(game) {

    // turn 6 item entries into one item array
    game.players.forEach(function(d) {
        d.items = [];

        for (var i = 0; i < 6; i++) {
            if (d["item_" + i] != 0)
                d.items.push(d["item_" + i])
        }
    })

    // set winner
    d3.select("#winner")
        .text(((game.radiant_win) ? "Radiant" : "Dire") + " Victory")
        .attr("class", (game.radiant_win) ? "radiant" : "dire")

    // set match id text
    d3.select("#match_id .text").text(game.match_id)

    // set game mode text
    d3.select("#game_mode .text").text(d2.getGameModeInfo(game.game_mode).name)

    // game.start_time is in seconds since UNIX Epoch, but d3 new Date needs milliseconds   
    var start = new Date(game.start_time * 1000)
    d3.select("#date .text").text(date_string_utc(start))

    // convert duration (in seconds) to hours + seconds
    var hours = Math.floor(game.duration / 60);
    var seconds = game.duration % 60;

    // if seconds is one digit, pad with 0
    seconds = (seconds / 10 < 1) ? "0" + seconds : seconds 

    d3.select("#duration .text").text(hours + ":" + seconds)

    // filter dire and radiant players for data binding

    var radiant_players = game.players.filter( function(d) { return (d.player_slot & 0x80) == 0})
    var dire_players = game.players.filter( function(d) { return d.player_slot & 0x80 })

    d3.selectAll("#radiant tbody tr").data(radiant_players);
    d3.selectAll("#dire tbody tr").data(dire_players)

    var rows = d3.selectAll("#players tbody tr");

    // search for our player
    rows.each(function(d) {
        if (d.account_id == user_data.id32) {
            d3.select(this).attr("id", "user")
        } else {
            d3.select(this).attr("id", null)
        }
    })

    // propagate data binding to children 
    rows.selectAll("td").data(function(row) {
        return d3.range(12).map(function(column, i) {
                     return row;
                });
    });

    rows.selectAll("td").html(function(d) {
        this_cell = d3.select(this)
        if (this_cell.attr("class") == "player_name") {
            if (d.account_id == 4294967295) {
                var name_text = "Private account";
            } else {
                try {
                    var name_text = d2.getUserName(d.account_id);
                } catch (e) {
                    var name_text = d.account_id;
                }
            }

            d3.select(this).attr("title", name_text)

            return name_text
        } else if (this_cell.attr("class") == "items") {
            return ""
        } else if (this_cell.attr("class") == "hero") {
            var hero = d2.getHeroInfo(d.hero_id)
            var hero_name = "<img src='" + hero.img + "' height='36px'> " + hero.dname
            return hero_name
        } else {
            return d[this_cell.attr("class")]
        }
    })

    // set up ability build event handler
    d3.selectAll("td.hero")
        .on("click", function(d) {
            // toggle visibility of hero build
            if (d3.select(".ability_build").style("visibility") == "hidden" || d3.select(".ability_build").attr("player") != d.player_slot) {
                update_ability_build(d)
            } else {
                d3.select(".ability_build").style("visibility", "hidden")
            }
        })

    // add item images
    // remove old item images
    d3.selectAll(".end_screen_item_pic").remove()

    // add new images, one to each at a time for six times
    for (var i = 0; i < 6; i++) {
        rows.selectAll(".items").append("img")
            .attr("class", "end_screen_item_pic")
            .attr("src", function(d) { return (i in d.items) ? d2.getItemInfo(d.items[i]).img : "" })
            .attr("alt", function(d) { return (i in d.items) ? d2.getItemInfo(d.items[i]).dname : "" })
            .attr("title", function(d) { return (i in d.items) ? d2.getItemInfo(d.items[i]).dname : "empty" })
            .attr("height", "36px")
            .attr("width", "48px")
    }


    // update dot color and selection
    d3.selectAll("#timeline .end_screen_selected").classed("end_screen_selected", false).attr("r", 3)
    d3.selectAll("#stat_graphs .end_screen_selected").classed("end_screen_selected", false).attr("r", 3.5)
    d3.selectAll("[match_id='" + game.match_id + "']").classed("end_screen_selected", true).attr("r", 5)

    // give end screen a match_shown attribute, so we can reset the dots on exit
    d3.select("#end_screen").attr("match_shown", game.match_id)

    enter_end_screen();
    
    d3.select("#winner").on("click", exit_end_screen)
}

function update_ability_build (player) {
    ability_svg.selectAll(".level").remove()
    ability_svg.selectAll(".no_abilities_error").remove()

    // position div over whichever team the player is on
    // if radiant
    if (player.player_slot & 0x80) {
        $(".ability_build").css("top", $("#dire .headers").position().top)
    } else {
        $(".ability_build").css("top", $("#radiant .headers").position().top)
    }

    // if no ability data available (usually because match is old)
    if (!("ability_upgrades" in player)) {
        ability_svg.append("text")
            .attr("class", "no_abilities_error")
            .text("Sorry, no ability data available for this player")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height / 2 + 10)
    } else {
        var levels = ability_svg.selectAll(".level")
            .data(player.ability_upgrades)
            .enter().append("g")
            .attr("class", "level")
            .attr("transform", function(d, i) {
                var x_pos = (ability_g_dimension + 5) * (i % 9)
                var y_pos = (ability_g_dimension + 5) * Math.floor(i / 9)
                return "translate(" + x_pos + "," + y_pos + ")"
            })

        levels.append("text")
            .text(function(d) { return d.level })
            .attr("text-anchor", "middle")
            .attr("x", ability_img_dimension / 2)
            .attr("y", 10)

        // ability 5522 is the teleport version of Chen's Test of Faith, and the API returns that if Chen leveled it up by leveling up that version
        // 5329 is the damage version, which we use in both places
        levels.append("image")
            .attr("xlink:href", function(d) { return (d.ability == 5522) ? d2.getAbilityInfo(5329).img : d2.getAbilityInfo(d.ability).img })
            .attr("class", "ability_build_img")
            .attr("height", ability_img_dimension)
            .attr("width", ability_img_dimension)
            .attr("y", "15px")
            .on("mouseover", function(d) {
                // if the ability is stats
                if (d.ability == 5002) {
                    ability_tip.html("Attribute Upgrade")
                } else {
                    ability_tip.html((d.ability == 5522) ? d2.getAbilityInfo(5329).dname : d2.getAbilityInfo(d.ability).dname)
                }

                ability_tip.show(d)
                
            })
            .on("mouseout", ability_tip.hide)
    }

    d3.select(".ability_build").style("visibility", null)
        .attr("player", player.player_slot)
}

function enter_end_screen() {
    // remove ability build when we switch end screen
    d3.select(".ability_build").style("visibility", "hidden")

    if (d3.select("#end_screen").style("display") == "none") {
        d3.select("#end_screen").style("display", null)
            .style("height", "0px")
            .transition().duration(2000)
            .style("height", end_screen_height)

        d3.selectAll("#end_screen>*").style("opacity", 0)
            .transition().delay(1250).duration(750)
            .style("opacity", 1)
    }

    // scroll to end screen
    // with help from http://stackoverflow.com/questions/3432656/scroll-to-a-div-using-jquery
    $("html, body").animate({scrollTop: $(end_screen).offset().top - 180}, 2000)
}

function exit_end_screen() {
    if (d3.select("#end_screen").style("display") != "none") {
        d3.select("#end_screen")
            .style("height", end_screen_height)
            .transition().duration(2000)
            .style("height", "0px")
            
        d3.select("#end_screen")
            .transition().delay(2000)
            .style("display", "none")

        d3.selectAll("#end_screen>*").style("opacity", 1)
            .transition().duration(750)
            .style("opacity", 0)

        // reset dots to original sizes
        d3.selectAll("#timeline .end_screen_selected").classed("end_screen_selected", false).attr("r", 3)
        d3.selectAll("#stat_graphs .end_screen_selected").classed("end_screen_selected", false).attr("r", 3.5)

        // get rid of match_shown attribute
        d3.select("#end_screen").attr("match_shown", null)
    }
}