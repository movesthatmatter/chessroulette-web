import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Chat } from 'grommet-icons';
import { Badge } from 'src/components/Badge';

type Props = {
  onClick: () => void;
  color: CSSProperties['color'];
  style?: CSSProperties;
  newMessagesCount: number;
};
export const ChatIconWithBadge: React.FC<Props> = ({ color, onClick, style, newMessagesCount }) => {
  const cls = useStyles();

  return (
    <div className={cls.container} onClick={onClick}>
      <Chat color={color} style={style} />
      {newMessagesCount > 0 && (
        <div>
          <Badge text={String(newMessagesCount)} color="primary" className={cls.badge} />
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  badge: {
    position: 'absolute',
    right: '-40%',
    top: '-30%',
  },
});
