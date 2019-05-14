import { isSameDay, isValid, startOfMonth } from 'date-fns/esm';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import {
  CalendarDispatchContext,
  DateChangeHandler as BaseDateChangeHandler,
  FocusDateContext,
  LocaleContext,
  PageDateContext,
  RtlContext,
  SelectedDateContext,
  SelectedDateOnChangeContext,
  ShowWeekNumberContext,
} from '../../context';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from '../../utils/rtl-locales';
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
  locale,
  onChange,
  showWeekNumbers,
  parseDate,
}: CalendarProps) => {
  const parsedDate = React.useMemo(() => {
    if (!date) return undefined;
    if (parseDate) {
      return parseDate(date).getTime();
    }
    return (date instanceof Date ? date : new Date(date)).getTime();
  }, [parseDate, date]);

  const theme = React.useMemo(() => ({}), []);

  const [
    { pageDate, focusDate, selectedDate, givenDate },
    dispatch,
  ] = React.useReducer(reducer, {
    pageDate: startOfMonth(parsedDate || new Date()).getTime(),
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
  }, [givenDate, parsedDate]);

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
