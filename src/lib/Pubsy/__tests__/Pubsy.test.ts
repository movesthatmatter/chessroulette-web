import { Pubsy } from '..';
import { delay } from '../../time';

type GenericChannelTypesMap = {[k: string]: any}
let pubsy: Pubsy<GenericChannelTypesMap>;

beforeEach(() => {
  pubsy = new Pubsy<GenericChannelTypesMap>();
});

describe('PubSub', () => {
  test('publishes a simple subscription with a primitive payload', () => {
    const spy = jest.fn();
    pubsy.subscribe('asd', spy);

    pubsy.publish('asd', 1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  test('publishes a simple subscription with a more complex payload', () => {
    const spy = jest.fn();
    pubsy.subscribe('asd', spy);

    const payload = {
      val: 2,
      nested: {
        values: {
          test: [1, 2, 3]
        }
      }
    };

    pubsy.publish('asd', payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(payload);
  });
});

describe('On Demand', () => {
  test('it works', async () => {
    const spy = jest.fn();
    const pubsy = new Pubsy<{
      myEvent: number;
    }>({
      myEvent: {
        onDemanded: (p) => {
          console.log('on demanded called', p);
          setTimeout(() => {
            console.log('going to publish');
            p.publish('myEvent', 2);
          }, 10);

          return () => {}
        }
      }
    });

    pubsy.subscribe('myEvent', spy);

    await delay(20);
    
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2);
  });
});
