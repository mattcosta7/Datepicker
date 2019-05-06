import * as React from 'react';
import { CalendarContextProvider } from '../../context/Calendar';
import CalendarBody from '../CalendarBody';
import Header from '../Header';

import defaultLocale from '../../utils/default-locale';
export interface CalendarProps {
  date?: Date;
  weekDays?: string[];
  weekStart?: number;
  locale?: string;
}

const Calendar = ({ date, locale = defaultLocale }: CalendarProps) => {
  return (
    <CalendarContextProvider locale={locale} date={date}>
      <div>
        <Header />
        <CalendarBody />
      </div>
    </CalendarContextProvider>
  );
};

export default React.memo(Calendar);
