all_modes =  ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
selected_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
update_selected_modes = ["AD", "AR", "CD", "CM", "RD", "LH", "LP", "SD", "AP"];
select_color ="#E8CE38";
function changeColor(gamemode){ 
    if (update_selected_modes.indexOf(gamemode)<0)
    {
          document.getElementById(gamemode).style.background = select_color;
          update_selected_modes.push(gamemode);
          //tripleFilterUpdate();

    }
    else
    {
        var index = update_selected_modes.indexOf(gamemode);
        update_selected_modes.splice(index,1);
        document.getElementById(gamemode).style.background = "grey";
        //tripleFilterUpdate();
    }
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

function reselectGameMode(){
    update_selected_modes = selected_modes.slice();
    // first reset selection to all unselected
    all_modes.forEach(function(d){
        document.getElementById(d).style.background = "grey";
        });
    // then select previous selection
    selected_modes.forEach(function(d){
        document.getElementById(d).style.background = select_color;
    });
};
