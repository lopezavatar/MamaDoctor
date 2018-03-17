'use strict'

process.env.DEBUG = 'actions-on-google:*';
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const Actions = require('./assistant-actions');
const Conversation = require('./conversation.js');
const firebase = require('firebase');

firebase.initializeApp(functions.config().firebase);

exports.MamaDoctor = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    //Initialise app dependencies
    const dialogflowApp = new DialogflowApp({request, response});
    const conversation = new Conversation(dialogflowApp);

    //Define map of Dialogflow agent Intents
    let actionMap = new Map();
	actionMap.set(Actions.ACTION_SICKNESS, () => conversation.TellSuggestion());

    //Handle request from Dialogflow (will be dispatched into appropriate action defined above)
    dialogflowApp.handleRequest(actionMap);
});