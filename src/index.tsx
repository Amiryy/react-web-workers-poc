import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Progress } from 'antd';
import 'antd/dist/antd.css';

interface FirstDataType {
  title: string
}
function App() {
  const [data, setData] = useState<FirstDataType | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const worker = useRef(new Worker('./worker.js'));
  
  function sendMessage(type: string) {
    setRequestsCount(prev => prev + 1);
    worker.current.postMessage({ type });
  }
  function onMessage(event: MessageEvent<{ type: string, payload: FirstDataType }>) {
    console.log(event.data);
    if (event.data.type === 'getData') {
      setProgress(prev => prev + 1);
      setData(event.data.payload);
    }
  }
  useEffect(() => {
    worker.current.onmessage = onMessage;
    sendMessage('getData');
  }, []);
  
  return <div style={{ margin: "2rem auto", width: 400 }}>
    <Progress percent={progress / requestsCount * 100} />
    <span>{data ? data.title : requestsCount > 0 ? "Loading..." : "No data"}</span>
  </div>;
}

render(<App />, document.getElementById('root'));
