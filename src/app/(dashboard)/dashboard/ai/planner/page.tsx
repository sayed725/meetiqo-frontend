'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Loader2,
  Plus,
  X,
  CalendarClock,
  CheckSquare,
  DollarSign,
  Clock,
  CircleDot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

interface TimelineItem {
  time: string;
  activity: string;
  duration: string;
  notes: string;
}

interface BudgetItem {
  venue: string;
  catering: string;
  marketing: string;
  technology: string;
  staffing: string;
  miscellaneous: string;
  total: string;
}

interface PlannerResult {
  timeline: TimelineItem[];
  checklistBefore: string[];
  checklistDuring: string[];
  checklistAfter: string[];
  estimatedBudgetBreakdown: BudgetItem;
}

export default function EventPlannerPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(3);
  const [expectedAttendees, setExpectedAttendees] = useState(50);
  const [eventType, setEventType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [result, setResult] = useState<PlannerResult | null>(null);

  const planMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/plan-event', {
        title,
        date,
        duration,
        expectedAttendees,
        eventType,
        goals,
      });
      return res.data.data as PlannerResult;
    },
    onSuccess: (data) => setResult(data),
  });

  const addGoal = () => {
    if (newGoal.trim() && goals.length < 10) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const canPlan =
    title.trim() && date && duration > 0 && expectedAttendees > 0 && goals.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Event Planner Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Generate a complete event plan with timeline, checklists, and budget.
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
              <Label htmlFor="title">Event Name</Label>
              <Input
                id="title"
                placeholder="e.g. Product Launch Party"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration: {duration} hour{duration !== 1 ? 's' : ''}
              </Label>
              <input
                id="duration"
                type="range"
                min={0.5}
                max={24}
                step={0.5}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="attendees">
                Expected Attendees: {expectedAttendees}
              </Label>
              <input
                id="attendees"
                type="range"
                min={1}
                max={1000}
                step={1}
                value={expectedAttendees}
                onChange={(e) => setExpectedAttendees(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <div className="flex gap-4">
              {(['PUBLIC', 'PRIVATE'] as const).map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm ${
                    eventType === type
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-input'
                  }`}
                >
                  <input
                    type="radio"
                    name="eventType"
                    value={type}
                    checked={eventType === type}
                    onChange={() => setEventType(type)}
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label>Goals</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a goal and press Enter"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGoal();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addGoal}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {goals.map((goal, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700"
                >
                  {goal}
                  <button
                    onClick={() => removeGoal(i)}
                    className="ml-1 rounded-full p-0.5 hover:bg-purple-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={() => planMutation.mutate()}
            disabled={!canPlan || planMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {planMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Planning...
              </>
            ) : (
              <>
                <CalendarClock className="mr-2 h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>

          {planMutation.isError && (
            <p className="text-sm text-red-500">
              Failed to generate plan. Please try again.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-purple-600" />
                Event Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {result.timeline.map((item, i) => (
                    <div key={i} className="relative">
                      <CircleDot className="absolute -left-4 h-4 w-4 bg-background text-purple-600" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {item.time}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({item.duration})
                          </span>
                        </div>
                        <p className="text-sm font-medium">{item.activity}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklists */}
          <Accordion type="multiple" defaultValue={['before']}>
            <AccordionItem value="before">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-600" />
                  Before Event Checklist ({result.checklistBefore.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {result.checklistBefore.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1 h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="during">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  During Event Checklist ({result.checklistDuring.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {result.checklistDuring.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1 h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="after">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-orange-600" />
                  After Event Checklist ({result.checklistAfter.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {result.checklistAfter.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1 h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-green-600" />
                Estimated Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Estimate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.estimatedBudgetBreakdown)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="capitalize">{key}</TableCell>
                        <TableCell className="text-right font-medium">
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {result.estimatedBudgetBreakdown.total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
