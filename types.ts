
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Subject {
  id: string;
  name: string;
  targetAttendance: number; // e.g., 75
  attended: number;
  total: number;
  color: string;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room?: string;
}

export interface UserData {
  subjects: Subject[];
  timetable: TimetableEntry[];
  settings: {
    globalTarget: number;
    userName: string;
  };
}

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 
  'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 
  'bg-cyan-500', 'bg-pink-500'
];
