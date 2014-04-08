var user_data;

var this_game;

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

create_end_screen();

d2.loadJson(function() {
    if (!--remaining) {
        update_end_screen(user_data.matches[275])
    }
})

d2.loadUserData("robbie", function(error, data) {
    user_data = data;

    if (!--remaining) {
        update_end_screen(user_data.matches[275])
    }
})

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
    //console.log(game)
    this_game = game;

    // turn 6 item entries into one item array

    game.players.forEach(function(d) {
        d.items = [];

        for (var i = 0; i < 6; i++) {
            if (d["item_" + i] != 0)
                d.items.push(d["item_" + i])
        }
    })

    // set winner
    d3.select("#winner").text(((game.radiant_win) ? "Radiant" : "Dire") + " Victory")
        .attr("class", (game.radiant_win) ? "radiant" : "dire")

    // set match id text
    d3.select("#match_id .text").text(game.match_id)

    // set game mode text
    d3.select("#game_mode .text").text(d2.getGameModeInfo(game.game_mode).name)

    // game.start_time is in seconds since UNIX Epoch, but d3 new Date needs milliseconds   
    var start = new Date(game.start_time * 1000)
    var date_string_utc = d3.time.format.utc("%a %b %-d, %Y %X")
    var date_string = d3.time.format("%a %b %-d, %Y %X %Z")
    d3.select("#date .text").text(date_string_utc(start))

    // convert duration (in seconds) to hours + seconds
    var hours = Math.floor(game.duration / 60);
    var seconds = game.duration % 60;

    d3.select("#duration .text").text(hours + ":" + seconds)

    // rename this array for convenience
    var players = game.players

    var rows = d3.selectAll("tbody tr").data(players);

    // search for our player
    rows.each(function(d) {
        if (d.account_id == user_data.id32) {
            d3.select(this).attr("id", "user")
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
            var name_text = (d.account_id == 4294967295) ? "Private account" : (d.account_id == user_data.id32) ? user_data.user : d.account_id
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
    d3.selectAll(".end_screen_item_pic")

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

    d3.select("#end_screen").style("visibility", null);
}

function update_ability_build(player) {
    ability_svg.selectAll(".level").remove()

    // position div over whichever team the player is on
    // if radiant
    if (player.player_slot & 0x80) {
        d3.select(".ability_build").style("top", "304px")
    } else {
        d3.select(".ability_build").style("top", "30px")
    }

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

    levels.append("image")
        .attr("xlink:href", function(d) { return d2.getAbilityInfo(d.ability).img })
        .attr("height", ability_img_dimension)
        .attr("width", ability_img_dimension)
        .attr("y", "15px")
        .on("mouseover", function(d) {
            // if the ability is stats
            if (d.ability == 5002) {
                ability_tip.html("Attribute Upgrade")
            } else {
                ability_tip.html(d2.getAbilityInfo(d.ability).dname)
            }

            ability_tip.show(d)
            
        })
        .on("mouseout", ability_tip.hide)

    d3.select(".ability_build").style("visibility", null)
        .attr("player", player.player_slot)
}