const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const context2 = canvas2.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;
// const model =  await handTrack.load();
// const predictions = await model.detect(img);

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

// const modelParams = {
//   flipHorizontal: false,
//     outputStride: 16,
//     imageScaleFactor: 1,
//     maxNumBoxes: 20,
//     iouThreshold: 0.2,
//     scoreThreshold: 0.6,
//     modelType: "ssd320fpnlite",
//     modelSize: "large",
//     bboxLineWidth: "2",
//     fontSize: 17,
// }

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

function filterPredictions(predictions) {
    predictions.filter((item) => {
        if (item.label === 'closed') {
            return item
        }
    })
}


function runDetection() {
    model.detect(video).then(predictions => {

        // if(predictions[0].label === 'open') {
        //   console.log(predictions)
        // }

        // function drawAndClear(x,y) {
        //     if (i < 20) {
        //         canvas.drawImage(img, x, y, 150, 180);
        //         // console.log("Cleared and drew");

        //         i++;
        //         setTimeout(drawAndClear, 1000); // Wait for 3 seconds before the next iteration
        //     } else {
        //         // After the loop is finished, wait for 10 seconds
        //         setTimeout(() => {
        //             console.log("Finished waiting for 10 seconds");
        //         }, 10000);
        //     }
        // }
        const img = document.getElementById("scream");

        predictions.filter((item) => {
            if ((item.label === 'closed' || item.label === 'open' || item.label === 'point') && item.score > 0.60) {
                console.log(`X: ${item.bbox[0]}, Y: ${item.bbox[1]}`);

                // context.drawImage(img, item.bbox[0], item.bbox[1], 300, 300);
                // context.clearRect(0, 0, canvas.width, canvas.height);
                function animate() {
                    context2.clearRect(0, 0, canvas.width, canvas.height);
                    context2.drawImage(img, item.bbox[0], item.bbox[1], 130, 130);

                    requestAnimationFrame(animate)
                }
                animate()


            }
        })

        // console.log("Predictions: ", predictions);
        model.renderPredictions(predictions.filter((item) => {
            if ((item.label === 'closed' || item.label === 'open' || item.label === 'point') && item.score > 0.80) {
                return item;
            }
        }), canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});
