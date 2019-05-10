/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';
import { LocaleContext } from '../../context/Calendar';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  date: Date;
}

const Button = ({ date, ...props }: ButtonProps) => {
  const locale = React.useContext(LocaleContext);
  const dateFormatter = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      throw e;
    }
  }, [locale]);

  const dateString = React.useMemo(() => {
    return dateFormatter.format(date);
  }, [date]);

  return (
    <button
      css={(_theme: any) => css`
        appearance: none;
        background: transparent;
        border: 0;
        cursor: pointer;

        &[disabled] {
          cursor: not-allowed;
        }
      `}
      title={dateString}
      aria-label={dateString}
      {...props}
    />
  );
};

export default React.memo(Button);
