'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

interface ChartProps {
  leadsData: any[];
  revenueData: any[];
  conversionData: any[];
}

const COLORS = ['#1E6BD6', '#FF7A00', '#FFC400', '#10b981'];

export default function CRMCharts({ leadsData, revenueData, conversionData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Leads Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Leads Over Time</h3>
        <div className="h-72 w-full relative">
          {(!leadsData || leadsData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                No data available yet
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#1E6BD6" strokeWidth={3} dot={{ r: 4, fill: '#1E6BD6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Revenue Analytics</h3>
        <div className="h-72 w-full relative">
          {(!revenueData || revenueData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                No data available yet
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" fill="#1E6BD6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Conversion Funnel</h3>
        <div className="h-72 w-full flex flex-col md:flex-row items-center gap-8 relative">
          {(!conversionData || conversionData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                No data available yet
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
            {conversionData.map((item, idx) => (
              <div key={item.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{item.name}</p>
                <p className="text-xl font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
