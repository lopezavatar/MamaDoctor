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
		sick = sick.toLowerCase();

        const option = getUserAnsweredQuestOption(sick, questData.allergy);
		
		const product = this.dialogflowApp.buildRichResponse();
		
		product.addBasicCard(this.dialogflowApp.buildBasicCard(option.value.Summary)
		.setTitle("Home Remedies for "+option.value.Name)
		.addButton('Read more', option.value.Link)
		.setImage(option.value.LinkImage, 'Image alternate text')
		.setImageDisplay('CROPPED')
		)
		
		option.value.Steps.forEach(function(step){
			product.addSimpleResponse({speech: step})
        });
		
		option.value.Products.forEach(function(element){
			product.addSuggestionLink(" To Buy " + element, "https://www.walmart.com/search/?query="+element)
		});
		
		
		this.dialogflowApp.ask(
		    product
		);
	}
}

module.exports = Conversation;