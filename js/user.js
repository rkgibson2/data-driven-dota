users = [{username : "anarfish", realname : "angela"},
         {username : "C9 Aui_2000", realname : "aui_2000"},
         {username : "Benjy", realname : "benjy"},
         {username : "King of Sealand", realname : "david"},
         {username : "Na`Vi.Dendi", realname : "dendi"},
         {username : "Merlini", realname : "merlini"},
         {username : "Darth Windu", realname : "robbie"}];

users.sort(function(a, b) {
    return d3.ascending(a.username.toLowerCase(), b.username.toLowerCase())
})

d3.select("#selectuser")
    .append("select")
    .attr("id","userdropdown")
    .attr("class", "form-control")
    .on("change", function() {
        loadData(d3.select("#userdropdown").node().value)
    })
    .selectAll("option")
    .data(users)
    .enter().append("option")
    .attr("value", function(d){ return d.realname })
    .text(function(d){ return d.username });

// set default value to robbie (ME!!)
d3.select("[value=robbie]").property("selected", true)