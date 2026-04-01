'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  CreditCard,
  MapPin,
  Building2,
  Truck,
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Warehouse,
  Store,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { DISTRICTS, CROPS } from '@/lib/constants';

const districtOptions = DISTRICTS.map((d) => ({ value: d, label: d }));
const cropOptions = CROPS.slice(0, 8).map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

const schemes = [
  {
    name: 'Kisan Credit Card (KCC)',
    amount: 'Up to ₹3 lakh',
    interest: '4% p.a.',
    eligibility: 'All farmers with land',
    status: 'eligible',
    description: 'Quick credit for crop cultivation, animal husbandry, and fishery',
  },
  {
    name: 'PM-KISAN',
    amount: '₹6,000/year',
    interest: 'N/A',
    eligibility: 'Small & marginal farmers',
    status: 'eligible',
    description: 'Direct income support to farmer families',
  },
  {
    name: 'Agricultural Infrastructure Fund',
    amount: '₹2 crore max',
    interest: '3% subvention',
    eligibility: 'FPOs, agribusinesses',
    status: 'pending',
    description: 'Post-harvest management infrastructure',
  },
  {
    name: 'Fasal Bima Yojana',
    amount: 'Crop loss coverage',
    interest: '2% premium',
    eligibility: 'All farmers',
    status: 'eligible',
    description: 'Crop insurance against natural calamities',
  },
];

const creditGaps = [
  { category: 'Crop Production', required: 150000, available: 100000, gap: 50000, filled: false },
  { category: 'Machinery', required: 200000, available: 80000, gap: 120000, filled: false },
  { category: 'Storage', required: 80000, available: 30000, gap: 50000, filled: false },
  { category: 'Marketing', required: 50000, available: 45000, gap: 5000, filled: true },
];

const coldStorages = [
  { name: 'Patna Cold Storage', distance: '15 km', capacity: '5000 MT', rating: 4.5, phone: '0612-234567' },
  { name: 'Bihar Agro Cold Chain', distance: '22 km', capacity: '3000 MT', rating: 4.2, phone: '0612-345678' },
  { name: 'Ganga Cold Storage', distance: '18 km', capacity: '2500 MT', rating: 4.0, phone: '0612-456789' },
];

const inputDealers = [
  { name: 'Bharat Fertilizers', products: 'Urea, DAP, Potash', distance: '3 km', rating: 4.8 },
  { name: 'Krishna Seeds & Pesticides', products: 'Seeds, Pesticides, Fungicides', distance: '5 km', rating: 4.5 },
  { name: 'Farm Care Agro', products: 'Fertilizers, Pesticides, Implements', distance: '7 km', rating: 4.3 },
];

const trainingCenters = [
  { name: 'KVK Patna', type: 'Government', courses: 'Organic Farming, Dairy, Fisheries', distance: '12 km' },
  { name: 'BAU Sabour', type: 'University', courses: 'Advanced Crop Management, Horticulture', distance: '45 km' },
  { name: 'ICAR RCER', type: 'Research', courses: 'Climate-Smart Agriculture', distance: '30 km' },
];

