export function getWholePeriodOfTime(time,period)  {
    return time-time%period;
}