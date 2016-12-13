# Alexa Bartender #

This project is my personal attempt at creating a bartender application for Alexa.
It uses the Alexa Skills Kit and Amazon Lambda

## How do I get set up? ##

* After creating an Alexa Skill, add the text in *intent schema.json* to your intent schema
* Add the text in *Sample Utterances.txt* to the Sample utterances
* run `npm install request` under the src/ directory
* modify appID.js to contain your Alexa Skill ID
* cd into the src directory, and zip up all the contents.
* upload zip to Amazon Lambda

## How do I use this? ##
Checkout the [Sample Utterances file](src/Sample Utterances.txt) to see how you can invoke this skill
