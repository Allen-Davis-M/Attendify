
import React, { useState } from 'react';
import { UserData, DAYS, TimetableEntry, DayOfWeek } from '../types';

interface TimetableProps {
  data: UserData;
  onUpdate: (timetable: TimetableEntry[]) => void;
}

export const Timetable: React.FC<TimetableProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<TimetableEntry>>({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.subjectId || !newEntry.day || !newEntry.startTime || !newEntry.endTime) return;
    
    const entry: TimetableEntry = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: newEntry.subjectId,
      day: newEntry.day as DayOfWeek,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      room: newEntry.room
    };

    onUpdate([...data.timetable, entry]);
    setIsModalOpen(false);
  };

  const removeEntry = (id: string) => {
    onUpdate(data.timetable.filter(t => t.id !== id));
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Timetable</h2>
          <p className="text-slate-500">Organize your weekly lectures and labs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <span>Add Class</span>
        </button>
      </header>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] grid grid-cols-5 gap-4">
          {DAYS.map(day => (
            <div key={day} className="space-y-4">
              <div className="text-center py-2 font-bold text-slate-400 uppercase text-xs tracking-widest bg-slate-100 rounded-xl">
                {day}
              </div>
              <div className="space-y-3 min-h-[400px]">
                {data.timetable
                  .filter(t => t.day === day)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(entry => {
                    const subject = data.subjects.find(s => s.id === entry.subjectId);
                    return (
                      <div 
                        key={entry.id} 
                        className={`p-4 rounded-2xl group relative ${subject?.color || 'bg-slate-200'} text-white shadow-md hover:scale-105 transition-transform`}
                      >
                        <button 
                          onClick={() => removeEntry(entry.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-xs font-bold"
                        >
                          ✕
                        </button>
                        <p className="font-bold text-sm truncate">{subject?.name || 'Deleted'}</p>
                        <p className="text-[10px] opacity-80 mt-1">{entry.startTime} - {entry.endTime}</p>
                        {entry.room && (
                          <div className="mt-2 flex items-center gap-1 opacity-90">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[10px] font-medium">{entry.room}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Add Lecture</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newEntry.subjectId || ''}
                  onChange={e => setNewEntry({ ...newEntry, subjectId: e.target.value })}
                  required
                >
                  <option value="">Select a subject</option>
                  {data.subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Day</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newEntry.day}
                    onChange={e => setNewEntry({ ...newEntry, day: e.target.value as DayOfWeek })}
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Room (Optional)</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Hall 4"
                    value={newEntry.room || ''}
                    onChange={e => setNewEntry({ ...newEntry, room: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Start Time</label>
                  <input 
                    type="time"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newEntry.startTime}
                    onChange={e => setNewEntry({ ...newEntry, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">End Time</label>
                  <input 
                    type="time"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newEntry.endTime}
                    onChange={e => setNewEntry({ ...newEntry, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
