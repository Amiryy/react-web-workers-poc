import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [data, setData] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const worker = useRef(new Worker('./worker.js'));
  useEffect(() => {
    worker.current.onmessage = (event) => {
      console.log(event.data);
      if (event.data.type === 'getData') {
        setData(event.data.payload);
      }
    };
    setProgress(1)
    worker.current.postMessage({ type: 'getData' });
  }, []);
  return <div>
  
  </div>;
}

render(<App />, document.getElementById('root'));