export default function CreditPage() {
  const [activeTab, setActiveTab] = useState<'gaps' | 'schemes' | 'resources'>('gaps');

  return (
    <div className="flex flex-col">
      <Header title="Credit Mapper" />

      <div className="flex-1 p-6">
        {/* Credit Summary Banner */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-emerald-50 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Your Credit Profile
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Based on your farming profile and land holdings
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-zinc-500">Total Requirement</p>
                  <p className="text-2xl font-bold text-blue-600">₹4.8L</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-500">Available</p>
                  <p className="text-2xl font-bold text-green-600">₹2.53L</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-500">Gap</p>
                  <p className="text-2xl font-bold text-amber-600">₹2.27L</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'gaps' ? 'default' : 'outline'}
            onClick={() => setActiveTab('gaps')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Credit Gaps
          </Button>
          <Button
            variant={activeTab === 'schemes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schemes')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Scheme Eligibility
          </Button>
          <Button
            variant={activeTab === 'resources' ? 'default' : 'outline'}
            onClick={() => setActiveTab('resources')}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Resource Locator
          </Button>
        </div>

        {activeTab === 'gaps' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Farmer Profile
                </CardTitle>
                <CardDescription>
                  Update your details for accurate credit assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="District"
                    options={districtOptions}
                    placeholder="Select district"
                  />
                  <Input
                    label="Land Holding (acres)"
                    type="number"
                    placeholder="e.g., 5"
                  />
                  <Select
                    label="Primary Crop"
                    options={cropOptions}
                    placeholder="Select crop"
                  />
                  <Input
                    label="Annual Income (₹)"
                    type="number"
                    placeholder="e.g., 250000"
                  />
                  <Button className="w-full">
                    Analyze Credit Gaps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Gap Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Credit Gap Analysis</CardTitle>
                <CardDescription>
                  Your funding requirements across different farm activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{gap.category}</h4>
                          <p className="text-sm text-zinc-500">
                            Required: ₹{gap.required.toLocaleString()} | Available: ₹
                            {gap.available.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {gap.filled ? (
                            <Badge variant="success">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Covered
                            </Badge>
                          ) : (
                            <Badge variant="warning">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Gap: ₹{gap.gap.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${
                            gap.filled ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(gap.available / gap.required) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Funding Recommendation
                  </h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    To cover your credit gaps, we recommend applying for:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Kisan Credit Card - ₹2 lakh (crop production)
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Agricultural Infrastructure Fund - ₹1.2 lakh (machinery)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="grid gap-6">
            {/* Scheme Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Government Schemes You May Qualify For
                </CardTitle>
                <CardDescription>
                  Based on your profile and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schemes.map((scheme, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          scheme.status === 'eligible'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-amber-100 dark:bg-amber-900/30'
                        }`}
                      >
                        {scheme.status === 'eligible' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{scheme.name}</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {scheme.description}
                            </p>
                          </div>
                          <Badge
                            variant={scheme.status === 'eligible' ? 'success' : 'warning'}
                          >
                            {scheme.status === 'eligible' ? 'Eligible' : 'Review Needed'}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center gap-6 text-sm">
                          <span className="flex items-center gap-1 text-zinc-500">
                            <DollarSign className="h-4 w-4" />
                            {scheme.amount}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <CreditCard className="h-4 w-4" />
                            {scheme.interest}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Users className="h-4 w-4" />
                            {scheme.eligibility}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheme Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Scheme Comparison</CardTitle>
                <CardDescription>Compare key features across schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="pb-3 text-left text-sm font-medium text-zinc-500">Scheme</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Max Amount</th>
                        <th className="pb-3 text-right text-sm font-medium text-zinc-500">Interest</th>
                        <th className="pb-3 text-center text-sm font-medium text-zinc-500">Processing Time</th>
                        <th className="pb-3 text-center text-sm font-medium text-zinc-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map((scheme, i) => (
                        <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                          <td className="py-3 font-medium">{scheme.name}</td>
                          <td className="py-3 text-right">{scheme.amount}</td>
                          <td className="py-3 text-right">{scheme.interest}</td>
                          <td className="py-3 text-center">
                            <Badge variant="outline">7-14 days</Badge>
                          </td>
                          <td className="py-3 text-center">
                            <Button variant="ghost" size="sm">
                              Details
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
        )}

        {activeTab === 'resources' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cold Storage Locator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  Nearby Cold Storages
                </CardTitle>
                <CardDescription>
                  Storage facilities near your district
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coldStorages.map((storage, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Warehouse className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{storage.name}</h4>
                        <p className="text-sm text-zinc-500">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          {storage.distance} | Capacity: {storage.capacity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">⭐ {storage.rating}</p>
                        <p className="text-xs text-zinc-500">{storage.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  View All Cold Storages
                </Button>
              </CardContent>
            </Card>

            {/* Input Dealers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-600" />
                  Input Dealers
                </CardTitle>
                <CardDescription>
                  Seeds, fertilizers, and pesticides near you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inputDealers.map((dealer, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Store className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{dealer.name}</h4>
                        <p className="text-sm text-zinc-500">{dealer.products}</p>
                        <p className="text-xs text-zinc-400">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          {dealer.distance}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">⭐ {dealer.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  View All Dealers
                </Button>
              </CardContent>
            </Card>

            {/* Training Centers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  Training Centers & Extension Services
                </CardTitle>
                <CardDescription>
                  Learn modern farming techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {trainingCenters.map((center, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium">{center.name}</h4>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {center.type}
                      </Badge>
                      <p className="mt-2 text-sm text-zinc-500">
                        <span className="font-medium">Courses:</span> {center.courses}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        <MapPin className="mr-1 inline h-3 w-3" />
                        {center.distance}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2 w-full">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}