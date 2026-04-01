'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  BarChart3,
  ArrowRight,
  Bell,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { COMMODITIES } from '@/lib/constants';

const commodityOptions = COMMODITIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

const markets = [
  { name: 'Azadpur', city: 'Delhi', state: 'Delhi', price: 2450, trend: 'up' },
  { name: 'Vashi', city: 'Mumbai', state: 'Maharashtra', price: 2380, trend: 'down' },
  { name: 'Koyambedu', city: 'Chennai', state: 'Tamil Nadu', price: 2520, trend: 'up' },
  { name: 'Bowenpally', city: 'Hyderabad', state: 'Telangana', price: 2400, trend: 'stable' },
  { name: 'Bhatinda', city: 'Ludhiana', state: 'Punjab', price: 2350, trend: 'up' },
];

const priceHistory = [
  { date: 'Jan 1', price: 2100 },
  { date: 'Jan 8', price: 2150 },
  { date: 'Jan 15', price: 2200 },
  { date: 'Jan 22', price: 2180 },
  { date: 'Jan 29', price: 2250 },
  { date: 'Feb 5', price: 2300 },
  { date: 'Feb 12', price: 2350 },
  { date: 'Feb 19', price: 2400 },
  { date: 'Feb 26', price: 2450 },
];

const volatilityData = [
  { commodity: 'Onion', volatility: 'High', change: '+18%', status: 'alert' },
  { commodity: 'Tomato', volatility: 'High', change: '+15%', status: 'alert' },
  { commodity: 'Potato', volatility: 'Medium', change: '+5%', status: 'watch' },
  { commodity: 'Rice', volatility: 'Low', change: '+2%', status: 'normal' },
  { commodity: 'Wheat', volatility: 'Low', change: '-1%', status: 'normal' },
];

const priceAlerts = [
  { commodity: 'Onion', market: 'Azadpur', current: 2800, target: 2500, type: 'price_drop' },
  { commodity: 'Tomato', market: 'Vashi', current: 1800, target: 2000, type: 'price_rise' },
  { commodity: 'Potato', market: 'Bowenpally', current: 1200, target: 1400, type: 'price_rise' },
];

const weeklyPrices = [
  { day: 'Mon', price: 2350 },
  { day: 'Tue', price: 2380 },
  { day: 'Wed', price: 2400 },
  { day: 'Thu', price: 2420 },
  { day: 'Fri', price: 2400 },
  { day: 'Sat', price: 2430 },
  { day: 'Sun', price: 2450 },
];

