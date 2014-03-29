//Benjy Levin
//Robbie Gibson

var d2 = (function() {

    var heroData = [];
    var itemData = [];

    function loadHeroJson()
    {
        d3.json("../data/heroes.json", function (error, data)
        {
    	   // an array of all the hero names indexed appropriately - starting at 1
    	   heroData = data;
        });
    };

    function loadItemJson()
    {
        d3.json("../data/items.json", function (error, data)
        {
    	   // an array of all the hero names indexed appropriately - starting at 1
    	   itemData = data;
        });
    };

    loadHeroJson();
    loadItemJson();


    // returns hero data for a given id
    function idToHeroInfo(id) {
        for (var i = 0; i < heroData.length; i++) {
            if (heroData[i].id == id)
                return heroData[i];
        }
        
        throw new Error ("No hero with id " + id)
    }

    // convenience method for getting name
    function idToHeroDisplayName(id)
    {
        return idToHeroInfo(id).dname;
    }

    function idToItemName(id, itemData)
    {
        for (var i = 0; i < itemData.length; i++)
        {
            if (itemData[i].id == id)
                return itemData[i].localized_name;
        }

        throw new Error ("No item with id " + id)
    }

    function displayHeroImg(heroname){
        d3.select("body").select(".heropicture").remove();

        d3.select("body").selectAll(".heropicture").data([heroname.toLowerCase().replace(/ /g,"_")])
        .enter().append('img')
        .attr('class', 'heropicture')
        .attr('src', function(d) { return "../img/heroes/" +d+".jpg"; });
    };


    function displayItemImg(itemname){
        d3.select("body").select(".itempicture").remove();

        d3.select("body").selectAll(".itempicture").data([itemname])
        .enter().append('img')
        .attr('class', 'itempicture')
        .attr('src', function(d) { return "../img/items/" +d+".jpg"; });
    };

    var pubFunctionList = "getHeroName(id): returns hero name from ID\n"
                            + "getItemName(id): returns item name from ID\n"
                            + "displayHeroImg(name): displays the image for hero 'name'\n"
                            + "displayItemImg(name): displays the image for item 'name'\n"

    return {
        getHeroData: function() {
            return heroData
        },

        getItemData: function() {
            return itemData
        },

        getHeroName: function(id) {
            return idToHeroDisplayName(id)
        },

        getHeroInfo: function(id) {
            return idToHeroInfo(id)
        },

        getItemName: function(id) {
            return idToItemName(id, itemData)
        },

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

//Angela Fan, Robbie Gibson
function load_user_data(username) {

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
            if (d.player_side == "radiant" && data.radiant_win == true) {
                d.player_win = true;
            }
            else {
                d.player_win = false;
            }

        })
    })
}
















