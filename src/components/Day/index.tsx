/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';
import { isSameDay, isWeekend, isSameMonth, getDate } from 'date-fns/esm';
import { usePageDate, useFocusDate, useSelectedDate } from '../../hooks';

type DayProps = any;
const Day = ({
  date,
  handleClick,
  handleFocus,
  handleKeyDown,
  forwardedRef,
  ...props
}: any) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const pageDate = usePageDate();
  const focusDate = useFocusDate();
  const selectedDate = useSelectedDate();

  React.useImperativeHandle(forwardedRef, () => ({
    focus() {
      if (ref.current && ref.current instanceof HTMLAnchorElement) {
        ref.current.focus();
      }
    },
  }));

  const sameMonth = isSameMonth(pageDate, date);

  let canTabTo = getDate(date) === 1 ? 0 : -1;
  if (focusDate && isSameMonth(pageDate, focusDate)) {
    canTabTo = isSameDay(date, focusDate) ? 0 : -1;
  } else if (selectedDate && isSameMonth(pageDate, selectedDate)) {
    canTabTo = isSameDay(date, selectedDate) ? 0 : -1;
  } else if (isSameMonth(pageDate, new Date())) {
    canTabTo = isSameDay(date, new Date()) ? 0 : -1;
  }

  React.useEffect(() => {
    if (
      ref.current &&
      sameMonth &&
      ((focusDate || focusDate === 0) && focusDate === date)
    ) {
      ref.current.focus();
    }
  }, [focusDate, date, sameMonth]);

  const Component = !sameMonth ? 'span' : 'a';

  return (
    <Component
      ref={ref}
      css={(_theme: any) => css`
      border: 0;
      cursor: pointer;
      display: block;
      flex: 1 0 ${100 / 7}%;
      text-align: center;
      height: 100%;

      ${isWeekend(date) &&
        css`
          color: green;
        `}
      ${isSameDay(new Date(), date) &&
        css`
          color: red;
        `}
      ${selectedDate &&
        isSameDay(selectedDate, date) &&
        css`
          color: blue;
        `}

      ${!sameMonth &&
        css`
          cursor: not-allowed;
          color: grey;

          &:focus {
            appearance: none;
            outline: 0;
          }
        `}
    `}
      tabIndex={canTabTo}
      onClick={sameMonth ? () => handleClick(date) : undefined}
      aria-selected={
        selectedDate && isSameDay(date, selectedDate) ? 'true' : 'false'
      }
      onFocus={() => handleFocus(date)}
      onKeyDown={e => handleKeyDown(e, date)}
      {...props}
    />
  );
};

const ForwardRefDay = React.forwardRef<
  HTMLAnchorElement | HTMLSpanElement | null,
  DayProps
>((props, ref) => {
  return <Day forwardedRef={ref} {...props} />;
});

export default ForwardRefDay;
