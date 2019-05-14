import { isValid, startOfMonth } from 'date-fns/esm';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import {
  CalendarDispatchContext,
  DateChangeHandler as BaseDateChangeHandler,
  FocusDateContext,
  PageDateContext,
  SelectedDateContext,
  SelectedDateOnChangeContext,
  ShowWeekNumberContext,
} from '../../context';
import CalendarBody from '../CalendarBody';
import Header from '../Header';
import { SET_GIVEN_DATE } from './actions';
import reducer from './reducer';
export interface DateChangeHandler extends BaseDateChangeHandler {}
export interface CalendarProps {
  date?: Date | string;
  weekDays?: string[];
  weekStart?: number;
  locale?: string | string[];
  theme?: any;
  onChange?: DateChangeHandler;
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
  onChange,
  showWeekNumbers,
  parseDate,
  forwardedRef,
}: CalendarProps & { forwardedRef?: any }) => {
  const parsedDate = React.useMemo(() => {
    if (!date) return undefined;
    if (parseDate) {
      return parseDate(date).getTime();
    }
    return (date instanceof Date ? date : new Date(date)).getTime();
  }, [parseDate, date]);

  const theme = React.useMemo(() => ({}), []);

  const [{ pageDate, focusDate, selectedDate }, dispatch] = React.useReducer(
    reducer,
    {
      pageDate: startOfMonth(parsedDate || new Date()).getTime(),
      focusDate: undefined,
      selectedDate: parsedDate,
    }
  );
  const lastSelectedDate = React.useRef(selectedDate);

  React.useEffect(() => {
    if (parsedDate && isValid(parsedDate)) {
      dispatch({ type: SET_GIVEN_DATE, date: parsedDate });
    }
  }, [parsedDate]);

  React.useEffect(() => {
    if (onChange && lastSelectedDate.current !== selectedDate) {
      lastSelectedDate.current = selectedDate;
      onChange({ value: selectedDate ? new Date(selectedDate) : undefined });
    }
  }, [selectedDate, onChange]);

  return (
    <ThemeProvider theme={theme}>
      <CalendarDispatchContext.Provider value={dispatch}>
        <ShowWeekNumberContext.Provider value={showWeekNumbers}>
          <PageDateContext.Provider value={pageDate}>
            <SelectedDateContext.Provider value={selectedDate}>
              <FocusDateContext.Provider value={focusDate}>
                <SelectedDateOnChangeContext.Provider value={onChange}>
                  <ErrorBoundary date={parsedDate}>
                    <div ref={forwardedRef}>
                      <Header />
                      <CalendarBody />
                    </div>
                  </ErrorBoundary>
                </SelectedDateOnChangeContext.Provider>
              </FocusDateContext.Provider>
            </SelectedDateContext.Provider>
          </PageDateContext.Provider>
        </ShowWeekNumberContext.Provider>
      </CalendarDispatchContext.Provider>
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

(Calendar as any).displayName = 'Calendar';

const ForwardRefCalendar = React.forwardRef<any, any>((props, ref) => (
  <Calendar forwardedRef={ref} {...props} />
));

ForwardRefCalendar.displayName = `ForwardRefCalendar(${
  (Calendar as any).displayName
})`;

const MemoForwardRef = React.memo(ForwardRefCalendar);
MemoForwardRef.displayName = `Memo(${ForwardRefCalendar.displayName})`;
export default MemoForwardRef;
