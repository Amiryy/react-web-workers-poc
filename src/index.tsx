import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Progress } from 'antd';
import 'antd/dist/antd.css';
import myWorker, { WorkerDataType } from "./worker";
import { useWorker } from "./useWorker";

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
