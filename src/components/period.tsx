import { FiCalendar } from 'react-icons/fi';

export function Period({ value }: { value: string }) {
  const label = value.replace('–atual', ' até o momento').replace('–', ' a ');
  return <span className="career-period"><FiCalendar aria-hidden="true"/><span>{label}</span></span>;
}
