all_modes =  ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
selected_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
select_color ="#E8CE38";
function changeColor(gamemode){ 
    if (selected_modes.indexOf(gamemode)<0)
    {
          document.getElementById(gamemode).style.background = select_color;
          selected_modes.push(gamemode);
          updateFilteredSelectionByGameMode();

    }
    else
    {
        var index = selected_modes.indexOf(gamemode);
        selected_modes.splice(index,1);
        document.getElementById(gamemode).style.background = "grey";
        updateFilteredSelectionByGameMode();
    }
}

function updateFilteredSelectionByGameMode(){
    // selectors.js updates based on selected heroes in the grid
    // then updates by game modes chosen
    updateFilteredSelectionByHero();  
    filtered_data.matches = filtered_data.matches.filter(function(d){if(selected_modes.indexOf(d2.getGameModeInfo(d.game_mode).short_name) >= 0) return 1;});
    updateGraphs(filtered_data);
}

function resetGameMode()
{
all_modes.forEach(function(d){
if (selected_modes.indexOf(d)<0)
    {
        document.getElementById(d).style.background = select_color;
        selected_modes.push(d);
    }
});
}
