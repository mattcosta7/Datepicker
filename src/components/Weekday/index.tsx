/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';

const Weekday = ({ dayNumber, children }: any) => {
  const style = React.useCallback(
    (_theme: any) => css`
      ${dayNumber === 0 ||
        (dayNumber === 6 &&
          css`
            color: green;
          `)}

      &[disabled] {
        cursor: not-allowed;
        color: grey;
      }
    `,
    [dayNumber]
  );
  return <span css={style}>{children}</span>;
};

export default React.memo(Weekday);