export default function PricesPage() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'compare' | 'alerts'>('tracker');

  return (
    <div className="flex flex-col">
      <Header title="Krishi Dhan - Price Tracker" />

      <div className="flex-1 p-6">
        {/* Price Alert Banner */}
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                Price Volatility Alert - Onion & Tomato
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Prices have increased by 15-18% this week. Consider holding stock or selling early.
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View Analysis
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'tracker' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tracker')}
          >
            <IndianRupee className="mr-2 h-4 w-4" />
            Price Tracker
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'outline'}
            onClick={() => setActiveTab('compare')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Market Comparison
          </Button>
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell className="mr-2 h-4 w-4" />
            Price Alerts
          </Button>
        </div>

        {activeTab === 'tracker' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Search Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-amber-600" />
                  Track Prices
                </CardTitle>
                <CardDescription>
                  Real-time commodity prices from mandis
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
                    label="Market / Mandi"
                    placeholder="e.g., Azadpur, Delhi"
                  />
                  <Select
                    label="Period"
                    options={[
                      { value: '1d', label: 'Today' },
                      { value: '7d', label: 'Last 7 Days' },
                      { value: '30d', label: 'Last 30 Days' },
                      { value: '90d', label: 'Last 90 Days' },
                    ]}
                    placeholder="Select period"
                  />
                  <Button className="w-full">
                    Get Prices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Rice (Paddy) Price Trend</CardTitle>
                <CardDescription>
                  Price movement over last 60 days at Azadpur Mandi, Delhi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Current Price</p>
                    <p className="text-2xl font-bold">₹2,450/q</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">vs Last Week</p>
                    <p className="flex items-center gap-1 text-lg font-bold text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      +₹120 (+5.2%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Best Selling Window</p>
                    <p className="text-lg font-medium text-purple-600">Feb 20 - Mar 10</p>
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[2000, 2600]} className="text-xs" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.2}
                        name="Price (₹/q)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <p className="text-xs text-zinc-500">Min (60d)</p>
                    <p className="font-bold">₹2,100</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <p className="text-xs text-zinc-500">Max (60d)</p>
                    <p className="font-bold">₹2,520</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <p className="text-xs text-zinc-500">Avg (60d)</p>
                    <p className="font-bold">₹2,285</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <p className="text-xs text-zinc-500">Volatility</p>
                    <p className="font-bold text-green-600">Low</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="grid gap-6">
            {/* Market Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Market Price Comparison
                </CardTitle>
                <CardDescription>
                  Compare prices across major mandis to find the best deal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <Select
                    label="Commodity"
                    options={commodityOptions}
                    placeholder="Select commodity"
                  />
                  <Button>
                    Compare Markets
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">Market</th>
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">City</th>
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">State</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Price (₹/q)</th>
                        <th className="pb-3 text-center text-sm font-medium text-zinc-500">Trend</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets.map((market, i) => (
                        <tr
                          key={i}
                          className={`border-b border-zinc-100 dark:border-zinc-800 ${
                            i === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <td className="py-3 font-medium">
                            {market.name}
                            {i === 0 && (
                              <Badge variant="success" className="ml-2">
                                Best Price
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 text-zinc-600 dark:text-zinc-400">{market.city}</td>
                          <td className="py-3 text-zinc-600 dark:text-zinc-400">{market.state}</td>
                          <td className="py-3 text-right font-bold">₹{market.price.toLocaleString()}</td>
                          <td className="py-3 text-center">
                            {market.trend === 'up' && (
                              <span className="flex items-center justify-center text-green-600">
                                <TrendingUp className="h-4 w-4" />
                              </span>
                            )}
                            {market.trend === 'down' && (
                              <span className="flex items-center justify-center text-red-600">
                                <TrendingDown className="h-4 w-4" />
                              </span>
                            )}
                            {market.trend === 'stable' && (
                              <span className="flex items-center justify-center text-zinc-400">
                                <span className="h-1 w-6 rounded-full bg-zinc-400" />
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="outline" size="sm">
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Price Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Price Movement</CardTitle>
                <CardDescription>Last 7 days price at Azadpur Mandi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyPrices}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis domain={[2300, 2500]} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="price" fill="#f59e0b" name="Price (₹/q)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Price Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Your Price Alerts
                </CardTitle>
                <CardDescription>
                  Active alerts based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priceAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 rounded-lg border p-4 ${
                        alert.type === 'price_drop'
                          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                          : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          alert.type === 'price_drop'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        {alert.type === 'price_drop' ? (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {alert.commodity} - {alert.market}
                        </p>
                        <p className="text-sm text-zinc-500">
                          Current: ₹{alert.current} | Target: ₹{alert.target}
                        </p>
                      </div>
                      <Badge variant={alert.type === 'price_drop' ? 'destructive' : 'success'}>
                        {alert.type === 'price_drop' ? 'Drop Alert' : 'Rise Alert'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button className="mt-4 w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Create New Alert
                </Button>
              </CardContent>
            </Card>

            {/* Volatility Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Market Volatility Monitor
                </CardTitle>
                <CardDescription>
                  Track price volatility across commodities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {volatilityData.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            item.status === 'alert'
                              ? 'bg-red-500'
                              : item.status === 'watch'
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                        />
                        <span className="font-medium">{item.commodity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium ${
                            item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {item.change}
                        </span>
                        <Badge
                          variant={
                            item.volatility === 'High'
                              ? 'destructive'
                              : item.volatility === 'Medium'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {item.volatility}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Tracked Commodities</p>
                  <p className="text-xl font-bold">50+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Active Mandis</p>
                  <p className="text-xl font-bold">1,200+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Price Updates</p>
                  <p className="text-xl font-bold">Daily</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Forecast Accuracy</p>
                  <p className="text-xl font-bold">91.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}