var restify = require('restify');
var builder = require('botbuilder');
var funcs = require('./funcs.js');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create  bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
    session.send("Hi I'm Government of India Bot!");
    builder.Prompts.choice(session, "Do You Have Aadhar ? ", 'Yes|No');
    },
    function (session, results) {
            switch (results.response.index) {
                case 0:
                    session.beginDialog('/haveAadhar');
                    break;
                case 1:
                    session.beginDialog('/noAadhar');
                    break;
                default:
                    session.endDialog();
                    break;
            }
    }
]);

bot.dialog('/haveAadhar',[
    function(session){
    builder.Prompts.number(session, "Your Aadhar Number ? ");
    
    },
    function(session,results){
        if(results.response){
            var result = results.response;
            var ifValid = funcs.checkValidityAadhar(result);
            if(ifValid == true){
                session.beginDialog("/menu");
            }
            else{
                session.send("Please recheck the format of the aadhar number.");
            }
        }
        
        session.endDialog();
        
    }
    
]);

bot.dialog('/noAadhar',function(session){
    session.send("Oh Snap Probably You  should register");
    session.endDialog();
});

bot.dialog('/menu',[
    function(session){
        builder.Prompts.choice(session, "Services:", 'PAN|Income Certifiate|VotersId|Residency Certificate');
    },
    function(session,results){
        switch (results.response.index) {
                case 0:
                    //session.beginDialog('/PAN');
                    break;
                case 1:
                    session.beginDialog('/incomeCertificate');
                    break;
                case 2:
                    //session.beginDialog('/VotersId');
                    break;
                default:
                    session.endDialog();
                    break;
            }
    }
]);

bot.beginDialog('/incomeCertificate',[
    function(session){
           
    }
]);