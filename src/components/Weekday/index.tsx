/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';

const Weekday = ({ dayNumber, children }: any) => {
  return (
    <span
      css={(_theme: any) => css`
        background: transparent;
        cursor: default;
        flex: 1 0 ${100 / 7}%;
        height: 100%;
        width: 100%;
        text-align: center;

        ${dayNumber === 0 ||
          (dayNumber === 6 &&
            css`
              color: green;
            `)}

        &[disabled] {
          cursor: not-allowed;
          color: grey;
        }
      `}
    >
      {children}
    </span>
  );
};

export default React.memo(Weekday);
