// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = require('./appID').APPID;

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var http = require('http');
var request = require('request')

var url = "http://cocktails.wikia.com/api/v1/"
var searchUrl = url + "Search/List?query=";
var articleUrl = url + "Articles/AsSimpleJson?id="
var speechOptions = ["Then", "Next", "After"];




/**
 * BarTender is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var BarTender = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BarTender.prototype = Object.create(AlexaSkill.prototype);

BarTender.prototype.constructor = BarTender;

BarTender.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("BarTender onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
// any initialization logic goes here
};
    

BarTender.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BarTender onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the bar encyclopedia. Ask me what ingredients you need to make a certain drink, or the steps on how to make it!";

    response.ask(speechOutput);
};

BarTender.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("BarTender onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

BarTender.prototype.intentHandlers = {
    // register custom intent handlers
    BarTenderIntent: function (intent, session, response) {
        handleAllData(intent, session, response);
     },
     BarTenderIngredient: function (intent, session, response) {
        handleGetIngredients(intent,session,response);
    },
    BarTenderDirections: function (intent, session, response) {
        handleGetInstructions(intent, session, response);
    },
    FinishIntent: function(intent, session, response) {
        handleWrapupEventRequest(intent,session,response);
    },
    
    HelpIntent: function (intent, session, response) {
        response.ask("You can ask me how to make a drink!");
    }
};
// handler for getting everything
function handleAllData(intent, session, response) {
    var search = searchUrl + encodeURIComponent(intent.slots.Drink.value);
    searchAndGetArticle(search, getAllData, session, response);
}

// handler for getting ingredient data
function handleGetIngredients(intent, session, response) {
    var search = searchUrl + encodeURIComponent(intent.slots.Drink.value);
    searchAndGetArticle(search, getIngredientData, session, response);
}

// handler for getting instructional data
function handleGetInstructions(intent, session, response) {
    var search = searchUrl + encodeURIComponent(intent.slots.Drink.value);
    searchAndGetArticle(search, getInstructionData, session, response);
}

function getIngredientData(body, session, response) {
    var name = body.sections[0].title + ".";
    
    var speechIngredients = getIngredients(body);
    console.log(speechIngredients);
    
    response.tellWithCard(name + speechIngredients , "bartender", name + speechIngredients);
}

function getInstructionData(body, session, response) {
    var name = body.sections[0].title + ".";
    
    var speechDirections = getDirections(body);
    console.log(speechDirections);
    
    response.tellWithCard(name  + speechDirections, "bartender", name + speechDirections);
}

// gets the ingredients AND the steps to make the drink
function getAllData(body, session, response) {
    var name = body.sections[0].title + ".";
    
    var speechIngredients = getIngredients(body);
    console.log(speechIngredients);
    var speechDirections = getDirections(body);
    console.log(speechDirections);
    
    response.tellWithCard(name + speechIngredients + speechDirections, "bartender", name + speechIngredients + speechDirections);
}

// performs a search for the drink article and returns the body of the article in  json format
// parameters: 
// search - search url that includes the keyword(s) we are looking for
// fn - the callback function that runs once we have obtained the article
// session - session object of the current context
// response - alexaSkills object where we can write the response 
function searchAndGetArticle(search, callback, session, response) {
    request({url: search, json: true}, function (error, returnValue, body) {
        var id = body.items[0].id;
        console.log(id);
        var article = articleUrl + id;
        console.log(article);
        // then, make a request to the article
        request({url: article, json: true}, function(error, returnValue, body) {
            //kinda hacky, but we need a callback in an async call.
            callback(body, session, response);
        });
    }); 
}

// parses out the ingredients part of the json body
// parameters:
// body - json representation of an article body
function getIngredients(body) {
    var ingredients = body.sections[1].content[0].elements;
    var speechIngredients = "";
    console.log(ingredients);
    for (i = 0; i < ingredients.length; i++ ){
        speechIngredients += "\n " + ingredients[i].text + ",";
    }
    speechIngredients = speechIngredients.substring(0, speechIngredients.length -1) + ". ";
    return speechIngredients;
}

// parses out the direction part of the json body
// parameters:
// body - json representation of an article body
function getDirections(body) {
    var directions = body.sections[2].content[0].elements;
    var speechDirections = "";
    for (i = 0; i < directions.length; i++ ){
        if (i == 0) {
            speechDirections += "First, ";
        }
        else if (i == (directions.length-1) ) {
            speechDirections += "\nFinally,";
        }
        else {
            // add in some natural language
            speechDirections += "\n" + speechOptions[i%speechOptions.length] +", ";
        }
        speechDirections += " " + directions[i].text + ". ";
    }
    return speechDirections;
}

function handleWrapupEventRequest(intent, session, response) {
    response.tell("Goodbye!");
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the BarTender skill.
    var barTender = new BarTender();
    barTender.execute(event, context);
};

