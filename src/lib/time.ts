export const hours = (int: number) => int * minutes(60);
export const minutes = (int: number) => int * seconds(60);
export const seconds = (int: number) => int * second();
export const second = () => 1000;
export const milliseconds = (int: number) => int;

export const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});