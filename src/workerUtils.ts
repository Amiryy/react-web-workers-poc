export function createWorker(worker: Function) {
  if(Worker) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"]);
    return new Worker(URL.createObjectURL(blob));
  } else {
    console.error('Your browser doesn\'t support web workers.');
  }
}
