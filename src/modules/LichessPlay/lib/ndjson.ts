const ndjson = (onEvent: ((line: any) => void)) => async (response: Response) => {
  const stream = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handle = (str: string) => {
    if (str) {
      onEvent(JSON.parse(str));
    }
  }

  const loop = (): Promise<void> => stream.read().then(({ done, value }) => {

    if (done) {
      return handle(buffer);
    }

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split(/\r?\n/);
    buffer = parts.pop() || '';
    parts.forEach(handle);

    return loop();
  });

  return loop().then(() => console.log('the stream has completed'));
}

export default ndjson;