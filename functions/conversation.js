const rp = require('request-promise');
const cheerio = require('cheerio');

//List of the remedies for the user.
var remedies = [];

const ARG_SICKNESS = 'Sickness';

class Conversation {
	
	constructor(dialogflowApp) {
        this.dialogflowApp = dialogflowApp;
    }
	
	TellSuggestion()
	{	
	    let sick = this.dialogflowApp.getArgument(ARG_SICKNESS);
		var sickname = name;
		sick = sick.replace(" ", "_");
		sick = sick.toLowerCase();
		
		const options = {
			uri: "https://www.homeremediesweb.com/"+sick+"_home_remedy.php",
			transform: function (body) {
				return cheerio.load(body);
			}
		};
		
		rp(options)
		.then(($) => {
			
			const product = this.dialogflowApp.buildRichResponse();
					
			product.addBasicCard(this.dialogflowApp.buildBasicCard('42 is an even composite number. It' +
			'is composed of three distinct prime numbers multiplied together. It' +
			'has a total of eight divisors. 42 is an abundant number, because the' +
			'sum of its proper divisors 54 is greater than itself. To count from' +
			'1 to 42 would take you about twenty-one…')
			.setTitle("Home remedies for"+)
			.addButton('Read more', "https://www.homeremediesweb.com/"+sick+"_home_remedy.php")
			.setImage('https://example.google.com/42.png', 'Image alternate text')
			.setImageDisplay('CROPPED')
			)	
			
			product.addSimpleResponse({speech: 'What do you want to know about the recipe ' +
				"I can tell you information like if the recipe is gluten free, or if it's vegan or vegetarian ",
				displayText: 'Howdy! What would you like to know?'})
				
			$('.entry-content h3').each(function() {
				if($(this).text().includes("Home"))
					remedies.push($(this).text());
			});
			
			remedies.forEach(function(element){
				element = element.slice(element.search("Using"));
				element = element.replace("Using ", "");				
				
				product.addSuggestionLink(" To Buy " + element, "https://www.walmart.com/search/?query="+element)
			    console.log("https://www.walmart.com/search/?query="+element);
			});
			
			this.dialogflowApp.ask(
				product
			);
		})
		
		.catch((err) => {
			console.log(err);
		});
	}
}

module.exports = Conversation;