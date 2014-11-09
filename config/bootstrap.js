/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Agenda = require('agenda');
var gcm = require('node-gcm');
var moment = require('moment');

var apiKey = 'AIzaSyCWn5TuMlaoKsdFdZ243z8x2_zAqprbhUM';

var message = new gcm.Message();
//API Server Key
var sender = new gcm.Sender(apiKey);
var registrationIds = [];

function sendPushMessage(drugName) {
  // Value the payload data to send...
  message.addData('message',"You need to take " + drugName + " now");
  message.addData('title','Madella' );
  message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
  //message.collapseKey = 'demo';
  //message.delayWhileIdle = true; //Default is false
  message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

  var thanhAndroid = "APA91bHO4Vl_u0IFM-wx9uvaIgpYTCuxFodGqTgIFiScBIzrlZEN9zCfdWnCghRse8XBYyzOlC5glY0WecMS2ymeY3A6KM674bLgIoWbC65C5yJtDwusz0B5bMsadTqWzqoL-gBoMni1AgOdO0O15uDHc0_OCljHNQ";
  // At least one reg id required
  registrationIds.push(thanhAndroid);

  /**
   * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
   */
  sender.send(message, registrationIds, 4, function (result) {
      console.log(result);
  });
}

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example'}});

  agenda.define('checkPrescription', function(job, done) {
    //User.remove({lastLogIn: { $lt: twoDaysAgo }}, done);
    Prescription.find().exec(function(err, prescriptions) {
      var currentTime = new Date();
      var currentYear = currentTime.getYear();
      var currentMonth = currentTime.getMonth();
      var currentDay = currentTime.getDay();
      var currentHour = currentTime.getHours();
      var currentMinute = currentTime .getMinutes();

      prescriptions.forEach(function(prescription) {
        prescription.drugs.forEach(function(drug) {
          timeslot = drug.timeslot.split(":");
          var hour = parseInt(timeslot[0]);
          var minute = parseInt(timeslot[1]);
          var medTime = new Date(currentYear, currentMonth, currentDay, hour, min, 0);
          if (medTime > currentTime) {
            var delta = medTime - currentTime;
            var msec = delta;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            if (hh === 0 && mm <= 5) {
              sendPushMessage(drug.name);
              break;
            }
          }
        })
      })
    });
    done();
  });

  agenda.every('1 minute', 'checkPrescription');

  agenda.start();


  cb();
};
