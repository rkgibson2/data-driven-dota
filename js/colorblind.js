 function changeCSS() {
        // check value of check box
        var isChecked = $("#color-blind").is(":checked");
        var cssFile;
        // if it is checked, assign colorblind.css file otherwise main.css
        isChecked ? cssFile = "colorblind.css" : cssFile = "main.css";
        
        // this gets the old css link file
        var oldlink = document.getElementsByTagName("link").item(2);
        
        // we dynamically generate a new css link 
        // element with desired name = to desired style sheet
        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", "/css/" +cssFile);
        
        // we replace the old link element in the page header with the new link element
        document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

