var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
reset();
recognition.onend = reset();

recognition.onresult = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
        console.log(event.results[i][0].transcript);
        if (event.results[i][0].transcript.includes("jumbo")){
          window.location.replace("jump.html");
        }
        if (event.results[i][0].transcript.includes("yummy")){
          window.location.replace("rocket.html");
        }
    }
  }
}

function reset() {
  recognizing = false;
}

while(true){
recognition.start();
recognizing = true;
}
    