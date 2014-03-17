CS 171 Final Project Proposal
=============================

### Robbie Gibson, Angela Fan, Benjy Levin

* **Background and Motivation:**
	Discuss your motivations and reasons for choosing this project, especially any background or research interests that may have influenced your decision.

	**Angela**: I don't play much Dota2 but I do watch. 
Plus I'm friends with Robbie and Benjy who both play.

	**Robbie**: I really like playing Dota, and I think that there are a bunch of cool statistics that could be made into a visualization. 
Furthermore, I think that there aren't too many stat projects out there, so there is a large space to fill.

	**Benjy**: I have always been interested in MOBA-genre games such as War3: Frozen Throne Dota, LoL, HoN, and finally Dota 2. 
Although there are a few resources online that display user statistics, I believe that there is no such resource that enables a full, interactive exploration into a user's game history. 
I am extremely interested in learning more about my playing style, habits and trends through this project.

	* State-of-the-art
	
	Currently, users can track their basic match history through tools inside of the game client, but this contains very limited information, and it is extremely slow to go through match history. 
The most popular online tool for user statistic analysis is [Dotabuff](http://dotabuff.com/), which operates more like a business than a community run tool and is supported by a team of software engineers.
For many of the premium statistic features, users are required to pay a monthly fee.
Dotabuff does not provide users with the functionality to brush over a selection of their match history and display in-depth stats about this selection.
Dotabuff also displays all information in a tabular format, and lacks visual and interactive components.


* **Project Objectives:**
	Provide the primary questions you are trying to answer with your visualization.
	What would you like to learn and accomplish?
	List the benefits.

	We really want to let a user examine their game history.
They can visualize summary statistics for a set of games, so they can see patterns in their play and possibly ways to improve.
Also, we want to allow users to filter their games to only examine a subset of games (e.g. only games where they lost).

	One big thing we want to learn is how to filter and transition well in a visualization.
We'll have a lot of smaller visualizations and then a couple filters.
Then, when you change the filters, all the visualizations have to change as well, hopefully with nice transitions.

* **Data:** 
	From where and how are you collecting your data? If appropriate, provide a link to your data sources.

	The company that develops Dota2, Valve, has an [API](http://dev.dota2.com/showthread.php?t=47115).
Through the API, we can individually query each game that we want data for.

* **Data Processing:**
	Do you expect to do substantial data cleanup?
	What quantities do you plan to derive from your data? How will data processing be implemented?

	The API calls return JSON data in an easily understandable format.
However, we also have to aggregate all a given user's games, so that would require processing and many API calls (~1000).
It seems somewhat difficult to dynamically call the API (it has rate limits), so we were planning on constructing a test data set of 10 users to use for the purposes of our visualization.

	We want to get a variety of users:

	1. Standard casual player: 
	a few hundred to a few thousand games mainly playing a small-medium number of heroes

	1. Professional Dota 2 player

	1. Casual players who play mostly one hero

	1. Casual players who haven't played very often
	
	1. Casual players who play a diversity of heroes

	We'd also have to get the correct icons for everything so it matches the actual icons from the game.

* **Visualization:**
	How will you display your data?
	Provide some general ideas that you have for the visualization design.
	Include sketches of your design.

	Please see included sketch. 
Our visualization will include multiple selection and filtering tools to control what data is being displayed in the accompanying graphs, and summary statistics.

* **Must-Have Features:**
	These are features without which you would consider your project to be a failure.

	1. We want to recreate the end-game summary screen if a user clicks on an single game, showing:
	
		* all ten people and the hero they chose to play
		* game statistics for each person:
		how many kills, how many deaths, how many assists, what items you ended the game with, gold per minute, experience per minute, etc.
		* hero skill builds for each person (how the player leveled up their hero's skills)

	1. We want to build a timeline where each game the user has played shows up. Users should be able to select a game to bring up the end-game screen (see point 1 above).

	1. The timeline should be brushable so users can select a range of time to view games. 

	1. We want to develop an aggregated statistics screen, with the data only from the games the user is currently viewing (based on their timeline brush). The statistics would show win/loss as well as other summary statistics.

* **Optional Features:**
	Those features which you consider would be nice to have, but not critical.

	1. When you hover over the win/loss bar, filter the data screen to only show statistics from won games or lost games for the given selection.
	
	1. Implement a filtering system so users can filter by:
		
		* individual or multiple heroes
		
		* type of match

	1. For each user's brushed time period, show which other players the user has played with and played against.

	1. For each user's brushed time period, show which heroes the user has played the most with. 

* **Project Schedule:**
	Make sure that you plan your work so that you can avoid a big rush right before the final project deadline, and delegate different modules and responsibilities among your team members.
	Write this in terms of weekly deadlines.

	* **Start time 0**

	* **1 week:**

		* Get data for our set of users: *Robbie* 

		* Get picture icon data: *Angela* 

		* Build dict(?) to convert API integers into item names, hero names, etc.: *Benjy*

	* **2 weeks:**

		* Manipulate data into correct format: *Robbie*, *Benjy*, *Angela*

	* **3 weeks:**

		* Endgame screen and hero builds (tooltip?): *Robbie*

		* Begin stats:
		
			* Win/loss: *Angela*
			
			* Hero pie chart: *Angela*
			
			* Endgame item percentage bar graph: *Angela*
	
		* Create selector grid: *Benjy*

	* **4 weeks, by *APRIL 10TH* for functional prototype:**

		* Create timeline, individual games brought up by clicking, work on brushing, continue working on selector grid: *Benjy*

		* Implement basic selector: *Robbie*

		* Chord diagrams and sunburst statistics graphs: *Angela*
	
		* Average normalized XPM/GPM line graphs: *Angela*

		* Records: *Angela*

	* **5 weeks, with TF feedback on *APRIL 14TH*:**

		* Process book start: *Angela*

		* Continue statistics graphs: *Angela*

		* Selector implementation: *Robbie*, *Benjy*

		* Fixes based on TF comments: *Robbie*, *Benjy*

	* **6 weeks:**

		* Project website: *Robbie*, *Benjy*, *Angela*

		* Continue selector work: *Robbie*, *Benjy* 

		* Process book: *Angela*

		* Screencast work: *Robbie*, *Benjy*, *Angela*

		* Intro JS: *Angela*