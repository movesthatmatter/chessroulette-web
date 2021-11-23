import { NDJsonReaderUniversal } from '../../types';

export async function loopThroughNDJson<T extends {} | unknown>(reader: NDJsonReaderUniversal<T>) {
  try {
    const event = await reader.read();
    
    console.log('new entry', event);
    if (event.done && !event.value) {
      console.log('DONE DECODING STREAM');
      return;
    }

    loopThroughNDJson(reader);

  } catch (e) {
    console.log('error parsing the current event', e);
  }
}