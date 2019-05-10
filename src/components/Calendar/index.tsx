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
  locale?: string | string[];
  theme?: any;
  onChange?: () => {};
  style?: {
    day: React.CSSProperties;
    weekday: React.CSSProperties;
    body: React.CSSProperties;
    header: React.CSSProperties;
    headerButtons: React.CSSProperties;
  };
}

const Calendar = ({
  date,
  locale = defaultLocale,
  theme,
  onChange,
}: CalendarProps) => {
  const innerLocale = React.useMemo(() => {
    return locale ? Intl.getCanonicalLocales(locale) : defaultLocale;
  }, [locale]);

  const innerTheme = React.useMemo(
    () =>
      theme || {
        colors: {
          primary: 'red',
          secondary: 'blue',
        },
      },
    []
  );

  return (
    <ThemeProvider theme={innerTheme}>
      <CalendarContextProvider
        locale={innerLocale}
        date={date}
        onChange={onChange}
      >
        <div>
          <Header />
          <CalendarBody />
        </div>
      </CalendarContextProvider>
    </ThemeProvider>
  );
};

export default React.memo(Calendar);
