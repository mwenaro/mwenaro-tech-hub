'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, ArrowRight, Plus, X, 
  Rocket, Target, ListChecks, Settings, CheckCircle 
} from 'lucide-react';

interface Feature {
  name: string;
  description: string;
  priority: 'must_have' | 'nice_to_have' | 'can_wait';
}

const STEPS = [
  { id: 1, title: 'Project Info', icon: Rocket },
  { id: 2, title: 'Goals', icon: Target },
  { id: 3, title: 'Features', icon: ListChecks },
  { id: 4, title: 'Preferences', icon: Settings },
  { id: 5, title: 'Review', icon: CheckCircle },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'web' as 'web' | 'mobile' | 'both' | 'api',
    problem: '',
    targetUsers: '',
    features: [] as Feature[],
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    frameworks: '',
    languages: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', description: '', priority: 'must_have' }],
    }));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const features = formData.features.map(f => ({
        name: f.name,
        description: f.description,
        priority: f.priority,
      }));

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          problem: formData.problem,
          targetUsers: formData.targetUsers,
          features,
          budget: {
            min: parseInt(formData.budgetMin) || 0,
            max: parseInt(formData.budgetMax) || 0,
            currency: 'USD',
          },
          timeline: formData.timeline,
          frameworks: formData.frameworks.split(',').map(f => f.trim()).filter(Boolean),
          languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        return;
      }

      router.push(`/projects/${data.project._id}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.title && formData.description && formData.type;
      case 2: return formData.problem;
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-3xl font-bold">Submit New Project</h1>
        <p className="text-zinc-500 mt-1">Tell us about your idea and we'll bring it to life</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className={`flex items-center gap-2 ${step >= s.id ? 'text-primary' : 'text-zinc-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s.id ? 'bg-primary text-white' : step === s.id ? 'bg-primary/20 text-primary' : 'bg-zinc-200 dark:bg-zinc-800'
              }`}>
                {step > s.id ? <CheckCircle size={16} /> : <s.icon size={16} />}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Project Information</h2>
            <div>
              <Label htmlFor="title">Project Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                placeholder="My Awesome App"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                placeholder="Briefly describe what you want to build..."
                rows={4}
              />
            </div>
            <div>
              <Label>Project Type *</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {(['web', 'mobile', 'both', 'api'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChange('type', type)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                      formData.type === type 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Goals & Target Users</h2>
            <div>
              <Label htmlFor="problem">What problem does it solve? *</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('problem', e.target.value)}
                placeholder="Describe the problem your target users face..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="targetUsers">Who are your target users?</Label>
              <Textarea
                id="targetUsers"
                value={formData.targetUsers}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('targetUsers', e.target.value)}
                placeholder="E.g., Small business owners, students, fitness enthusiasts..."
                rows={3}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Features</h2>
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus size={18} className="mr-2" /> Add Feature
              </Button>
            </div>
            {formData.features.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <ListChecks className="mx-auto h-12 w-12 mb-4 text-zinc-300" />
                <p>No features added yet</p>
                <p className="text-sm">Click "Add Feature" to describe what you need</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <Input
                          value={feature.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFeature(index, 'name', e.target.value)}
                          placeholder="Feature name"
                        />
                        <Textarea
                          value={feature.description}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateFeature(index, 'description', e.target.value)}
                          placeholder="Feature description"
                          rows={2}
                        />
                        <select
                          value={feature.priority}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => updateFeature(index, 'priority', e.target.value)}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800"
                        >
                          <option value="must_have">Must Have</option>
                          <option value="nice_to_have">Nice to Have</option>
                          <option value="can_wait">Can Wait</option>
                        </select>
                      </div>
                      <button onClick={() => removeFeature(index)} className="text-zinc-400 hover:text-red-500">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetMin">Min Budget (USD)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('budgetMin', e.target.value)}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="budgetMax">Max Budget (USD)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('budgetMax', e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="timeline">Expected Timeline</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('timeline', e.target.value)}
                placeholder="E.g., 2-3 months"
              />
            </div>
            <div>
              <Label htmlFor="frameworks">Preferred Frameworks (comma separated)</Label>
              <Input
                id="frameworks"
                value={formData.frameworks}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('frameworks', e.target.value)}
                placeholder="E.g., React, Next.js, Tailwind"
              />
            </div>
            <div>
              <Label htmlFor="languages">Preferred Languages (comma separated)</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('languages', e.target.value)}
                placeholder="E.g., TypeScript, Python"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Your Submission</h2>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <h3 className="font-bold mb-2">Project Info</h3>
                <p><span className="text-zinc-500">Title:</span> {formData.title}</p>
                <p><span className="text-zinc-500">Type:</span> {formData.type}</p>
                <p><span className="text-zinc-500">Description:</span> {formData.description}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <h3 className="font-bold mb-2">Goals</h3>
                <p><span className="text-zinc-500">Problem:</span> {formData.problem}</p>
                <p><span className="text-zinc-500">Target Users:</span> {formData.targetUsers}</p>
              </div>
              {formData.features.length > 0 && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <h3 className="font-bold mb-2">Features ({formData.features.length})</h3>
                  <ul className="list-disc list-inside">
                    {formData.features.map((f, i) => (
                      <li key={i}>{f.name} - <span className="text-zinc-500 capitalize">{f.priority.replace('_', ' ')}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <h3 className="font-bold mb-2">Preferences</h3>
                <p><span className="text-zinc-500">Budget:</span> ${formData.budgetMin || 0} - ${formData.budgetMax || 0}</p>
                <p><span className="text-zinc-500">Timeline:</span> {formData.timeline || 'Not specified'}</p>
                <p><span className="text-zinc-500">Frameworks:</span> {formData.frameworks || 'Any'}</p>
                <p><span className="text-zinc-500">Languages:</span> {formData.languages || 'Any'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={18} className="mr-2" /> Previous
            </Button>
          ) : (
            <div />
          )}
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Next <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}