import * as React from 'react';
import { useWeekdays, useShowWeekNumbers } from '../../context/Calendar';
import Weekday from '../Weekday';

const Weekdays = () => {
  const showWeekNumbers = useShowWeekNumbers();
  const weekDays = useWeekdays();

  return (
    <tr>
      {showWeekNumbers && <th />}
      {weekDays.map((v, i) => {
        return (
          <th key={v}>
            <Weekday dayNumber={i}>{v}</Weekday>
          </th>
        );
      })}
    </tr>
  );
};

export default React.memo(Weekdays);
