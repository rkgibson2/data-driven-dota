Data-Driven-Dota: A Dota 2 Statistical Exploration
=====================

### Angela Fan, Robbie Gibson, Benjy Levin

All the code in the css, html, and js folders was mainly written by us.
There are some code snippets taken from other places, but those are all cited in comments.
We, of course, used the d3 library, as well as jQuery, Bootstrap, and intro.js.
We also wrote our own d2 "library" which contained many functions that we wrote for loading and accessing our data.

All the permissions for the images we used are found in the img/permssions folder.

#### Overview of the files:

* `graph_functions.html`:
This file contains the base html for our page.
It sets up the overall layout, which is then dynamically altered with d3 and jQuery to display data.

* `graph_functions.js`: 
This is the main code for drawing all the graphs, and, really, initializing the page.
At the top, all the svgs for the different graphs are added, and then all the functions for drawing and updating each graph are defined.
This file also contains the initialization code for loading the data and actually calling the draw and update functions.

* `user.js`:
This sets up the dropdown used for switching datasets.
It adds the dropdown and binds the required handlers to actually load data.

* `end_screen.js`: 
This code builds the end screen popup for displaying detailed results for a single game.
It contains functions to create and update the end screen, which are called within the file, and functions to be used outside the file to update the end screen and make it enter the page and then to exit it.

* `selectors.js`:
This file builds the table of heroes in the Filter by Heroes popup and contains the code that actually does the filtering.

* `timeline.js`:
This is where the timeline is built.
It also contains the code for brushing over the timeline, and for updating it on a larger filter.

* `game_mode.js`:
This contains code for filtering and tracking the current state of the game mode filter.

* `lobbies.js`:
Similarly to the previous file, this contains the code that filters and tracks the lobby filter.

* `records.js`:
This code loops through the data set to find each of the records and then updates the corresponding divs to show the record values.

* `colorblind.js`:
This code is the click handler for the colorblind mode checkbox.
When the box is checked, it dynamically loads a new css file which supersedes the original one and replaces the necessary properties with colorblind frendly ones.
When the box is unchecked, that css is removed from the page, which means everything goes back to normal.
Furthermore, each of the update graph functions also checks the state of the checkbox, and updates its color accordingly.

* `introscript.js`:
This is the script for the intro.js introductory text.

The css files are all similarly named.
`main.css` contains most of the css, with the other files containing whatever they say.

#### Graphs:

* **Win-Loss Percentage**:
Win-loss percentage for current selected data 

* **Heroes Played**: 
Heroes you’ve played grouped by their primary attribute---agility, intelligence, or strength---and ordered by the number of games in which you’ve played them.
This graph is colored by primary attribute. 

* **Heroes Played Together Most Often**: 
This graph shows which heroes have appeared together on the same team most frequently.
Heroes are represented as arcs on the circumference of the circle, colored by primary attribute, and are linked by chords.
These chords represent the number of games in which both heroes appeared on the same team.
This graph is filterable to set a lower bound on the number of games in which the heroes appeared together, on the same team. 

* **Items Purchased as Percentage of Games Played**: 
Percentage of games in which you ended the game with a given item. Bars are colored by win rate with that item---gray if the win rate is around 50%, red if win rate is low, and green if win rate is high.
Sorting can be conducted by percentage, alphabetically by item name, and item cost (dropped items, such as Aegis and Cheese, sort as infinite cost). 

* **GPM Statistics**:
Scatterplot of GPM of hero for a given game against average GPM while playing that hero.
Games falling above the line indicate that GPM this game was higher than average, while games falling below the line indicate that GPM this game was lower than average.
Games are colored by win/loss. 

* **XPM Statistics**: Scatterplot of XPM of hero for a given game against average XPM while playing that hero.
Games falling above the line indicate that XPM this game was higher than average, while games falling below the line indicate that GPM this game was lower than average.
Games are colored by win/loss. 

* **Users Played with More than Once**:
Bubble graph, where bubbles are sized by number of games played together.
Users played with only once are not shown.
Users can be colored in two ways: by number of games played with you, or by your winrate playing with them.
Clicking on the user bubble takes you to their Steam homepage. 

#### Useful Links: 

* Our website can be found here: [http://d2dota.com/](http://d2dota.com/)

* Our video is hosted on YouTube: [https://www.youtube.com/watch?v=dqEPDAj5nlc](https://www.youtube.com/watch?v=dqEPDAj5nlc)
