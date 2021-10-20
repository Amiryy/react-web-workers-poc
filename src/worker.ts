export interface WorkerDataType {
  type: string;
  data: string;
}
export default () => {
  const titleData = { type: "title", data: "Cool Data" };
  const nameData = { type: "name", data: "Amiryu" };
  
  function onError(error: unknown) {
    console.error("Worker Error: ", error);
    postMessage({ type: "my-worker-error", data: "null" })
  }
  
  self.addEventListener("error", onError);
  
  self.addEventListener("message", (e: MessageEvent<WorkerDataType>) => {
    console.log('Message received from main script', e);
    try {
      const response = [titleData, nameData].find(data => data.type === e.data.type);
      if (response) {
        setTimeout(() => {
          postMessage(response);
        }, Math.random() * 3000 + 1500);
      } else {
        postMessage({ type: e.data.type, data: "N/A" });
      }
    } catch (err) {
      onError(err);
    }
  });
};
