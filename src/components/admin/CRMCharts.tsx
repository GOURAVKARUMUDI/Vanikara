'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BRAND } from '@/lib/brandColors';

interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadsData: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueData: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversionData: any[];
}

const COLORS = [BRAND.blue, BRAND.orange, BRAND.gold, BRAND.cyan];
const GRID = 'var(--border-subtle)';
const TICK = { fontSize: 11, fill: BRAND.slate };

export default function CRMCharts({ leadsData, revenueData, conversionData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Leads Chart */}
      <div className="surface rounded-panel p-6 sm:p-8">
        <h3 className="mb-6 text-lg font-bold text-fg">Leads Over Time</h3>
        <div className="h-72 w-full relative">
          {(!leadsData || leadsData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-raised/60 backdrop-blur-[1px]">
              <div className="rounded-compact border border-line bg-surface-sunken px-4 py-2 text-xs font-semibold text-fg-muted">
                No data available yet
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={TICK} />
              <YAxis axisLine={false} tickLine={false} tick={TICK} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
              />
              <Line type="monotone" dataKey="count" stroke={BRAND.blue} strokeWidth={3} dot={{ r: 4, fill: BRAND.blue }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="surface rounded-panel p-6 sm:p-8">
        <h3 className="mb-6 text-lg font-bold text-fg">Revenue Analytics</h3>
        <div className="h-72 w-full relative">
          {(!revenueData || revenueData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-raised/60 backdrop-blur-[1px]">
              <div className="rounded-compact border border-line bg-surface-sunken px-4 py-2 text-xs font-semibold text-fg-muted">
                No data available yet
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={TICK} />
              <YAxis axisLine={false} tickLine={false} tick={TICK} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
              />
              <Bar dataKey="amount" fill={BRAND.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Chart */}
      <div className="surface rounded-panel p-6 sm:p-8 lg:col-span-2">
        <h3 className="mb-6 text-lg font-bold text-fg">Conversion Funnel</h3>
        <div className="h-72 w-full flex flex-col md:flex-row items-center gap-8 relative">
          {(!conversionData || conversionData.length === 0) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-raised/60 backdrop-blur-[1px]">
              <div className="rounded-compact border border-line bg-surface-sunken px-4 py-2 text-xs font-semibold text-fg-muted">
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
            {conversionData.map((item, _idx) => (
              <div key={item.name} className="rounded-card border border-line bg-surface-sunken p-4">
                <p className="mb-1 text-xs font-semibold text-fg-subtle">{item.name}</p>
                <p className="text-xl font-bold tabular-nums text-fg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
