import React from 'react';

type Props = {};

export const WatchProvider: React.FC<Props> = (props) => {
  // useEffect(() => {
  //   getFeaturedStreamers().map(({ items }) => {
  //     if (items.length === 0) {
  //       return;
  //     }

  //     const nextStremersState = toStreamersState(items, props.heroStreamer);

  //     if (props.heroStreamer && props.heroStreamer !== nextStremersState?.hero) {
  //       history.replace('/watch');
  //     }

  //     setStreamersState(nextStremersState);
  //   });
  // }, [props.heroStreamer, history]);

  return null;
};
