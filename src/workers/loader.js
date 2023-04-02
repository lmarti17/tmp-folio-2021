/*
 * video-loader.worker.js
 */

// The `message` event is fired in a web worker any time `worker.postMessage(<data>)` is called.
// `event.data` represents the data being passed into a worker via `worker.postMessage(<data>)`.
self.addEventListener("message", async (event) => {
  const videoURL = event.data;

  // Fetching the video
  const response = await fetch(videoURL);

  // Converting the file to blob
  const blob = await response.blob();

  // Send the file back
  self.postMessage({
    videoURL,
    blob,
  });
});
