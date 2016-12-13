# Alexa Bartender #

This project is my personal attempt at creating a bartender application for Alexa.
It uses the Alexa Skills Kit and Amazon Lambda

## How do I get set up? ##

* If you are unfamiliar with Alexa Skills, check out Amazon's [getting started guide](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide)
* After creating an Alexa Skill, add the text from [here](IntentSchema.json) to your intent schema
* Add the text from [Sample Utterances](SampleUtterances.txt) to the Sample utterances
* run `npm install request` under the src/ directory
* modify appID.js to contain your Alexa Skill ID
* cd into the src directory, and zip up all the contents.
* upload zip to Amazon Lambda

## How do I use this? ##
Ask "What's in ${drinkName}?" to get a list of ingredients in the drink  
Ask "How do I make ${drinkName}?" to get a set of instructions on making the drink  
Ask "What is ${drinkName}?" to get a list of ingredients and the instructions on making the drink.  
Checkout the [Sample Utterances file](SampleUtterances.txt) to see other ways to invoke this skill  

# License #
Licensed under the [Don't Be A Dick](LICENSE.md) public license
