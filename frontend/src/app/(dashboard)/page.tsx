'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Droplets, TrendingUp, Wheat, AlertTriangle, Calendar, CloudRain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for charts
const yieldData = [
  { year: '2020', yield: 32 },
  { year: '2021', yield: 35 },
  { year: '2022', yield: 31 },
  { year: '2023', yield: 38 },
  { year: '2024', yield: 42 },
];

const priceData = [
  { month: 'Jan', rice: 2100, wheat: 2800 },
  { month: 'Feb', rice: 2150, wheat: 2750 },
  { month: 'Mar', rice: 2200, wheat: 2900 },
  { month: 'Apr', rice: 2180, wheat: 2850 },
  { month: 'May', rice: 2250, wheat: 2950 },
  { month: 'Jun', rice: 2300, wheat: 3000 },
];

const stats = [
  {
    title: 'Total Farms',
    value: '3',
    icon: Wheat,
    change: '+1 this year',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    title: 'Total Area',
    value: '12.5 acres',
    icon: TrendingUp,
    change: '+2.5 acres',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: 'Active Alerts',
    value: '2',
    icon: AlertTriangle,
    change: '1 high priority',
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    title: 'Pending Irrigation',
    value: '5',
    icon: Droplets,
    change: 'Due this week',
    color: 'text-cyan-600',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
];

const upcomingTasks = [
  { id: 1, task: 'Irrigation - Rice Field', date: 'Today, 6:00 AM', status: 'pending' },
  { id: 2, task: 'Fertilizer Application', date: 'Tomorrow, 7:00 AM', status: 'pending' },
  { id: 3, task: 'Weather Check', date: 'Today, 8:00 AM', status: 'completed' },
  { id: 4, task: 'Market Price Review', date: 'Feb 15, 10:00 AM', status: 'pending' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          {/* Yield Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Yield Trend (Quintals/Acre)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Price Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-amber-600" />
                Market Prices (₹/Quintal)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="rice" fill="#10b981" name="Rice" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wheat" fill="#f59e0b" name="Wheat" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks & Weather */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{task.task}</p>
                      <p className="text-sm text-zinc-500">{task.date}</p>
                    </div>
                    <Badge variant={task.status === 'completed' ? 'success' : 'warning'}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-cyan-600" />
                Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <CloudRain className="h-10 w-10 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">28°C</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Partly Cloudy</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Today</p>
                    <p className="text-xs text-zinc-500">Hyderabad</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                    <div key={day} className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800">
                      <p className="text-xs font-medium">{day}</p>
                      <p className="text-lg">{26 + i}°</p>
                      <p className="text-xs text-zinc-500">{['☁', '🌧', '☁', '☁'][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}