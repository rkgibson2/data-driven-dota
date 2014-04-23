users = ["angela","aui_2000","benjy","david","dendi","merlini", "robbie"];

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
    .attr("value", function(d){ return d })
    .text(function(d){ return capitalizeFirstLetter(d) });

// from http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// set default value to robbie (ME!!)
d3.select("[value=robbie]").property("selected", true)
