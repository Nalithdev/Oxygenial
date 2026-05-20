import { useState, useMemo } from 'react';

export type CalendarDay = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
};

function toLocalKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function useCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const monthLabel = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentYear, currentMonth]);

  const days = useMemo<CalendarDay[]>(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

    const result: CalendarDay[] = [];

    for (let i = 0; i < totalCells; i++) {
      let dayNumber: number;
      let year = currentYear;
      let month = currentMonth;
      let isCurrentMonth = true;

      if (i < offset) {
        dayNumber = daysInPrev - offset + 1 + i;
        month = currentMonth - 1;
        if (month < 0) {
          month = 11;
          year--;
        }
        isCurrentMonth = false;
      } else if (i >= offset + daysInMonth) {
        dayNumber = i - offset - daysInMonth + 1;
        month = currentMonth + 1;
        if (month > 11) {
          month = 0;
          year++;
        }
        isCurrentMonth = false;
      } else {
        dayNumber = i - offset + 1;
      }

      const date = new Date(year, month, dayNumber);
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      const dow = date.getDay();
      const isWeekend = dow === 0 || dow === 6;

      result.push({ date, dayNumber, isCurrentMonth, isToday, isWeekend });
    }

    return result;
  }, [currentYear, currentMonth]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  }

  function goToToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }

  return {
    days,
    monthLabel,
    prevMonth,
    nextMonth,
    goToToday,
    currentYear,
    currentMonth,
    toLocalKey,
  };
}

export function groupBookingsByDate<T extends { scheduledAt: string | Date }>(
  bookings: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  bookings.forEach((b) => {
    const d = new Date(b.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(b);
  });
  return map;
}
