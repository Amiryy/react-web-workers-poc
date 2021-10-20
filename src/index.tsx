import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Progress } from 'antd';
import 'antd/dist/antd.css';
import { createWorker } from "./workerUtils";
import myWorker, { WorkerDataType } from "./worker";


function useWorker<T extends { type: string }>(workerFn: Function) {
  const worker = useRef(createWorker(workerFn));
  const [progress, setProgress] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [results, setResults] = useState<T[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);
  
  function clearProccess(){
    setProgress(0);
    setRequestsCount(0);
    setErrorsCount(0);
  }
  function onMessage(event: MessageEvent<T>) {
    if (event.data.type === "my-worker-error") {
      setErrorsCount(prev => prev + 1)
    } else {
      setResults(prev => [...prev, event.data]);
      setProgress(prev => prev + 1);
    }
  }
  function sendMessages(types: string[]) {
    types.forEach(type => worker.current.postMessage({ type }));
    setRequestsCount(prev => prev + types.length);
  }
  useEffect(() => {
    worker.current.onmessage = onMessage;
  }, []);
  
  const totalProgress = progress + errorsCount;
  const percent = totalProgress / requestsCount * 100;
  const isDone = requestsCount > 0  && totalProgress >= requestsCount;
  const isLoading = requestsCount > 0 && totalProgress < requestsCount;
  return { percent, isDone, isLoading, errorsCount, results, sendMessages, clearProccess }
}

const appDivStyle = { margin: "2rem auto", width: 400, display: "grid", gridAutoFlow: "row" };

function App() {
  const { sendMessages, percent, isDone, isLoading, errorsCount, results } = useWorker<WorkerDataType>(myWorker);
  useEffect(() => {
    sendMessages(['title', 'name']);
  }, []);
  
  return <div style={appDivStyle}>
    <span>{isLoading ? "Loading..." : isDone ? "Done" : ""}</span>
    {errorsCount > 0 ? <span>{errorsCount} {"Error" + (errorsCount > 1 ? "s" : "")}</span> : null}
    <Progress percent={percent} status={errorsCount > 0 ? "exception" : undefined}/>
    {results.map((result, i) => (
      <span key={`${i}_${result.type}`}>{result.type}: {result.data}</span>
    ))}
  </div>;
}

render(<App />, document.getElementById('root'));
