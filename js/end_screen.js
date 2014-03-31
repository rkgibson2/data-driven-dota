var user_data;

var this_game;

var remaining = 2;

create_end_screen();

d2.loadJson(function() {
    if (!--remaining) update_end_screen(user_data.matches[0])
})

d2.loadUserData("robbie", function(error, data) {
    user_data = data;

    if (!--remaining) update_end_screen(user_data.matches[0])
})

function create_end_screen() {
    for (var i = 1; i < 5; i++) {
        $( "#radiant .slot0" ).clone().removeClass().addClass("slot" + i).appendTo("#radiant tbody")
        $( "#dire .slot0" ).clone().removeClass().addClass("slot" + i).appendTo("#dire tbody")
    }
}


function update_end_screen(game) {
    console.log(game)
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

    // set match id text
    d3.select("#match_id .text").text(game.match_id)

    // set game mode text
    d3.select("#game_mode .text").text(d2.getGameMode(game.game_mode))

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
    console.log(players)
    console.log(players[0])

    var rows = d3.selectAll("tbody tr").data(players);

    // propagate data binding to children 
    rows.selectAll("td").data(function(row) {
        return d3.range(12).map(function(column, i) {
                     return row;
                });
    });

    rows.selectAll("tbody td").html(function(d) {
        this_cell = d3.select(this)
        if (this_cell.attr("class") == "player_name") {
            var name_text = (d.account_id == 4294967295) ? "Private account" : (d.account_id == user_data.id32) ? user_data.user : d.account_id
            return name_text
        } else if (this_cell.attr("class") == "items") {
            var item_string = "";
            d.items.map(function(d) {
                item_string = item_string + "<img class='end_screen_item_pic' src='" + d2.getItemInfo(d).img + "' alt='" + d2.getItemInfo(d).dname + "' height='36px' width='48px'>"
            })
            return item_string
        } else if (this_cell.attr("class") == "hero") {
            var hero = d2.getHeroInfo(d.hero_id)
            var hero_name = "<img src='" + hero.img + "' height='36px'> " + hero.dname
            return hero_name
        } else {
            return d[this_cell.attr("class")]
        }
    })
}