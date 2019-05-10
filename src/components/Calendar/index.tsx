import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { CalendarContextProvider } from '../../context/Calendar';
import CalendarBody from '../CalendarBody';
import Header from '../Header';

export interface CalendarProps {
  date?: Date | string;
  weekDays?: string[];
  weekStart?: number;
  locale?: string | string[];
  theme?: any;
  onChange?: (e: any) => void;
  style?: {
    day: React.CSSProperties;
    weekday: React.CSSProperties;
    body: React.CSSProperties;
    header: React.CSSProperties;
    headerButtons: React.CSSProperties;
  };
  showWeekNumbers?: boolean;
  parseDate?: (dateString: string | Date) => Date;
  formatDate?: (date: Date) => string;
}

const Calendar = ({
  date,
  locale,
  onChange,
  showWeekNumbers,
  parseDate,
}: CalendarProps) => {
  const parsedDate = React.useMemo(() => {
    if (!date) return undefined;
    if (parseDate) {
      return parseDate(date);
    }
    return date instanceof Date ? date : new Date(date);
  }, [parseDate, date]);

  return (
    <ThemeProvider theme={{}}>
      <CalendarContextProvider
        locale={locale}
        date={parsedDate}
        onChange={onChange}
      >
        <div>
          <Header />
          <CalendarBody showWeekNumbers={showWeekNumbers} />
        </div>
      </CalendarContextProvider>
    </ThemeProvider>
  );
};

export default React.memo(Calendar);
