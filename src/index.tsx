import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Progress } from 'antd';
import 'antd/dist/antd.css';
import { createWorker } from "./workerUtils";
import workerInstance, { DataTypes, FirstDataType, SecondDataType, WorkerDataType } from "./worker";


function useWorker(onMessage: (event: MessageEvent<WorkerDataType>) => void) {
  const worker = useRef(createWorker(workerInstance));
  function sendMessage(type: keyof DataTypes) {
    worker.current.postMessage({ type });
  }
  useEffect(() => {
    worker.current.onmessage = onMessage;
  }, []);
  return { sendMessage }
}

function App() {
  const [firstData, setFirstData] = useState<FirstDataType | undefined>(undefined);
  const [secondData, setSecondData] = useState<SecondDataType | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  
  const { sendMessage } = useWorker(onMessage);
  
  function onMessage(event: MessageEvent<WorkerDataType>) {
    console.log(event.data);
    if (event.data.type === 'getFirstData') {
      setFirstData(event.data.payload as FirstDataType);
      setProgress(prev => prev + 1);
    }
    if (event.data.type === 'getSecondData') {
      setSecondData(event.data.payload as SecondDataType);
      setProgress(prev => prev + 1);
    }
  }
  
  useEffect(() => {
    sendMessage('getFirstData');
    sendMessage('getSecondData');
    setRequestsCount(prev => prev + 2);
  
  }, []);
  
  return <div style={{ margin: "2rem auto", width: 400, display: "grid", gridAutoFlow: "row" }}>
    <span>{requestsCount > 0 ? progress < requestsCount ? "Loading..." : "Done" : ""}</span>
    <Progress percent={progress / requestsCount * 100} />
    <span>Title: {firstData ? firstData.title : "..."}</span>
    <span>Name: {secondData ? secondData.name : "..."}</span>
  </div>;
}

render(<App />, document.getElementById('root'));
