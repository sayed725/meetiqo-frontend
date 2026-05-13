'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Loader2,
  Plus,
  X,
  Copy,
  Check,
  Wand2,
  ChevronDown,
  ChevronUp,
  History,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAIStore } from '@/lib/ai-store';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

const categories = [
  'TECH',
  'MUSIC',
  'BUSINESS',
  'HEALTH',
  'SPORTS',
  'ART',
  'EDUCATION',
  'SOCIAL',
  'OTHER',
];

interface DescriptionResult {
  improvedTitle: string;
  description: string;
  tags: string[];
  suggestedBannerPrompt: string;
}

interface AIHistoryItem {
  id: string;
  featureType: string;
  input: {
    title?: string;
    category?: string;
  };
  output: DescriptionResult;
  createdAt: string;
}

export default function DescriptionGeneratorPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [newPoint, setNewPoint] = useState('');
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const setEventDraft = useAIStore((s) => s.setEventDraft);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/generate-description', {
        title,
        category,
        location,
        targetAudience,
        keyPoints,
      });
      return res.data.data as DescriptionResult;
    },
    onSuccess: (data) => setResult(data),
  });

  const { data: history } = useQuery<AIHistoryItem[]>({
    queryKey: queryKeys.ai.history('DESCRIPTION'),
    queryFn: async () => {
      const res = await api.get('/ai/history?featureType=DESCRIPTION&limit=3');
      return res.data.data?.history || [];
    },
    enabled: showHistory,
  });

  const addKeyPoint = () => {
    if (newPoint.trim() && keyPoints.length < 10) {
      setKeyPoints([...keyPoints, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const wordCount = result?.description?.split(/\s+/).filter(Boolean).length || 0;

  const handleCopy = async () => {
    if (!result) return;
    const text = `Title: ${result.improvedTitle}\n\nDescription:\n${result.description}\n\nTags: ${result.tags.join(', ')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseThis = () => {
    if (!result) return;
    setEventDraft({
      title: result.improvedTitle,
      description: result.description,
      category,
      location,
      tags: result.tags,
    });
  };

  const canGenerate =
    title.trim() && category && location.trim() && targetAudience.trim() && keyPoints.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Event Description Generator</h1>
        <p className="text-sm text-muted-foreground">
          Let AI craft compelling event copy, titles, and tags.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="e.g. Tech Summit 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g. Software engineers, founders"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <Label>Key Points</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a key point and press Enter"
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyPoint();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addKeyPoint}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keyPoints.map((point, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {point}
                  <button
                    onClick={() => removeKeyPoint(i)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => generateMutation.mutate()}
            disabled={!canGenerate || generateMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Description
              </>
            )}
          </Button>

          {generateMutation.isError && (
            <p className="text-sm text-red-500">
              Failed to generate. Please try again.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Generated Result</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="mr-2 h-3 w-3" />
                ) : (
                  <Copy className="mr-2 h-3 w-3" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button size="sm" asChild onClick={handleUseThis} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/dashboard/events">
                  Use This
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Improved Title</Label>
              <Input
                value={result.improvedTitle}
                onChange={(e) =>
                  setResult({ ...result, improvedTitle: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <span className="text-xs text-muted-foreground">
                  {wordCount} words
                </span>
              </div>
              <Textarea
                value={result.description}
                onChange={(e) =>
                  setResult({ ...result, description: e.target.value })
                }
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tag}
                    <button
                      onClick={() =>
                        setResult({
                          ...result,
                          tags: result.tags.filter((_, idx) => idx !== i),
                        })
                      }
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banner Prompt</Label>
              <p className="text-sm text-muted-foreground rounded-md bg-muted p-3">
                {result.suggestedBannerPrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <History className="h-4 w-4" />
            Previous Generations
            {showHistory ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </CardHeader>
        {showHistory && (
          <CardContent className="space-y-3">
            {(!history || history.length === 0) && (
              <p className="text-sm text-muted-foreground">No previous generations.</p>
            )}
            {history?.map((item) => (
              <div
                key={item.id}
                className="rounded-md border p-3 text-sm space-y-1"
              >
                <p className="font-medium">{item.input.title}</p>
                <p className="text-muted-foreground text-xs">
                  {item.input.category} •{' '}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="line-clamp-2 text-muted-foreground">
                  {item.output.description}
                </p>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
