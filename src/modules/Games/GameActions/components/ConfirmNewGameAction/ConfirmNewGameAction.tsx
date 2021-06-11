import { GameSpecsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { Dialog } from 'src/components/Dialog';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import objectEquals from 'object-equals';
import { ButtonProps } from 'src/components/Button';
import { hasOwnProperty } from 'src/lib/util';

// TODO: move them somewhere else
type DangerouslySetInnerHTML = { __html: string };

const isDangerouslySetHtml = (t: unknown): t is DangerouslySetInnerHTML =>
  typeof t === 'object' && hasOwnProperty(t || {}, '__html');

type UnclickableButtonProps = Omit<ButtonProps, 'onClick'>;

type Props = {
  title: string;
  content: string | DangerouslySetInnerHTML | React.ReactNode;
  prevGameSpecs?: GameSpecsRecord;
  render: (p: RenderProps) => React.ReactNode;

  submitButton:
    | UnclickableButtonProps
    | ((p: { isRematchable: boolean }) => UnclickableButtonProps);
  cancelButton?:
    | UnclickableButtonProps
    | ((p: { isRematchable: boolean }) => UnclickableButtonProps);

  onSubmit: (p: { gameSpecs: GameSpecsRecord; isRematchable: boolean }) => void;
};

type RenderProps = {
  onConfirm: () => void;
};

export const ConfirmNewGameAction: React.FC<Props> = ({
  prevGameSpecs = {
    timeLimit: 'rapid10',
    preferredColor: 'white',
  },
  content,
  title,
  ...props
}) => {
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord>(prevGameSpecs);
  const [isRematchable, setIsRematchable] = useState(!!prevGameSpecs);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsRematchable(objectEquals(prevGameSpecs, gameSpecs));
  }, [prevGameSpecs, gameSpecs]);

  const renderContent = (() => {
    if (typeof content === 'string') {
      return <Text size="small1">{content}</Text>;
    }

    if (isDangerouslySetHtml(content)) {
      return <Text size="small1" dangerouslySetInnerHTML={content} />;
    }

    return content;
  })();

  const cancelButton = (() => {
    if (!props.cancelButton) {
      return {
        type: 'secondary',
        label: 'Cancel',
        onClick: () => setIsVisible(false),
      } as const;
    }

    const buttonProps =
      typeof props.cancelButton === 'function'
        ? props.cancelButton({ isRematchable })
        : props.cancelButton;

    return {
      ...buttonProps,
      onClick: () => {
        setIsVisible(false);
      },
    };
  })();

  const submitButton = (() => {
    const buttonProps =
      typeof props.submitButton === 'function'
        ? props.submitButton({ isRematchable })
        : props.submitButton;

    return {
      ...buttonProps,
      onClick: () => {
        props.onSubmit({ isRematchable, gameSpecs });
        setIsVisible(false);
      },
    };
  })();

  return (
    <>
      <Dialog
        title={title}
        visible={isVisible}
        hasCloseButton={false}
        content={
          <div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: spacers.large,
              }}
            >
              {renderContent}
            </div>
            <CreateChallenge
              gameSpecs={gameSpecs}
              onUpdated={(nextGameSpecs) => {
                setGameSpecs(nextGameSpecs);
              }}
            />
          </div>
        }
        buttons={[cancelButton, submitButton]}
      />
      {props.render({
        onConfirm: () => {
          // Reset the state of the form!
          //  Add any other things that need to be reverted here as they come!
          setGameSpecs(prevGameSpecs);

          setIsVisible(true);
        },
      })}
    </>
  );
};
