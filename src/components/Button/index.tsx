import * as React from 'react';
import styled from 'styled-components';
import CalendarContext from '../../context/Calendar';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  date: Date;
}

const StyledButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }
`;

const Button = ({ date, ...props }: ButtonProps) => {
  const { locale } = React.useContext(CalendarContext);
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

  return <StyledButton title={dateString} aria-label={dateString} {...props} />;
};

export default React.memo(Button);
