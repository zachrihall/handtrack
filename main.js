const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;
// const model =  await handTrack.load();
// const predictions = await model.detect(img);

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
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
      if( item.label === 'closed') {
        return item
      }
    })
}


function runDetection() {
    model.detect(video).then(predictions => {

        // if(predictions[0].label === 'open') {
        //   console.log(predictions)
        // }

        predictions.filter((item) => {
          if( item.label === 'closed') {
            console.log(item)
          }
        })

        console.log("model predictions", model.renderPredictions)
        // console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
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
