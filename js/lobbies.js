all_lobby_modes =  ["public","practice","tournament","tutorial","co_op_bot","team_match","solo_queue","ranked"];
selected_lobby_modes = ["public","practice","tournament","tutorial","co_op_bot","team_match","solo_queue","ranked"];
select_lobby_color ="#E8CE38";
function changeLobbyColor(gamemode){ 
    if (selected_lobby_modes.indexOf(gamemode)<0)
    {
          document.getElementById(gamemode).style.background = select_lobby_color;
          selected_lobby_modes.push(gamemode);
          tripleFilterUpdate();

    }
    else
    {
        var index = selected_lobby_modes.indexOf(gamemode);
        selected_lobby_modes.splice(index,1);
        document.getElementById(gamemode).style.background = "grey";
        tripleFilterUpdate();
    }
}

function resetLobby()
{
all_lobby_modes.forEach(function(d){
if (selected_lobby_modes.indexOf(d)<0)
    {
        document.getElementById(d).style.background = select_lobby_color;
        selected_lobby_modes.push(d);
    }
});
}
