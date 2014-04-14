var applicationID = "F79DFA58";
var namespace = 'urn:x-cast:com.chromecast.jackmonitor';
var session = null;

$(document).ready(function() {
	$("#cast-btn").click(function() {
		console.log("Initiating Cast");
		chrome.cast.requestSession(function(e) {
			session = e;
		}, onError);
	});

	//let's kick off the chromecast api
	if (!chrome.cast || !chrome.cast.isAvailable) {
		setTimeout(initCC, 1000);
	}
});

initCC = function() {
	var sessionRequest = new chrome.cast.SessionRequest(applicationID);
	var apiConfig = new chrome.cast.ApiConfig(
		sessionRequest,
		sessionListener,
		receiverListener
	);

	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

sessionListener = function(e) {
	session = e;

	console.log("Session: " + session.sessionId);
}

receiverListener = function(e) {
	if(e === chrome.cast.ReceiverAvailability.AVAILABLE) {
 		console.log("Receiver found.");
 	} else {
 		console.log("No receivers available.");
 	}
}

onInitSuccess = function() {
	console.log("Cast initialized.");
}

onDeinitSuccess = function() {
	console.log("Cast deinitialized");
}

onError = function(error) {
	console.log("Cast error.")
	console.log(error);
}

onSuccess = function(result) {
	console.log("Cast success");
}