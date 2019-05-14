import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';
import {
  CalendarDispatchContext,
  LocaleContext,
  RtlContext,
  ShowWeekNumberContext,
  PageDateContext,
  SelectedDateContext,
  FocusDateContext,
  SelectedDateOnChangeContext,
  DateChangeHandler as BaseDateChangeHandler,
} from '../../context';
import CalendarBody from '../CalendarBody';
import Header from '../Header';
import { SET_GIVEN_DATE } from './actions';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from '../../utils/rtl-locales';
import reducer from './reducer';
import { isValid, startOfMonth, isSameDay } from 'date-fns/esm';

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

  const theme = React.useMemo(() => ({}), []);

  const [
    { pageDate, focusDate, selectedDate, givenDate },
    dispatch,
  ] = React.useReducer(reducer, {
    pageDate: startOfMonth(parsedDate || new Date()),
    focusDate: undefined,
    selectedDate: parsedDate,
    givenDate: parsedDate,
  });

  const innerLocale = React.useMemo(() => {
    return Intl.getCanonicalLocales(locale || defaultLocale);
  }, [locale]);

  const isRtl = React.useMemo(() => {
    return !!innerLocale.find((locale: string) => {
      return (
        rtlLocales.hasOwnProperty(locale) ||
        rtlLocales.hasOwnProperty(locale.split('-')[0])
      );
    });
  }, [innerLocale]);

  React.useEffect(() => {
    if (
      givenDate &&
      parsedDate &&
      isValid(parsedDate) &&
      !isSameDay(givenDate, parsedDate)
    ) {
      dispatch({ type: SET_GIVEN_DATE, date: parsedDate });
    }
  }, [givenDate && givenDate.getTime(), parsedDate && parsedDate.getTime()]);

  return (
    <ThemeProvider theme={theme}>
      <CalendarDispatchContext.Provider value={dispatch}>
        <LocaleContext.Provider value={innerLocale}>
          <RtlContext.Provider value={isRtl}>
            <ShowWeekNumberContext.Provider value={showWeekNumbers}>
              <PageDateContext.Provider value={pageDate}>
                <SelectedDateContext.Provider value={selectedDate}>
                  <FocusDateContext.Provider value={focusDate}>
                    <SelectedDateOnChangeContext.Provider value={onChange}>
                      <ErrorBoundary date={parsedDate}>
                        <div>
                          <Header />
                          <CalendarBody />
                        </div>
                      </ErrorBoundary>
                    </SelectedDateOnChangeContext.Provider>
                  </FocusDateContext.Provider>
                </SelectedDateContext.Provider>
              </PageDateContext.Provider>
            </ShowWeekNumberContext.Provider>
          </RtlContext.Provider>
        </LocaleContext.Provider>
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

export default React.memo(Calendar);
