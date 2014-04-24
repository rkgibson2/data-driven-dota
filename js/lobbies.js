all_lobby_modes =  ["public","practice","tournament","tutorial","co_op_bot","team_match","solo_queue","ranked"];
init_lobby_modes = ["public","tournament","team_match","solo_queue","ranked"];
selected_lobby_modes = ["public","practice","tournament","tutorial","co_op_bot","team_match","solo_queue","ranked"];
update_selected_lobby_modes = ["public","practice","tournament","tutorial","co_op_bot","team_match","solo_queue","ranked"];
//select_lobby_color ="#E8CE38";
function changeLobbyColor(gamemode){ 
    if (update_selected_lobby_modes.indexOf(gamemode)<0)
    {
          document.getElementById(gamemode).style.border =  "2px solid red";
          update_selected_lobby_modes.push(gamemode);
          //tripleFilterUpdate();

    }
    else
    {
        var index = update_selected_lobby_modes.indexOf(gamemode);
        update_selected_lobby_modes.splice(index,1);
        document.getElementById(gamemode).style.border =  "2px solid white";
        //tripleFilterUpdate();
    }
}

function resetLobby()
{
all_lobby_modes.forEach(function(d){
if (selected_lobby_modes.indexOf(d)<0)
    {
        document.getElementById(d).style.border =  "2px solid red";
        selected_lobby_modes.push(d);
    }
});
}

function filterLobby(){
    //for game modes
    selected_modes = update_selected_modes.slice();
    // for lobby modes
    selected_lobby_modes = update_selected_lobby_modes.slice();
    tripleFilterUpdate();
}

function reselectLobby(){
    // reselect game mode function first
    reselectGameMode();
    update_selected_lobby_modes = selected_lobby_modes.slice();
    // first reset selection to all unselected
    all_lobby_modes.forEach(function(d){
        document.getElementById(d).style.border =  "2px solid white";
        });
    // then select previous selection
    selected_lobby_modes.forEach(function(d){
        document.getElementById(d).style.border =  "2px solid red";
    });
};

function initLobby(){
selected_lobby_modes = init_lobby_modes.slice();
}