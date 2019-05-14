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

  const sameMonth = React.useMemo(() => isSameMonth(pageDate, date), [
    pageDate,
    date,
  ]);

  const canTabTo = React.useMemo(() => {
    if (focusDate && isSameMonth(pageDate, focusDate)) {
      return isSameDay(date, focusDate) ? 0 : -1;
    } else if (selectedDate && isSameMonth(pageDate, selectedDate)) {
      return isSameDay(date, selectedDate) ? 0 : -1;
    } else if (isSameMonth(pageDate, new Date())) {
      return isSameDay(date, new Date()) ? 0 : -1;
    }
    return getDate(date) === 1 ? 0 : -1;
  }, [focusDate, pageDate, selectedDate, date]);

  const ariaSelected = React.useMemo(() => {
    return selectedDate && isSameDay(date, selectedDate) ? 'true' : 'false';
  }, [selectedDate, date]);

  React.useEffect(() => {
    if (
      ref.current &&
      sameMonth &&
      focusDate &&
      focusDate.getTime() === date.getTime()
    ) {
      ref.current.focus();
    }
  }, [focusDate, date, sameMonth]);

  const Component = !sameMonth ? 'span' : 'a';

  const onClick = React.useMemo(
    () => (sameMonth ? () => handleClick(date) : undefined),
    [sameMonth, date, handleClick]
  );
  const onFocus = React.useCallback(() => handleFocus(date), [
    date,
    handleFocus,
  ]);
  const onKeyDown = React.useCallback(e => handleKeyDown(e, date), [
    date,
    handleKeyDown,
  ]);

  const style = React.useCallback(
    (_theme: any) => css`
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
    `,
    [sameMonth, selectedDate, date]
  );

  return (
    <Component
      ref={ref}
      css={style}
      tabIndex={canTabTo}
      onClick={onClick}
      aria-selected={ariaSelected}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
};

const ForwardRefDay = React.forwardRef<
  HTMLAnchorElement | HTMLSpanElement | null,
  DayProps
>((props, ref) => <Day forwardedRef={ref} {...props} />);

ForwardRefDay.displayName = 'ForwardRef(Day)';

const MemoForwardRef = React.memo(ForwardRefDay);

MemoForwardRef.displayName = 'Memo(ForwardRef(Day))';

export default MemoForwardRef;
