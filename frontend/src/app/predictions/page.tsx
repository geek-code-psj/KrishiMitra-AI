'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Wheat, IndianRupee, Target, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DISTRICTS, CROPS, SEASONS, COMMODITIES } from '@/lib/constants';

const districtOptions = DISTRICTS.map(d => ({ value: d, label: d }));
const cropOptions = CROPS.slice(0, 8).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
const seasonOptions = SEASONS.map(s => ({ value: s.value, label: s.label }));
const commodityOptions = COMMODITIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

const priceForecast = [
  { date: 'Feb 1', price: 2300, lower: 2200, upper: 2400 },
  { date: 'Feb 5', price: 2350, lower: 2240, upper: 2460 },
  { date: 'Feb 10', price: 2400, lower: 2280, upper: 2520 },
  { date: 'Feb 15', price: 2380, lower: 2250, upper: 2510 },
  { date: 'Feb 20', price: 2450, lower: 2310, upper: 2590 },
  { date: 'Feb 25', price: 2500, lower: 2350, upper: 2650 },
];

const cropPlan = [
  { crop: 'Rice (Paddy)', variety: 'MTU-1010', yield: 45, price: 2300, revenue: 103500, cost: 45000, profit: 58500, roi: 130, risk: 'medium' },
  { crop: 'Cotton', variety: 'Bt Cotton', yield: 12, price: 6500, revenue: 78000, cost: 35000, profit: 43000, roi: 123, risk: 'low' },
  { crop: 'Soybean', variety: 'JS-335', yield: 15, price: 4500, revenue: 67500, cost: 28000, profit: 39500, roi: 141, risk: 'medium' },
];

export default function PredictionsPage() {
  const [predictionType, setPredictionType] = useState<'yield' | 'price'>('yield');

  return (
    <div className="flex flex-col">
      <Header title="Yield & Price Predictions" />

      <div className="flex-1 p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={predictionType === 'yield' ? 'default' : 'outline'}
            onClick={() => setPredictionType('yield')}
          >
            <Wheat className="mr-2 h-4 w-4" />
            Yield Prediction
          </Button>
          <Button
            variant={predictionType === 'price' ? 'default' : 'outline'}
            onClick={() => setPredictionType('price')}
          >
            <IndianRupee className="mr-2 h-4 w-4" />
            Price Forecast
          </Button>
        </div>

        {predictionType === 'yield' ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Yield Prediction Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Predict Yield
                </CardTitle>
                <CardDescription>
                  Get AI-powered yield predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="Crop"
                    options={cropOptions}
                    placeholder="Select crop"
                  />
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
                  <Input
                    label="Area (acres)"
                    type="number"
                    placeholder="Enter area"
                  />
                  <Button className="w-full">
                    Predict Yield
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Yield Result */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-zinc-500">Predicted Yield</p>
                    <p className="text-2xl font-bold text-emerald-600">42 q/acre</p>
                    <p className="text-xs text-zinc-500">Total: 525 q</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-zinc-500">Historical Average</p>
                    <p className="text-2xl font-bold text-blue-600">35 q/acre</p>
                    <p className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" /> +20% above average
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <p className="text-sm text-zinc-500">Confidence</p>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-xs text-zinc-500">CI: 38-46 q</p>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <h4 className="mb-2 font-medium">Key Factors</h4>
                  <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <li>• Favorable monsoon forecast (+15%)</li>
                    <li>• Optimal soil moisture levels (+8%)</li>
                    <li>• Recommended fertilizer application (+5%)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Price Forecast Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-amber-600" />
                  Forecast Price
                </CardTitle>
                <CardDescription>
                  Get commodity price forecasts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="Commodity"
                    options={commodityOptions}
                    placeholder="Select commodity"
                  />
                  <Input
                    label="Market"
                    placeholder="e.g., Hyderabad"
                  />
                  <Select
                    label="Forecast Days"
                    options={[
                      { value: '7', label: '7 Days' },
                      { value: '30', label: '30 Days' },
                      { value: '90', label: '90 Days' },
                    ]}
                    placeholder="Select days"
                  />
                  <Button className="w-full">
                    Get Forecast
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Rice Price Forecast (₹/Quintal)</CardTitle>
                <CardDescription>30-day forecast with confidence bands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Current Price</p>
                    <p className="text-xl font-bold">₹2,300/q</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">30-Day Forecast</p>
                    <p className="flex items-center gap-1 text-lg font-bold text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      ₹2,500 (+8.7%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Best Selling Window</p>
                    <p className="text-sm font-medium">Feb 20-28</p>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceForecast}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[2100, 2800]} className="text-xs" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="transparent"
                        fill="#10b981"
                        fillOpacity={0.1}
                        name="Upper Bound"
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="transparent"
                        fill="white"
                        fillOpacity={1}
                        name="Lower Bound"
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981' }}
                        name="Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Crop Planning */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Optimal Crop Plan
            </CardTitle>
            <CardDescription>AI-generated recommendations based on yield, price, and risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Crop</th>
                    <th className="pb-3 text-left text-sm font-medium text-zinc-500">Variety</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Yield (q)</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Revenue</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Cost</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Profit</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">ROI</th>
                    <th className="pb-3 text-right text-sm font-medium text-zinc-500">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {cropPlan.map((plan, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-medium">{plan.crop}</td>
                      <td className="py-3 text-sm text-zinc-500">{plan.variety}</td>
                      <td className="py-3 text-right">{plan.yield}</td>
                      <td className="py-3 text-right">₹{plan.revenue.toLocaleString()}</td>
                      <td className="py-3 text-right">₹{plan.cost.toLocaleString()}</td>
                      <td className="py-3 text-right font-medium text-green-600">₹{plan.profit.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className="font-bold text-purple-600">{plan.roi}%</span>
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={plan.risk === 'low' ? 'success' : 'warning'}>
                          {plan.risk}
                        </Badge>
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