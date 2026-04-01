'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  Cloud,
  CloudRain,
  Thermometer,
  Wheat,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Droplets,
  Sun,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DISTRICTS, SEASONS } from '@/lib/constants';

const districtOptions = DISTRICTS.map((d) => ({ value: d, label: d }));
const seasonOptions = SEASONS.map((s) => ({ value: s.value, label: s.label }));

const riskOptions = [
  { value: 'drought', label: 'Drought' },
  { value: 'flood', label: 'Flood' },
  { value: 'heat', label: 'Heat Wave' },
];

const climateData = [
  { month: 'Jan', temp: 18, rainfall: 15, humidity: 65 },
  { month: 'Feb', temp: 22, rainfall: 10, humidity: 55 },
  { month: 'Mar', temp: 28, rainfall: 25, humidity: 50 },
  { month: 'Apr', temp: 32, rainfall: 45, humidity: 48 },
  { month: 'May', temp: 35, rainfall: 80, humidity: 55 },
  { month: 'Jun', temp: 33, rainfall: 120, humidity: 70 },
  { month: 'Jul', temp: 30, rainfall: 180, humidity: 80 },
  { month: 'Aug', temp: 29, rainfall: 170, humidity: 82 },
  { month: 'Sep', temp: 28, rainfall: 100, humidity: 75 },
  { month: 'Oct', temp: 26, rainfall: 60, humidity: 70 },
  { month: 'Nov', temp: 22, rainfall: 25, humidity: 68 },
  { month: 'Dec', temp: 18, rainfall: 10, humidity: 65 },
];

const cropRecommendations = [
  {
    crop: 'Rice (Paddy)',
    variety: 'CR Dhan 310',
    resilience: 'Flood Tolerant',
    yieldPotential: '22-24 q/acre',
    description: 'Tolerates 10 days submergence, suitable for low-lying areas',
   适宜区域: 'Bihar, West Bengal, Odisha',
    icon: Droplets,
  },
  {
    crop: 'Maize',
    variety: 'DHM 117',
    resilience: 'Drought Tolerant',
    yieldPotential: '28-32 q/acre',
    description: 'Suitable for water-scarce areas, heat resistant',
   适宜区域: 'Maharashtra, Karnataka, Andhra Pradesh',
    icon: Sun,
  },
  {
    crop: 'Pearl Millet (Bajra)',
    variety: 'HHB 67',
    resilience: 'Drought Tolerant',
    yieldPotential: '18-20 q/acre',
    description: 'Very low water requirement, thrives in arid conditions',
   适宜区域: 'Rajasthan, Gujarat, Haryana',
    icon: Thermometer,
  },
  {
    crop: 'Soybean',
    variety: 'JS-335',
    resilience: 'Moderate',
    yieldPotential: '15-18 q/acre',
    description: 'Good nitrogen fixation, short duration variety',
   适宜区域: 'Madhya Pradesh, Maharashtra',
    icon: Leaf,
  },
];

const riskAssessment = [
  {
    type: 'Drought',
    probability: 'Low',
    impact: 'Medium',
    probabilityLevel: 2,
    mitigation: 'Drip irrigation, drought-tolerant variety',
    icon: Cloud,
  },
  {
    type: 'Flood',
    probability: 'Medium',
    impact: 'High',
    probabilityLevel: 3,
    mitigation: 'Elevated nursery, flood-tolerant variety',
    icon: CloudRain,
  },
  {
    type: 'Heat Wave',
    probability: 'High',
    impact: 'Medium',
    probabilityLevel: 4,
    mitigation: 'Mulching, light irrigation during peak hours',
    icon: Thermometer,
  },
];

