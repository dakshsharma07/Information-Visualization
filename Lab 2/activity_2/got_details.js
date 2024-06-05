// DOM #main div element
var main = document.getElementById('main');

characters = [{
	 "name": "Bran Stark",
	 "status": "Alive",
	 "current_location": "Fleeing White Walkers",
	 "power_ranking": 7,
	 "house": "stark",
	 "probability_of_survival": 98
},
{
	 "name": "Arya Stark",
	 "status": "Alive",
	 "current_location": "Back in Westeros",
	 "power_ranking": 8,
	 "house": "stark",
	 "probability_of_survival": 99
},
{
	 "name": "Sansa Stark",
	 "status": "Alive",
	 "current_location": "Winterfell",
	 "power_ranking": 10,
	 "house": "stark",
	 "probability_of_survival": 83
},
{
	 "name": "Robb Stark",
	 "status": "Dead - Red Wedding S3E9",
	 "current_location": "-",
	 "power_ranking": -1,
	 "house": "stark",
	 "probability_of_survival": 0
}]

console.log(characters);

// Implementation of the function
function halfSurvival(characters) {
	for (var i = 0; i < characters.length; i++) {
		if (characters[i].name == "Arya Stark") {
			characters[i].probability_of_survival /= 1;
		} else {
			characters[i].probability_of_survival /= 2;
		}
	}
}

halfSurvival(characters);

function debugCharacters(characters) {
	for (var i = 0; i < characters.length; i++) {
		console.log(characters[i].name + " : " + characters[i].probability_of_survival);
	}
}

debugCharacters(characters);
function displayCharacters (characters) {
	for (var i = 0; i < characters.length; i++) {
		var main = document.getElementById("main");

		var name = document.createElement("div");
		var house = document.createElement("div");
		var survival = document.createElement("div");
		var status = document.createElement("div");

		main.appendChild(name);
		main.appendChild(house);
		main.appendChild(survival);
		main.appendChild(status);

		name.textContent = "Name: " + characters[i].name;
		house.textContent = "House: " + characters[i].house;
		survival.textContent = "Probability of survival: " + characters[i].probability_of_survival + "%";
		status.textContent = "Status: " + characters[i].status;
	} 
}

displayCharacters(characters);



