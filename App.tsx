
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Timetable } from './components/Timetable';
import { Subjects } from './components/Subjects';
import { Navigation } from './components/Navigation';
import { UserData, Subject, TimetableEntry } from './types';

const INITIAL_DATA: UserData = {
  subjects: [
    { id: '1', name: 'Mathematics', targetAttendance: 75, attended: 12, total: 15, color: 'bg-blue-500' },
    { id: '2', name: 'Physics', targetAttendance: 75, attended: 10, total: 15, color: 'bg-purple-500' },
  ],
  timetable: [
    { id: 't1', subjectId: '1', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 302' },
    { id: 't2', subjectId: '2', day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Lab B' },
  ],
  settings: {
    globalTarget: 75,
    userName: 'Alex'
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timetable' | 'subjects'>('dashboard');
  const [data, setData] = useState<UserData>(() => {
    const saved = localStorage.getItem('attendify_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('attendify_data', JSON.stringify(data));
  }, [data]);

  const updateSubjects = (newSubjects: Subject[]) => {
    setData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const updateTimetable = (newTimetable: TimetableEntry[]) => {
    setData(prev => ({ ...prev, timetable: newTimetable }));
  };

  const markAttendance = (subjectId: string, present: boolean) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => 
        s.id === subjectId 
          ? { ...s, attended: s.attended + (present ? 1 : 0), total: s.total + 1 }
          : s
      )
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 md:pl-64">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userName={data.settings.userName} />
      
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            data={data} 
            onMarkAttendance={markAttendance} 
          />
        )}
        {activeTab === 'timetable' && (
          <Timetable 
            data={data} 
            onUpdate={updateTimetable} 
          />
        )}
        {activeTab === 'subjects' && (
          <Subjects 
            subjects={data.subjects} 
            onUpdate={updateSubjects} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
