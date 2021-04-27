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
    <div className={cls.iconContainer} onClick={onClick}>
      <Chat color={color} style={style} />
      {newMessagesCount > 0 && (
        <Badge text={String(newMessagesCount)} color="primary" className={cls.badgeContainer} />
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  iconContainer: {
    display: 'flex',
  },
  badgeContainer: {
    position: 'absolute',
    left: '24px',
    bottom: '47px',
  },
});
