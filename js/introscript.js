  var introguide = introJs();  

introguide.setOptions({  
    steps: [  
        {  
          element: '#corner-logo',  
          intro: 'Welcome to Data Driven Dota!<br><br>Use the arrow keys for navigation or hit ESC to exit the tour immediately.',  
          position: 'bottom'  
        },
        {  
          element: '#userdropdown',  
          intro: "Here you can select who's games you would like to view.",  
          position: 'bottom'  
        },  
        {  
          element: '#filterbutton',  
          intro: 'Click here to open up the hero filter.',  
          position: 'bottom'  
        },  
        {  
          element: '#filterbutton_game_mode',  
          intro: 'Click here to open up the game type filter.',  
          position: 'bottom'  
        },  
        {  
          element: '#timeline',  
          intro: "This is a brushable timeline to select a range of games by date. You can also click on any dot to show more info about that game!",  
          position: 'bottom'  
        },  
        {  
          element: '#color-blind',  
          intro: "Color-blind? No problem! Click here to toggle on color-blind friendly colors!",  
          position: 'left'  
        },  
        {  
          element: '#record_content',  
          intro: "These are your records for the current filtered and brushed selection. Cool hey!?",  
          position: 'left'  
        }
    ]  
});  

 
