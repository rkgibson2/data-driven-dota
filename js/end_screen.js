var user_data;

var this_game;

d2.loadUserData("angela", function(error, data) {
    user_data = data;

    update_end_screen(user_data.matches[12])
})


function update_end_screen(game) {
    console.log(game)
    this_game = game;

    // set winner
    d3.select("#winner").text(((game.radiant_victory) ? "Radiant" : "Dire") + " Victory")

    // set match id text
    d3.select("#match_id .text").text(game.match_id)

    // set game mode text
    d3.select("#game_mode .text").text(d2.getGameMode(game.game_mode))

    // game.start_time is in seconds since UNIX Epoch, but d3 new Date needs milliseconds   
    var start = new Date(game.start_time * 1000)
    var date_string = d3.time.format("%a %b %-d, %Y %X %Z")
    d3.select("#date .text").text(date_string(start))

    // convert duration (in seconds) to hours + seconds
    var hours = Math.floor(game.duration / 60);
    var seconds = game.duration % 60;

    d3.select("#duration .text").text(hours + ":" + seconds)

    // rename this array for convenience
    var players = game.players
    console.log(players)
    console.log(players[0])

    // add info for each player
    for (var i = 0; i < players.length; i++) {
        var cur_player = players[i]
        player_side = (cur_player.player_slot & 0x80) ? "dire" : "radiant"
        player_slot = cur_player.player_slot & 0x7
        
        var row = d3.select("#" + player_side + " .slot" + player_slot)

        // update player name
        var name_text = (cur_player.account_id == 4294967295) ? "Private account" : (cur_player.account_id == user_data.id32) ? user_data.user : cur_player.account_id
        row.select(".player_name").text(name_text)

        // update level
        row.select(".level").text(cur_player.level)

        // update hero name
        var hero = d2.getHeroInfo(cur_player.hero_id)
        var hero_name = "<img src='" + hero.img + "' height='36px'> " + hero.dname
        row.select(".hero").html(hero_name)

        // update kills
        row.select(".kills").text(cur_player.kills)

        // update deaths
        row.select(".deaths").text(cur_player.deaths)

        // update assists
        row.select(".assists").text(cur_player.assists)


        // update items
        row.select(".item0").html("<img src='" + d2.getItemInfo(cur_player.item_0).img + "' height='36'px width='48px'>")
        row.select(".item1").html("<img src='" + d2.getItemInfo(cur_player.item_1).img + "' height='36'px width='48px'>")
        row.select(".item2").html("<img src='" + d2.getItemInfo(cur_player.item_2).img + "' height='36'px width='48px'>")
        row.select(".item3").html("<img src='" + d2.getItemInfo(cur_player.item_3).img + "' height='36'px width='48px'>")
        row.select(".item4").html("<img src='" + d2.getItemInfo(cur_player.item_4).img + "' height='36'px width='48px'>")
        row.select(".item5").html("<img src='" + d2.getItemInfo(cur_player.item_5).img + "' height='36'px width='48px'>")

        // update gold
        row.select("td:nth-child(13)").text(cur_player.gold)

        // update last hitss
        row.select("td:nth-child(14)").text(cur_player.last_hits)

        // update denies
        row.select("td:nth-child(15)").text(cur_player.denies)

        // update gpm
        row.select("td:nth-child(16)").text(cur_player.gold_per_min)

        // update xpm
        row.select("td:nth-child(17)").text(cur_player.xp_per_min)
    }
}