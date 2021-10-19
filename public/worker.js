onmessage = async function (e) {
  console.log('Message received from main script', e);
  if (e.data.type === 'getData') {
    setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then((response) => response.json())
        .then((json) => {
          console.log('Posting message back to main script', json);
          postMessage({type: "getData", payload: json});
        });
    }, 3000);
  }
};
