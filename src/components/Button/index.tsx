/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      css={css`
        appearance: none;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;

        &[disabled] {
          cursor: not-allowed;
        }
      `}
      {...props}
    />
  );
};

export default Button;
