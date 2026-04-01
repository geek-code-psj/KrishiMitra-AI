'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Mic, MicOff, Volume2, Globe, Loader2, Send } from 'lucide-react';
import { LANGUAGES } from '@/lib/constants';

const languageOptions = LANGUAGES.map(l => ({ value: l.code, label: l.name }));

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setResponse(null);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setResponse(
      'For rice cultivation during current kharif season, recommended nitrogen dose is 120 kg/ha. Apply 50% as basal and remaining in two splits at tillering and panicle initiation stages. Use urea or DAP for nitrogen supplementation.'
    );
    setDetectedLanguage(selectedLanguage);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col">
      <Header title="Voice Assistant" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-3xl">
          {/* Voice Input Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-emerald-600" />
                Ask in Your Language
              </CardTitle>
              <CardDescription>
                Speak or type your query about farming, irrigation, crops, or market prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  label="Preferred Language"
                  options={languageOptions}
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
              </div>

              {/* Recording Button */}
              <div className="mb-6 flex flex-col items-center">
                <button
                  onClick={handleRecord}
                  className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8 text-white" />
                  ) : (
                    <Mic className="h-8 w-8 text-white" />
                  )}
                </button>
                <p className="mt-2 text-sm text-zinc-500">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Or type your query here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button onClick={handleSubmit} disabled={isProcessing || !query.trim()}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response Card */}
          {response && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Response
                  </span>
                  {detectedLanguage && (
                    <Badge variant="info">
                      {LANGUAGES.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {response}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Listen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    Translate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Queries</CardTitle>
              <CardDescription>Try these common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'Best rice variety for kharif',
                  'Irrigation schedule for wheat',
                  'Current onion market price',
                  'Fertilizer for cotton',
                  'Pest control for tomato',
                  'Weather forecast',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}