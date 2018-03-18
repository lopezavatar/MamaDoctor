const rp = require('request-promise');
const cheerio = require('cheerio');
const getUserAnsweredQuestOption = require('./getUserAnsweredQuestOption');
const questData = require('./data/questData');

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

        const option = getUserAnsweredQuestOption(sick, questData.allergy);


		
		const options = {
			uri: "https://www.homeremediesweb.com/"+sick+"_home_remedy.php",
			transform: function (body) {
				return cheerio.load(body);
			}
		};
		
		rp(options)
		.then(($) => {
			
			const product = this.dialogflowApp.buildRichResponse();

			product.addBasicCard(this.dialogflowApp.buildBasicCard(option.value.Summary)
			.setTitle(option.value.Name)
			.addButton('Read more', option.value.Link)
			.setImage(option.value.LinkImage, 'Image alternate text')
			.setImageDisplay('CROPPED')
			)

            option.value.Steps.forEach(function(step){
                product.addSimpleResponse({speech: step,
                    displayText: ''})
            });

			$('.entry-content h3').each(function() {
				if($(this).text().includes("Home"))
					remedies.push($(this).text());
			});

            option.value.Products.forEach(function(element){
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