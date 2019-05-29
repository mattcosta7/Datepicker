/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useFocusDate, useLocale } from '../../hooks';
import Weekdays from '../Weekdays';
import CalendarDays from '../CalendarDays';

const CalendarBody = () => {
  const [locale, rtl] = useLocale();
  const focusDate = useFocusDate();

  const activeDescendantId = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(focusDate);

  return (
    <table
      css={(_theme: any) => css`
        direction: ${rtl ? 'rtl' : 'ltr'};
        width: 100%;
      `}
      aria-activedescendant={activeDescendantId}
    >
      <thead>
        <Weekdays />
      </thead>
      <tbody>
        <CalendarDays />
      </tbody>
    </table>
  );
};

export default CalendarBody;
