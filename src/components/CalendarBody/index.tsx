/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import { useFocusDate, useLocale } from '../../hooks';
import Weekdays from '../Weekdays';
import CalendarDays from '../CalendarDays';

const CalendarBody = () => {
  const [locale, rtl] = useLocale();
  const focusDate = useFocusDate();

  const focusTime = focusDate && focusDate.getTime();
  const activeDescendantId = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(focusTime ? new Date(focusTime) : undefined);
  }, [focusTime, locale]);

  const style = React.useCallback(
    (_theme: any) => css`
      direction: ${rtl ? 'rtl' : 'ltr'};
      width: 100%;
    `,
    [rtl]
  );

  return (
    <table css={style} aria-activedescendant={activeDescendantId}>
      <thead>
        <Weekdays />
      </thead>
      <tbody>
        <CalendarDays />
      </tbody>
    </table>
  );
};

export default React.memo(CalendarBody);
