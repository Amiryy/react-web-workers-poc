export interface DataTypes {
  getFirstData: FirstDataType
  getSecondData: SecondDataType
}
export interface WorkerDataType<T extends keyof DataTypes = keyof DataTypes> {
  type: T;
  payload: DataTypes[T]
}
export interface FirstDataType {
  title: string
}
export interface SecondDataType {
  name: string
}

export default () => {
  self.addEventListener("message", (e: MessageEvent<WorkerDataType>) => {
    console.log('Message received from main script', e);
    if (e.data.type === 'getFirstData') {
      setTimeout(() => {
        postMessage({ type: e.data.type, payload: { title: "Cool Data Title" } as FirstDataType });
      }, 1500);
    }
    if (e.data.type === 'getSecondData') {
      setTimeout(() => {
        postMessage({ type: e.data.type, payload: { name: "Amiryu" } as SecondDataType });
      }, 3000);
    }
  });
};