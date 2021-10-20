import { useEffect, useRef, useState } from "react";
import { createWorker } from "./workerUtils";

export function useWorker<T extends { type: string }>(workerFn: Function) {
  const workerRef = useRef(createWorker(workerFn));
  const [requestsCount, setRequestsCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [results, setResults] = useState<T[]>([]);
  
  function onMessage(event: MessageEvent<T>) {
    if (event.data.type === "my-worker-error") {
      setErrorsCount(prev => prev + 1)
    } else {
      setResults(prev => [...prev, event.data]);
      setProgress(prev => prev + 1);
    }
  }
  
  function sendMessages(types: string[]) {
    if(workerRef.current) {
      for (const type of types) {
        workerRef.current.postMessage({ type });
      }
      setRequestsCount(prev => prev + types.length);
    }
  }
  
  function clearProccess(){
    setProgress(0);
    setRequestsCount(0);
    setErrorsCount(0);
  }
  
  useEffect(() => {
    if(workerRef.current) {
      workerRef.current.onmessage = onMessage;
    }
  }, []);
  
  const totalProgress = progress + errorsCount;
  const percent = totalProgress / requestsCount * 100;
  const isDone = requestsCount > 0  && totalProgress >= requestsCount;
  const isLoading = requestsCount > 0 && totalProgress < requestsCount;
  return { percent, isDone, isLoading, errorsCount, results, sendMessages, clearProccess }
}
