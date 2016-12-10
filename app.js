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
        
        //session.endDialog();
        
    }
    
]);
bot.dialog("/menu",[
    function(session){
        builder.Prompts.choice(session, "The Things I can Provide:", 'Services|Policies That You Have');
    },
    function(session,results){
        switch (results.response.index) {
                case 0:
                    session.beginDialog('/menu-services');
                    break;
                case 1:
                    session.beginDialog('/menu-policies');
                    break;
                default:
                    session.endDialog();
                    break;
            }
    }
]
);

bot.dialog('/noAadhar',function(session){
    session.send("Oh Snap Probably You  should register");
    session.endDialog();
});

bot.dialog('/menu-services',[
    function(session){
        builder.Prompts.choice(session, "Services:", 'Birth Certificate|Income Certifiate|VotersId|Residency Certificate');
    },
    function(session,results){
        switch (results.response.index) {
                case 0:
                    session.beginDialog('/birthCertificate');
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

bot.dialog('/menu-policies',[
    function(session){
        builder.Prompts.choice(session, "Policies:", 'NAAM|SWAYAM');
    },
     function(session,results){
        switch (results.response.index) {
                case 0:
                    session.send("NAAM");
                    break;
                case 1:
                    session.send('SWAYAM');
                    break;
                default:
                    session.endDialog();
                    break;
            }
    }

]);

bot.dialog('/incomeCertificate',[
    function(session){
        session.send("Got your Details..I have submitted a request for Income Certificate..");
        session.send("I will notify You once it Arrives..Have Fun");

    }
]);

bot.dialog('/birthCertificate',[
    function(session,args,next){
        session.send("Congratulations.. Dear Father!");
        session.send("Let me Know More About Ur child!");
        next();
    },
    function(session){
        builder.Prompts.text(session,"What good name did you choose for your Child ! I'm exited to know...");

    },
    function(session,results){
        builder.Prompts.text(session,"Ok..that's cool, Now what was the exact date on which You got this Blessing?");
    },
    function(session,results){
         builder.Prompts.text(session,"I'm Sure that you remember the time too!..");
    },
    function(session,results){
         builder.Prompts.text(session,"Lucky Father!..You Didn't tell me who is that lucky mother..");
    },
    function(session,results){
         builder.Prompts.text(session,"Please do provide me her Aadhar number also..");
    },
    function(session){
        session.send("A little more about the birth Place..");
        builder.Prompts.text(session,"1.District");
    },
    function(session,results){
        session.send("Got It!..");
        builder.Prompts.text(session,"2.Subdistrict");
    },
    function(session,results){
        builder.Prompts.text(session,"Yep..that's Good, Now The 3.Proper Place");
    },
    function(session,results){
        builder.Prompts.text(session,"All Caught Up I am Submitting the application!..");
    }    


]);