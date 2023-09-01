import React, { useEffect, useRef, useCallback } from "react";

// create a web worker
const worker = new Worker("./worker.js");

function App() {
  // store the worker in a ref
  const workerRef = useRef(worker);

  // define a function to send a message to the worker
  const sendMessage = useCallback(() => {
    // get the worker from the ref
    const worker = workerRef.current;
    // send a message to the worker
    worker.postMessage("Hello from React");
  }, []);

  // define a function to handle the message from the worker
  const handleMessage = useCallback((event) => {
    // get the data from the event
    const data = event.data;
    // do something with the data
    console.log(data);
  }, []);

  // use useEffect to create and terminate the worker
  useEffect(() => {
    // get the worker from the ref
    const worker = workerRef.current;
    // add an event listener for the message event
    worker.addEventListener("message", handleMessage);
    // return a cleanup function to terminate the worker
    return () => {
      // remove the event listener
      worker.removeEventListener("message", handleMessage);
      // terminate the worker
      worker.terminate();
    };
  }, [handleMessage]);

  return (
    <div className="App">
      <h1>Web Worker Demo</h1>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
