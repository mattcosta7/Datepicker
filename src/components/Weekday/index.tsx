import * as React from 'react';
import styled, { css } from 'styled-components';

interface CalendarItemProps {
  isWeekend?: boolean;
  isToday?: boolean;
  isName?: boolean;
}

const Item = styled.span<CalendarItemProps>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  flex: 1 0 ${100 / 7}%;
  text-align: center;

  ${({ isWeekend }) =>
    isWeekend &&
    css`
      color: green;
    `}
  ${({ isToday }) =>
    isToday &&
    css`
      color: red;
    `}

  &[disabled] {
    cursor: not-allowed;
    color: grey;
  }

  ${({ isName }) =>
    isName &&
    css`
      cursor: default;
    `}
`;

const Weekday = ({ dayNumber, children }: any) => {
  return (
    <Item
      key={dayNumber}
      isWeekend={dayNumber === 0 || dayNumber === 6}
      isName={true}
    >
      {children}
    </Item>
  );
};

export default React.memo(Weekday);
