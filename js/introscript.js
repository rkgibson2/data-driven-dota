
var introguide = introJs();  

introguide.setOptions({ 
scrollToElement: true, 
showStepNumbers: false,
    steps: [  
        {  
          element: '#corner-logo',  
          intro: 'Welcome to Data Driven Dota!<br><br>Use the arrow keys for navigation or hit ESC to exit the walkthrough immediately.',  
          position: 'bottom'  
        },
        {  
          element: '#filters',  
          intro: "Filtering options- select which user's games you would like to view, filter by heroes and game type.",  
          position: 'bottom'  
        },
        {  
          element: '#color-blind',  
          intro: "Click to toggle for a more colorblind-friendly palette.",  
          position: 'left'  
        },
        {  
          element: '#page-header',  
          intro: "This timeline plots user games over time, split by hero primary attribute. Select a region on the timeline with your mouse to filter the data. Click on a game to bring up the endgame screen.",  
          position: 'bottom'  
        },  
        {  
          element: '#record_content',  
          intro: "These display user records, which change based on the filtered data. Clicking on a record will bring up the endgame screen for that game.",  
          position: 'top'  
        },
        {  
          element: '#hero_pie_container',  
          intro: "This digram splits heroes by primary attribute and sorts them by number of games played. Clicking on an arc will zoom in a level, and clicking the center will zoom out",
          position: 'right'  
        },
        {  
          element: '#item_percent_container',  
          intro: "This graph plots items, coloring each item by winrate. Click to sort either by number of times purchased, alphabetically, or by item cost.",  
          position: 'left'  
        },
        {  
          element: '#xpmgpm_container',  
          intro: "These graphs plot user's average performance on a hero (x-axis) against user's performance that game (y-axis). The 45-degree line represents average performance. Selecting a region with the mouse zooms the graph in. Clicking on a dot brings up the associated endgame screen. Mouse-ing over a dot highlights the accompanying dot on both graphs, as well as the game on the timeline filter.",  
          position: 'top'  
        },
        {  
          element: '#hero_chord_container',  
          intro: "This hero chord diagram tells you about which heroes are played together most frequently in the user dataset. Mouse-ing over a circle arc brings up the hero name. Mouse-ing over each chord brings up the two heroes and the number of games they have played together.",  
          position: 'right'  
        },
        {  
          element: '#user_interact_container',  
          intro: "This graph plots each other user the selected user has played with more than once. Circles are sized and colored by number of games played together. Click to toggle by winrate, which changes the colors to color the circles by winrate.",  
          position: 'left'  
        },
        {  
          element: '.question',  
          intro: "Thanks for taking the tour. We wish you all the best using our site! <br><br> More info is available at the click of this question mark!",
          position: 'left'  
        }
    ]  
});  

 
introguide.oncomplete(function()  
 {
    d3.select("#page-header").style("position","fixed");
  }


);

introguide.onexit(function() 
  {
    d3.select("#page-header").style("position","fixed");
  }

);

introguide.onafterchange(function(targetElement) {  
  if (targetElement.id == "color-blind")
  {
    d3.select("#page-header").style("position","fixed");
  }
});

introguide.onafterchange(function(targetElement) {  
  if (targetElement.class == "question")
  {
    d3.select("#page-header").style("position","absolute");
  }
});
