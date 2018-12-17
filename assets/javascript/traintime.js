//1. INITIALIZE FIREBASE

var config = {
  apiKey: "AIzaSyAnDZaZSQ3mnN2xi9EL0dNY-SuI9cgqNDE",
  authDomain: "traintracker-ec467.firebaseapp.com",
  databaseURL: "https://traintracker-ec467.firebaseio.com",
  projectId: "traintracker-ec467",
  storageBucket: "traintracker-ec467.appspot.com",
  messagingSenderId: "831254081828"
};
firebase.initializeApp(config);
  
var database = firebase.database();

// ADDIND SOUND TO THE BUTTON ***NOT WORKING***

var trainAudio = new Audio("assets/images/trainbell.mp3");

$("#add-train-btn").on("click", function(event) {
   trainAudio.play();

   setTimeout(function(){
      trainAudio.pause();
      trainAudio.currentTime = 0;
    }, 1000);

});

 
//2. ADDING NEW TRAINS

$("#add-train-btn").on("click", function(event) {
  
    event.preventDefault(); //prevents page from reloading
    
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      first: trainFirst,
      frequency: trainFrequency,
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);
    
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
    return false
    });

//3. CREATE FIREBASE EVENT FOR ADDING TRAIN TO THE DATABASE AND ROW IN HTML WHEN USER ADD ENTRY

database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var firstTime = parseInt(childSnapshot.val().first);
    var tFrequency = parseInt(childSnapshot.val().frequency);
    var cross = 'x';
    
    // Train Info
    console.log("the train name is " + tName);
    console.log("the train destination is " + tDestination);
    console.log("the first train is " + firstTime);
    console.log("the train frequency is " + tFrequency);

   // First Time (pushed back 1 year to make sure it comes before current time)
   var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
   console.log(firstTimeConverted);

   // Current Time
   var currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    // Create the new row 
    var newRow = $("<tr>").append(
           $("<td>").attr("id",'name').text(tName),
           $("<td>").attr("id",'destination').text(tDestination),
           $("<td>").attr("id",'frequency').text(tFrequency),
           $("<td>").attr("id",'next').text(nextTrain),
           $("<td>").attr("id",'minutes').text(tMinutesTillTrain),
           $("<td>").attr("id",'cross').text(cross)
   );

   // Append the new row to the table
      $("#train-table > tbody").append(newRow);


    // DELETING TRAIN RECORD ***NOT WORKING ***
    // From the click on the 'x', get the unique ID document in Firebase to select the document and delete   

//       $("#cross").on("click", function() {
//         var id = $('#cross').parentElement.getAttribute("cross"); //target record id in firebase
//         var teste = firebase.database().parentElement.key();
//         console.log(id);
//       database.ref().doc(id).delete();
//      });

});




