import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';
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
  const innerLocale = React.useMemo(() => {
    return locale ? Intl.getCanonicalLocales(locale) : undefined;
  }, [locale]);
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: 'red',
          secondary: 'blue',
        },
      }}
    >
      <CalendarContextProvider locale={innerLocale} date={date}>
        <div>
          <Header />
          <CalendarBody />
        </div>
      </CalendarContextProvider>
    </ThemeProvider>
  );
};

export default React.memo(Calendar);
