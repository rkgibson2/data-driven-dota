
var introguide = introJs();  

introguide.setOptions({ 
scrollToElement: true, 
    steps: [  
        {  
          element: '#corner-logo',  
          intro: 'Welcome to Data Driven Dota!<br><br>Use the right arrow key for navigation or hit ESC to exit the tour immediately.',  
          position: 'bottom'  
        },
        {  
          element: '#filters',  
          intro: "Filtering options. Here you can select who's games you would like to view, filter by heroes or even by game type. Just click on the buttons for more options.",  
          position: 'bottom'  
        },
        {  
          element: '#color-blind',  
          intro: "Color-blind? No problem! Click here to toggle on color-blind friendly colors!",  
          position: 'left'  
        },
        {  
          element: '#page-header',  
          intro: "This filtering bar also contains a brushable timeline to select a range of games by date. You can also click on any dot to show more info about that game!",  
          position: 'bottom'  
        },  
        {  
          element: '#record_content',  
          intro: "These are your records for the current filtered and brushed selection. Cool hey!?<br>Clicking on any will bring up more details about that game.",  
          position: 'top'  
        },
        {  
          element: '#hero_pie_container',  
          intro: "This is your hero sunburst diagram. Use it to view heroes by primary attribute. You can click the center to go back a level!",  
          position: 'right'  
        },
        {  
          element: '#item_percent_container',  
          intro: "This is your item bar graph. Use it to view your successful item purchases for the filtered data selection.",  
          position: 'left'  
        },
        {  
          element: '#xpmgpm_container',  
          intro: "Woah! XPM and GPM graphs! Use them to find out how your performance varies for each hero. Click on any dota to bring up more info about that game. They are also brushable!",  
          position: 'top'  
        },
        {  
          element: '#hero_chord_container',  
          intro: "This hero chord diagram tells you about which heroes are played together most frequently on your team in your dataset. Mouseover any path for further details!",  
          position: 'right'  
        },
        {  
          element: '#user_interact_container',  
          intro: "Finally, this is your user bubble graph. It should help you decide which users you have the most success with, and who you should avoid playing with!",  
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
    d3.select("#page-header").style("position","fixed").style("z-index",999999);
  }


);

introguide.onexit(function() 
  {
    d3.select("#page-header").style("position","fixed").style("z-index",999999);
  }

);

introguide.onafterchange(function(targetElement) {  
  if (targetElement.id == "color-blind")
  {
    d3.select("#page-header").style("position","fixed").style("z-index",999999);
  }
});

introguide.onafterchange(function(targetElement) {  
  if (targetElement.class == "question")
  {
    d3.select("#page-header").style("position","absolute");
  }
});
