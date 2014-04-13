users = ["angela","aui_2000","benjy","david","dendi","merlini", "robbie"];

d3.select("#selectuser")
    .append("select").attr("id","userdropdown").on("change",function(){loadData( d3.select("#userdropdown")
    .node().value)}).selectAll("option")
    .data(users).enter().append("option")
    .attr("value", function(d){ return d})
    .text(function(d){ return d });

