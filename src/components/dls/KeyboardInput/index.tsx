import React from 'react';

import styles from './KeyboardInput.module.scss';

interface Props {
  keyboardKey?: string;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
}

const KeyboardInput: React.FC<Props> = ({ keyboardKey, meta, shift, alt, ctrl }) => {
  const isMacOs = typeof window !== 'undefined' && window.navigator.userAgent.search('Mac') !== -1;
  return (
    <kbd className={styles.container}>
      {meta && <span>{isMacOs ? '⌘' : 'ctrl'}</span>}
      {shift && <span>⇧</span>}
      {alt && <span>⌥</span>}
      {ctrl && <span>⌃</span>}
      {keyboardKey && <span>{keyboardKey}</span>}
    </kbd>
  );
};

export default KeyboardInput;
