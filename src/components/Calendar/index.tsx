/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { isValid, startOfMonth, startOfDay } from 'date-fns/esm';
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
  date?: Date | number;
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
  forwardedRef,
}: CalendarProps & { forwardedRef?: any }) => {
  const theme = {};

  const time = date && startOfDay(date).getTime();

  const [{ pageDate, focusDate, selectedDate }, dispatch] = React.useReducer(
    reducer,
    {
      pageDate: startOfMonth(time || new Date()).getTime(),
      focusDate: undefined,
      selectedDate: time || undefined,
    }
  );
  const lastSelectedDate = React.useRef(selectedDate);

  React.useEffect(() => {
    if (time && isValid(time)) {
      dispatch({ type: SET_GIVEN_DATE, date: time });
    }
  }, [time]);

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
                  <ErrorBoundary date={time}>
                    <div
                      ref={forwardedRef}
                      css={(_theme: any) => css`
                        border: 1px solid black;
                      `}
                    >
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
    return hasError ? 'An invalid date has been passed in' : children;
  }
}

(Calendar as any).displayName = 'Calendar';

const ForwardRefCalendar = React.forwardRef<any, any>((props, ref) => (
  <Calendar forwardedRef={ref} {...props} />
));

ForwardRefCalendar.displayName = `ForwardRefCalendar(${
  (Calendar as any).displayName
})`;

export default ForwardRefCalendar;
