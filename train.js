var config = {
    apiKey: "AIzaSyBzmyqeFA0TK_ojS1V8Jxo3Hf7ZB8eKdpk",
    authDomain: "trainschedule-f99d9.firebaseapp.com",
    databaseURL: "https://trainschedule-f99d9.firebaseio.com",
    storageBucket: "trainschedule-f99d9.appspot.com",
    messagingSenderId: "947439249383",
  };
  firebase.initializeApp(config);

var database = firebase.database();

//Initial Values
var startTime;
var currentTime;
var frequency;

// Submit Button Click
$("#trainbutton").on("click", function(event){
	event.preventDefault();
    
// Code in the logic for storing and retrieving the most recent trains.
    name=$("#name-input").val().trim();
	destination=$("#destination-input").val().trim();
	firstTrainTime=$("#start-input").val().trim();
	frequency=$("#frequency-input").val().trim();

	database.ref().push({
		trainName: name,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	});

	$("#name-input").val("");
	$("#role-input").val("");
	$("#start-input").val("");
	$("#rate-input").val("");
});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function(snapshot){
	var tFrequency = snapshot.val().frequency;

    var firstTime = snapshot.val().firstTrainTime;

//moment.js

//first train time  - to convert into HH:mm format and years
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

//current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times 
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart 
    var tRemainder = diffTime % tFrequency;
	console.log(tRemainder);


// Minutes until train
    var tMinutesTillTrain = tFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    
    
    var row = $("<tr>");
	var col1= $("<td>" + snapshot.val().trainName + "</td>");
	var col2= $("<td>" + snapshot.val().destination + "</td>");
	var col3= $("<td>" + snapshot.val().frequency + "</td>");
	var col4= $("<td>" + moment(nextTrain).format("hh:mm") + "</td>");
	var col5= $("<td>" +  tMinutesTillTrain + "</td>");
    
    
    $(col1).appendTo(row);
	$(col2).appendTo(row);
	$(col3).appendTo(row);
	$(col4).appendTo(row);
	$(col5).appendTo(row);
	$("#trainArea").append(row);
});
