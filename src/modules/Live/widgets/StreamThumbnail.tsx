import React, { useMemo } from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  width: number;
  height: number;
} & (
  | {
      unparsedUrl: string;
      url?: undefined;
    }
  | {
      url: string;
      unparsedUrl?: undefined;
    }
);

const parseUrl = (
  url: string,
  { width = 640, height = 480 }: { width: number; height: number }
) => {
  return url.replaceAll('{width}', `${width}`).replaceAll('{height}', `${height}`);
};

export const StreamThumbnail: React.FC<Props> = (props) => {
  const cls = useStyles();
  const url = useMemo(() => props.unparsedUrl ? parseUrl(props.unparsedUrl, props) : props.url, [props]);
  

  return (
    <AspectRatio
      aspectRatio={{
        width: props.width,
        height: props.height,
      }}
    >
      <img
        src={url}
        style={{
          width: props.width,
          height: props.height,
        }}
      />
    </AspectRatio>
  );
};

const useStyles = createUseStyles({
  container: {},
});
