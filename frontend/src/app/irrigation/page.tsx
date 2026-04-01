'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Droplets, Calendar, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DISTRICTS, CROPS, SOIL_TYPES, CROP_STAGES } from '@/lib/constants';

const districtOptions = DISTRICTS.map(d => ({ value: d, label: d }));
const cropOptions = CROPS.slice(0, 6).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
const soilOptions = SOIL_TYPES.map(s => ({ value: s.value, label: s.label }));
const stageOptions = CROP_STAGES.map(s => ({ value: s.value, label: s.label }));

const moistureData = [
  { date: 'Jan 1', moisture: 28 },
  { date: 'Jan 5', moisture: 25 },
  { date: 'Jan 10', moisture: 22 },
  { date: 'Jan 15', moisture: 18 },
  { date: 'Jan 20', moisture: 15 },
  { date: 'Jan 25', moisture: 12 },
  { date: 'Jan 30', moisture: 20 },
];

const schedule = [
  { date: 'Feb 1', time: '06:00 AM', duration: 45, water: 4500, status: 'scheduled' },
  { date: 'Feb 3', time: '06:00 AM', duration: 40, water: 4000, status: 'scheduled' },
  { date: 'Feb 5', time: '06:00 AM', duration: 50, water: 5000, status: 'scheduled' },
  { date: 'Feb 7', time: '06:00 AM', duration: 45, water: 4500, status: 'pending' },
  { date: 'Feb 9', time: '06:00 AM', duration: 40, water: 4000, status: 'pending' },
];

const alerts = [
  { id: 1, type: 'drought', severity: 'high', message: 'Soil moisture below critical level in your area' },
  { id: 2, type: 'rain', severity: 'low', message: 'Rain expected on Feb 8 - consider postponing irrigation' },
];

export default function IrrigationPage() {
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');

  return (
    <div className="flex flex-col">
      <Header title="Smart Irrigation" />

      <div className="flex-1 p-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 rounded-lg p-4 ${
                  alert.severity === 'high'
                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                }`}
              >
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="flex-1 text-sm">{alert.message}</p>
                <Badge variant={alert.severity === 'high' ? 'danger' : 'warning'}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Generate Schedule */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Generate Schedule
              </CardTitle>
              <CardDescription>
                Create irrigation schedule for your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  label="District"
                  options={districtOptions}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Select district"
                />
                <Select
                  label="Crop"
                  options={cropOptions}
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="Select crop"
                />
                <Select
                  label="Soil Type"
                  options={soilOptions}
                  placeholder="Select soil type"
                />
                <Select
                  label="Crop Stage"
                  options={stageOptions}
                  placeholder="Select stage"
                />
                <Input
                  label="Area (acres)"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area"
                />
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Moisture Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                Soil Moisture Trend
              </CardTitle>
              <CardDescription>Last 30 days - VIC Model Data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Current Level</p>
                  <p className="text-2xl font-bold text-blue-600">20% (Low)</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Average</p>
                  <p className="text-lg font-semibold">23%</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Trend</p>
                  <p className="flex items-center gap-1 text-sm font-medium text-red-600">
                    <TrendingUp className="h-4 w-4" />
                    Decreasing
                  </p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moistureData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 40]} className="text-xs" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="moisture"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Moisture %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Irrigation Schedule</CardTitle>
            <CardDescription>7-day irrigation plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Time</th>
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Duration (min)</th>
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Water (L)</th>
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Status</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 text-sm">{item.date}</td>
                      <td className="py-3 text-sm">{item.time}</td>
                      <td className="py-3 text-sm">{item.duration}</td>
                      <td className="py-3 text-sm">{item.water.toLocaleString()}</td>
                      <td className="py-3">
                        <Badge variant={item.status === 'scheduled' ? 'success' : 'default'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">
                          Mark Done
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}