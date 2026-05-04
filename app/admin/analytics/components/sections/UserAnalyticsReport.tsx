"use client"

import React from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Brush
} from "recharts"
import { dataUsageFacultyData } from "@/app/admin/lib/mock-data"

interface UserAnalyticsReportProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

export default function UserAnalyticsReport({ isDark, chartTextColor, gridColor }: UserAnalyticsReportProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#111827] p-8 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
             <h4 className="font-medium text-slate-800 dark:text-white text-lg mb-8 tracking-widest text-[11px]">User Concentration by Faculty</h4>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={dataUsageFacultyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                      <XAxis dataKey="faculty" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 13, fontWeight: 500 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 13, fontWeight: 500 }} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                      <Bar dataKey="users" fill="#0288f4" radius={[6, 6, 0, 0]} barSize={40} />
                      <Brush dataKey="faculty" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} dy={20} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white dark:bg-[#111827] p-8 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
             <h4 className="font-medium text-slate-800 dark:text-white text-lg mb-8 tracking-widest text-[11px]">Active vs Inactive Users</h4>
             <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={[
                           { name: 'Active', value: 850, color: '#0288f4' },
                           { name: 'Inactive', value: 150, color: '#e2e8f0' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                         <Cell fill="#0288f4" />
                         <Cell fill="#e2e8f0" />
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                   <p className="text-[10px] font-medium text-slate-400">Retention</p>
                   <p className="text-xl font-medium text-slate-800 dark:text-white">85%</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
