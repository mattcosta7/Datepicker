import * as React from 'react';
import { createPortal } from 'react-dom';
import Calendar from '../Calendar';
import { LocaleContext, RtlContext } from '../../context';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from '../../utils/rtl-locales';

const Input = ({ locale, date, showWeekNumbers }: any) => {
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

  const [{ currentDate, inputDate = '' }, setState] = React.useState<any>({
    currentDate: date,
    inputDate: date || '',
  });

  const onBlur = React.useCallback(
    e => {
      if (e.target instanceof HTMLInputElement) {
        const { value } = e.target;
        setState(s => ({
          ...s,
          currentDate: value,
          inputDate: value,
        }));
      }
    },
    [setState]
  );

  const onKeyDown = React.useCallback(
    e => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onBlur(e);
          return;
      }
    },
    [onBlur]
  );

  const onChange = React.useCallback(
    e => {
      if (e.target instanceof HTMLInputElement) {
        const { value } = e.target;
        setState(s => ({
          ...s,
          inputDate: value,
        }));
      }
    },
    [setState]
  );

  return (
    <LocaleContext.Provider value={innerLocale}>
      <RtlContext.Provider value={isRtl}>
        <input
          name="inputDate"
          value={
            inputDate instanceof Date
              ? new Intl.DateTimeFormat(innerLocale).format(inputDate as Date)
              : inputDate
          }
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {createPortal(
          <Calendar
            locale={locale}
            date={currentDate}
            showWeekNumbers={!!showWeekNumbers}
            onChange={(e: any) => {
              if (e.value) {
                setState(s => ({
                  ...s,
                  currentDate: e.value,
                  inputDate: e.value,
                }));
              }
            }}
            parseDate={s => {
              if (s instanceof Date) {
                return s;
              }
              const d = s.split('/');
              return new Date(
                parseInt(d[2], 10),
                parseInt(d[0], 10) - 1,
                parseInt(d[1], 10)
              );
            }}
          />,
          document.body
        )}
      </RtlContext.Provider>
    </LocaleContext.Provider>
  );
};

export default React.memo(Input);
