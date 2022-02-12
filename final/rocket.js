let average = 0;
let request;
let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d");
let total = 0;
let counter = 0;
let speed = 0;
let playerY = 320;
let playerImage = new Image();
let jumpingImage = 1;
let landingImage = 6;
let chargingImage = 7;
let playerwidth = 80;
let playerheight = 144;
let maxHeight = 0;
let height = 0;


let index = 0;
let blueList = ["rgb(240,248,255)", "rgb(176,224,230)", "rgb(173,216,230)", "rgb(135,206,250)", "rgb(135,206,235)", "rgb(0,191,255)", "rgb(30,144,255)", "rgb(65,105,225)", "rgb(0,0,255)", "rgb(0,0,139)", "rgb(0,0,0)"]

document.addEventListener("DOMContentLoaded", init, false);


function init () {
    playerImage.src = "jumping.png"
    drawAll();
    scream();
}


function drawAll() {
    request = window.requestAnimationFrame(drawAll);
    context.clearRect(0,0, 512, 320);

    if (maxHeight < total) {
        maxHeight = total;
    }

    context.fillStyle = blueList[index];
    context.fillRect(0, 0, canvas.width, canvas.height);


    if (counter >= 500) {
        playerY -= speed;

        if (maxHeight >= 10000) {
            speed = total/150;
        } else {
            speed = total/100;
        } 
        
        context.drawImage(playerImage, 
            76.4, 0, playerwidth, playerheight, 
            canvas.width/2-(playerwidth/2), playerY, playerwidth, playerheight/2);

        if (playerY <= 0) {

            playerY = canvas.height + playerheight/2;
            total -= canvas.height;
            height += canvas.height;

            if (height % (canvas.height * 7) === 0) {
                index += 1;
                if (index === blueList.length - 1) {
                    index = blueList.length - 1;
                }
            }

            console.log(total);
            speed *= 0.95;

            if (total <= 0) {
                speed = 0;
                console.log(maxHeight);
            };

        };

    } else if (counter < 500) {
        context.drawImage(playerImage,
            80*6, 0, playerwidth, playerheight,
            canvas.width/2-(playerwidth/2), playerY-72, playerwidth, playerheight/2);
    };
}

function scream() {
    navigator.mediaDevices.getUserMedia({
        audio: true
    })
        .then(function(stream) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream); // audio soruce to be fed into an audio processing graph
        const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1); // controls how frequently the audioprocess event is dispatched
            // lower the buffersize - lower (better latency)
            // higher the buffer - avoid audio breakup and glitches
    
        analyser.smoothingTimeConstant = 0.9; //an average between the current buffer and the last buffer the AnalyserNode processed
        analyser.fftSize = 2048;
    
        microphone.connect(analyser);
        analyser.connect(scriptProcessor); 
        scriptProcessor.connect(audioContext.destination); //final destination of all audio in the context
        scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0); //reduce the values against an accumulator
            average = arraySum / array.length;
            
            // timer for 10s
            if (counter <= 500) {
                total += Math.round(average);
                console.log(total)
                counter++;
            }
            
        };
    })
        .catch(function(err) {
        /* handle the error */
        console.error(err);
        });
}