
import React from 'react';
import { UserData, DAYS } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  data: UserData;
  onMarkAttendance: (id: string, present: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onMarkAttendance }) => {
  const today = DAYS[new Date().getDay() - 1] || 'Monday';
  const todaysClasses = data.timetable.filter(t => t.day === today);

  const totalAttended = data.subjects.reduce((acc, s) => acc + s.attended, 0);
  const totalConducted = data.subjects.reduce((acc, s) => acc + s.total, 0);
  const overallPercentage = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  const chartData = [
    { name: 'Attended', value: totalAttended },
    { name: 'Missed', value: totalConducted - totalAttended }
  ];

  const calculateBunks = (attended: number, total: number, target: number) => {
    if (total === 0) return { canBunk: 0, needToAttend: 0 };
    const r = target / 100;
    
    // Max missable
    const canBunk = Math.floor(attended / r - total);
    
    // Need to attend if below target
    const needToAttend = Math.ceil((r * total - attended) / (1 - r));
    
    return { 
      canBunk: Math.max(0, canBunk), 
      needToAttend: Math.max(0, needToAttend) 
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {data.settings.userName}!</h2>
          <p className="text-slate-500 mt-1">Here's your attendance summary for the semester.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-blue-500/5">
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{overallPercentage.toFixed(0)}%</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">Overall</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold">Performance Summary</h3>
            <p className="text-slate-500 text-sm">
              You've attended {totalAttended} out of {totalConducted} classes. 
              {overallPercentage >= data.settings.globalTarget 
                ? " You're on track! Keep it up to maintain your scholarship criteria."
                : " You're currently below your goal. Aim for the next few classes!"}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Classes</p>
                <p className="text-2xl font-bold">{totalConducted}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold uppercase">Attended</p>
                <p className="text-2xl font-bold text-blue-600">{totalAttended}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card - Today's Schedule */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Today's Tracker</h3>
            <span className="text-indigo-200 text-xs font-semibold uppercase">{today}</span>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {todaysClasses.length > 0 ? (
              todaysClasses.map(cls => {
                const sub = data.subjects.find(s => s.id === cls.subjectId);
                return (
                  <div key={cls.id} className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{sub?.name || 'Unknown'}</p>
                      <p className="text-xs text-indigo-100">{cls.startTime} - {cls.endTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onMarkAttendance(cls.subjectId, true)}
                        className="w-8 h-8 rounded-full bg-emerald-400/20 hover:bg-emerald-400 flex items-center justify-center text-emerald-100 hover:text-white transition-all"
                        title="Present"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => onMarkAttendance(cls.subjectId, false)}
                        className="w-8 h-8 rounded-full bg-rose-400/20 hover:bg-rose-400 flex items-center justify-center text-rose-100 hover:text-white transition-all"
                        title="Absent"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 opacity-60 italic text-sm">
                No classes scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subject Breakdown & Bunk Logic */}
      <div>
        <h3 className="text-xl font-bold mb-6">Subject Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.subjects.map(subject => {
            const { canBunk, needToAttend } = calculateBunks(subject.attended, subject.total, subject.targetAttendance);
            const percentage = subject.total > 0 ? (subject.attended / subject.total) * 100 : 0;
            const isCritical = percentage < subject.targetAttendance;

            return (
              <div key={subject.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-10 rounded-full ${subject.color}`}></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{subject.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">Target: {subject.targetAttendance}%</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${isCritical ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {percentage.toFixed(0)}%
                  </div>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-full transition-all duration-1000 ${subject.color}`} 
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-2xl flex flex-col items-center justify-center ${isCritical ? 'bg-slate-50 opacity-40' : 'bg-emerald-50/50 text-emerald-700'}`}>
                    <span className="text-[10px] font-bold uppercase">Can Bunk</span>
                    <span className="text-xl font-black">{isCritical ? '0' : canBunk}</span>
                  </div>
                  <div className={`p-3 rounded-2xl flex flex-col items-center justify-center ${!isCritical ? 'bg-slate-50 opacity-40' : 'bg-rose-50/50 text-rose-700'}`}>
                    <span className="text-[10px] font-bold uppercase">Must Attend</span>
                    <span className="text-xl font-black">{!isCritical ? '0' : needToAttend}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
