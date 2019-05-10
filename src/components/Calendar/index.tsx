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
        <ErrorBoundary date={parsedDate}>
          <div>
            <Header />
            <CalendarBody showWeekNumbers={showWeekNumbers} />
          </div>
        </ErrorBoundary>
      </CalendarContextProvider>
    </ThemeProvider>
  );
};

class ErrorBoundary extends React.PureComponent<any, any> {
  state = {
    hasError: undefined,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, info: any) {
    console.log({ error, info });
  }

  componentDidUpdate(lastProps: any) {
    if (this.state.hasError && lastProps.date !== this.props.date) {
      this.setState({
        hasError: undefined,
      });
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    return <>{hasError ? 'An invalid date has been passed in' : children}</>;
  }
}

export default React.memo(Calendar);
