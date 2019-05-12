/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';

const Button = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const styles = React.useCallback(
    (_theme: any) => css`
      appearance: none;
      background: transparent;
      border: 0;
      cursor: pointer;

      &[disabled] {
        cursor: not-allowed;
      }
    `,
    []
  );
  return <button css={styles} {...props} />;
};

export default React.memo(Button);
