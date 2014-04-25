//Benjy Levin
//Robbie Gibson

var d2 = (function() {

    var heroData = [];
    var itemData = [];
    var abilityData =[];
    var gameModes = [];
    var lobbyModes = [];
    var userData = [];


    function loadJSON(callback) {
        // if no callback was passed, make function that does nothing
        if (callback === undefined)
            callback = function() {}
        var remaining = 6;

        d3.json("data/heroes.json", function (error, data)
        {            // an array of all the hero names indexed appropriately - starting at 1
            heroData = data;

            if (!--remaining) callback();

        });

        d3.json("data/abilities.json", function (error, data) {
            abilityData = data;

            if (!--remaining) callback();
        });

        d3.json("data/items.json", function (error, data)
        {
           // an array of all the hero names indexed appropriately - starting at 1
           itemData = data;

           if (!--remaining) callback();
        });

        d3.json("data/game_modes.json", function (error, data) {
            // array of all the game modes
            gameModes = data;

            if (!--remaining) callback();
        })

 	d3.json("data/lobbies.json", function (error, data) {
            // array of all the lobby modes
            lobbyModes = data;

            if (!--remaining) callback();
        })

        d3.json("data/username_data/angela_usernames.json", function(error, data) {
            // array of all usernames we've pulled
            userData = data;

            if (!--remaining) callback();
        })

    }


    // returns hero data for a given id
    function idToHeroInfo(id) {
        if (id in heroData)
            return heroData[id]
        else
            throw new Error ("No hero with id " + id)
    }

    // convenience method for getting name
    function idToHeroDisplayName(id)
    {
        return idToHeroInfo(id).dname;
    }

    function idToItemInfo(id) {
        if (id in itemData)
            return itemData[id]
        else
            throw new Error ("No item with id " + id)
    }

    function idToItemName(id)
    {
        return idToItemInfo(id).dname;
    }

    function idToAbilityInfo (id) {
        if (id in abilityData)
            return abilityData[id]
        else
            throw new Error ("No ability with id " + id)
    }

    function idToGameMode(id) {
        if (id in gameModes)
            return gameModes[id]
        else
            throw new Error ("No game mode with id " + id)
    }

   function idToLobby(id) {
        if (id in lobbyModes)
            return lobbyModes[id]
        else
            throw new Error ("No game mode with id " + id)
    }


    // returns user data for a given id
    function idToUserInfo(id) {
        if (id in userData)
            return userData[id][0]
        else
            throw new Error ("No user with account id " + id)
    }

    function getKeys (datatype) {
        switch (datatype.toLowerCase()) {
            case "heroes":
                return Object.keys(heroData);
                break;
            case "items":
                return Object.keys(itemData);
                break;
            case "abilities":
                return Object.keys(abilityData);
                break;
            case "game_modes":
                return Object.keys(gameModes);
                break;
            case "users":
                return Object.keys(userData);
                break;
            default:
                throw new Error ("datatype (you entered " + datatype + ") must be \'heroes,\" \"items,\" \"abilities,\" \"game_modes,\" or \"users.\"")
        }
    }

    // loads user data using d3.json
    // like d3.json, you need to provide a callback when you call this function.
    // The callback is used in the same way, with paramters error and data.
    // This function was written by Angela Fan !!! :)
    function loadUserData(username, callback) {
        username_lower = username.toLowerCase()

        if (username_lower != "robbie" && username_lower != "benjy" && 
            username_lower != "david" && username_lower != "dendi" && 
            username_lower != "aui_2000" && username_lower != "merlini" &&
            username_lower != "angela") {
            throw new Error ("No data currently for user " + username)
        }

        d3.json("data/" + username_lower + "_match_details.json", function(error, data) {
            // find the player data for our given player and pull it to the top level
            data.matches.forEach(function(d,i) {
                our_player = d.players.filter(function(e) {
                    return (e.account_id == data.id32)
                })

                //pull out player array
                d.player_info = our_player[0];

                //figure out if player was on radiant or dire
                if (d.player_info.player_slot & 0x80) {
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

            //player left game before s/he even picked a hero, get rid of these matches
            data.matches = data.matches.filter(function(d) {
                return (d.player_info.hero_id != 0);
            })

            callback(error, data);
        })
    }

    function displayHeroImg(heroname){
        d3.select("body").select(".heropicture").remove();

        d3.select("body").selectAll(".heropicture").data([heroname.toLowerCase().replace(/ /g,"_")])
        .enter().append('img')
        .attr('class', 'heropicture')
        .attr('src', function(d) { return "img/heroes/" +d+".jpg"; });
    };


    function displayItemImg(itemname){
        d3.select("body").select(".itempicture").remove();

        d3.select("body").selectAll(".itempicture").data([itemname])
        .enter().append('img')
        .attr('class', 'itempicture')
        .attr('src', function(d) { return "img/items/" +d+".jpg"; });
    };

    var pubFunctionList = "getHeroName(id): returns hero name from ID\n"
                            + "getItemName(id): returns item name from ID\n"
                            + "displayHeroImg(name): displays the image for hero 'name'\n"
                            + "displayItemImg(name): displays the image for item 'name'\n"

    return {
        getUserData: function() {return userData },

        loadJson: loadJSON,

        getAbilityData: function() {
            return abilityData
        },

        getHeroName: function(id) {
            return idToHeroDisplayName(id)
        },

        getHeroInfo: function(id) {
            return idToHeroInfo(id)
        },

        getHeroInfoCopy: function(id) {
            object = idToHeroInfo(id)
            return jQuery.extend(true, {}, object)
        },

        getItemName: function(id) {
            return idToItemName(id)
        },

        getItemInfo: function(id) {
            return idToItemInfo(id)
        },

        getItemInfoCopy: function(id) {
            object =  idToItemInfo(id)
            return jQuery.extend(true, {}, object)
        },

        getAbilityInfo: function(id) {
            return idToAbilityInfo(id);
        },

        getUserInfo: function(id) {
            return idToUserInfo(id);
        },

        getUserName: function(id) {
            return idToUserInfo(id).personaname;
        },

        getGameModeInfo: idToGameMode,

	getLobbyInfo: idToLobby,

        getKeys: getKeys,

        loadUserData: loadUserData,

        displayHeroImg: displayHeroImg,

        displayItemImg: displayItemImg,

        functionList: function() {
            console.log(pubFunctionList)
        },

        id64To32: function(id) {
            return id -76561197960265728
        },

        id32To64: function(id) {
            return id + 76561197960265728
        }

    }

})();
