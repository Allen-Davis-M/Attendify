
import React, { useState } from 'react';
import { Subject, COLORS } from '../types';

interface SubjectsProps {
  subjects: Subject[];
  onUpdate: (subjects: Subject[]) => void;
}

export const Subjects: React.FC<SubjectsProps> = ({ subjects, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    targetAttendance: 75,
    attended: 0,
    total: 0,
    color: COLORS[0]
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) return;

    const subject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubject.name,
      targetAttendance: newSubject.targetAttendance || 75,
      attended: newSubject.attended || 0,
      total: newSubject.total || 0,
      color: newSubject.color || COLORS[0]
    };

    onUpdate([...subjects, subject]);
    setIsModalOpen(false);
    setNewSubject({ name: '', targetAttendance: 75, attended: 0, total: 0, color: COLORS[0] });
  };

  const deleteSubject = (id: string) => {
    onUpdate(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Subjects</h2>
          <p className="text-slate-500">Manage your course catalog and goals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <span>Add Subject</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm group hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl ${subject.color} flex items-center justify-center text-white font-bold text-xl`}>
                  {subject.name[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{subject.name}</h4>
                  <p className="text-sm text-slate-400">Target: {subject.targetAttendance}% • Current: {subject.total > 0 ? ((subject.attended/subject.total)*100).toFixed(1) : 0}%</p>
                </div>
              </div>
              <button 
                onClick={() => deleteSubject(subject.id)}
                className="text-slate-300 hover:text-rose-500 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6 flex gap-3">
              <div className="flex-1 bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Attended</p>
                <p className="text-xl font-bold">{subject.attended}</p>
              </div>
              <div className="flex-1 bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
                <p className="text-xl font-bold">{subject.total}</p>
              </div>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-medium italic">No subjects added yet. Start by adding your first course!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in-95">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Create Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject Name</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Computer Science"
                  value={newSubject.name}
                  onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newSubject.targetAttendance}
                    onChange={e => setNewSubject({ ...newSubject, targetAttendance: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setNewSubject({ ...newSubject, color: c })}
                        className={`w-8 h-8 rounded-full ${c} ${newSubject.color === c ? 'ring-4 ring-slate-100' : ''}`}
                      />
                    ))}
                  </div>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