export default function ClimatePage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'risks' | 'weather'>('recommendations');

  return (
    <div className="flex flex-col">
      <Header title="Climate Guide" />

      <div className="flex-1 p-6">
        {/* Climate Alert Banner */}
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Heat Wave Warning - May 2026
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Temperature expected to rise 3-5°C above normal. Consider early sowing and mulching.
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('recommendations')}
          >
            <Wheat className="mr-2 h-4 w-4" />
            Crop Recommendations
          </Button>
          <Button
            variant={activeTab === 'risks' ? 'default' : 'outline'}
            onClick={() => setActiveTab('risks')}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Risk Assessment
          </Button>
          <Button
            variant={activeTab === 'weather' ? 'default' : 'outline'}
            onClick={() => setActiveTab('weather')}
          >
            <Cloud className="mr-2 h-4 w-4" />
            Weather Trends
          </Button>
        </div>

        {activeTab === 'recommendations' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Filter Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Find Suitable Crops
                </CardTitle>
                <CardDescription>
                  Get climate-resilient recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="District"
                    options={districtOptions}
                    placeholder="Select district"
                  />
                  <Select
                    label="Season"
                    options={seasonOptions}
                    placeholder="Select season"
                  />
                  <Select
                    label="Primary Risk Concern"
                    options={riskOptions}
                    placeholder="Select risk type"
                  />
                  <Button className="w-full">
                    Get Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recommended Crops for Kharif 2026</CardTitle>
                <CardDescription>
                  Based on climate patterns and soil conditions for your district
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cropRecommendations.map((crop, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <crop.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{crop.crop}</h4>
                            <p className="text-sm text-zinc-500">{crop.variety}</p>
                          </div>
                          <Badge variant="success">{crop.resilience}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {crop.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-zinc-500">
                            <span className="font-medium">Yield:</span> {crop.yieldPotential}
                          </span>
                          <span className="text-zinc-500">
                            <span className="font-medium">Best in:</span> {crop.适宜区域}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Risk Filter */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Climate Risk Assessment
                </CardTitle>
                <CardDescription>
                  Analyze climate risks for your crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="District"
                    options={districtOptions}
                    placeholder="Select district"
                  />
                  <Select
                    label="Crop"
                    options={[
                      { value: 'rice', label: 'Rice' },
                      { value: 'wheat', label: 'Wheat' },
                      { value: 'maize', label: 'Maize' },
                      { value: 'soybean', label: 'Soybean' },
                    ]}
                    placeholder="Select crop"
                  />
                  <Button className="w-full">
                    Analyze Risks
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Risk Analysis for Rice - Patna District</CardTitle>
                <CardDescription>
                  Overall Risk Level: <span className="font-medium text-amber-600">Medium</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment.map((risk, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <risk.icon className="h-5 w-5 text-zinc-600" />
                          <div>
                            <h4 className="font-medium">{risk.type}</h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm text-zinc-500">
                                Probability:{' '}
                                <span
                                  className={`font-medium ${
                                    risk.probabilityLevel >= 4
                                      ? 'text-red-600'
                                      : risk.probabilityLevel >= 3
                                      ? 'text-amber-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {risk.probability}
                                </span>
                              </span>
                              <span className="text-zinc-300">|</span>
                              <span className="text-sm text-zinc-500">
                                Impact: {risk.impact}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            risk.impact === 'High'
                              ? 'destructive'
                              : risk.impact === 'Medium'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="mt-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium">Mitigation:</span> {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adaptation Plan */}
                <div className="mt-6 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                    Climate Adaptation Plan
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Shift to drought-tolerant rice varieties (CR Dhan 310)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Install drip irrigation system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Create water harvesting structures
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                    Estimated Investment: <span className="font-medium">₹45,000</span> | Expected Water Savings:{' '}
                    <span className="font-medium">20%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="grid gap-6">
            {/* Weather Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Weather Trends - Patna District</CardTitle>
                <CardDescription>Historical climate data for the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="col-span-2 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={climateData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis yAxisId="left" className="text-xs" />
                        <YAxis yAxisId="right" orientation="right" className="text-xs" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="temp"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Temperature (°C)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rainfall"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Rainfall (mm)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={climateData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="humidity" fill="#8b5cf6" name="Humidity (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                    <p className="text-sm text-zinc-500">Avg Temperature</p>
                    <p className="text-2xl font-bold text-amber-600">27°C</p>
                    <p className="text-xs text-zinc-500">Annual average</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-zinc-500">Total Rainfall</p>
                    <p className="text-2xl font-bold text-blue-600">860mm</p>
                    <p className="text-xs text-zinc-500">Annual total</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <p className="text-sm text-zinc-500">Avg Humidity</p>
                    <p className="text-2xl font-bold text-purple-600">65%</p>
                    <p className="text-xs text-zinc-500">Annual average</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-zinc-500">Growing Days</p>
                    <p className="text-2xl font-bold text-emerald-600">210</p>
                    <p className="text-xs text-zinc-500">Frost-free days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variety Database */}
            <Card>
              <CardHeader>
                <CardTitle>Certified Seed Varieties Database</CardTitle>
                <CardDescription>Climate-smart varieties for different conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">Variety</th>
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">Crop</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Duration</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Yield/q/acre</th>
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">Key Traits</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-3 font-medium">IR64</td>
                        <td className="py-3">Rice</td>
                        <td className="py-3 text-right">110 days</td>
                        <td className="py-3 text-right">22</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Badge variant="success">High Yielding</Badge>
                            <Badge variant="outline">Disease Resistant</Badge>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-3 font-medium">HD-2967</td>
                        <td className="py-3">Wheat</td>
                        <td className="py-3 text-right">140 days</td>
                        <td className="py-3 text-right">20</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Badge variant="outline">Rust Resistant</Badge>
                            <Badge variant="outline">High Protein</Badge>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-3 font-medium">DHM 117</td>
                        <td className="py-3">Maize</td>
                        <td className="py-3 text-right">95 days</td>
                        <td className="py-3 text-right">28</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Badge variant="success">Drought Tolerant</Badge>
                            <Badge variant="outline">Heat Tolerant</Badge>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">HHB 67</td>
                        <td className="py-3">Bajra</td>
                        <td className="py-3 text-right">75 days</td>
                        <td className="py-3 text-right">18</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Badge variant="success">Drought Tolerant</Badge>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}