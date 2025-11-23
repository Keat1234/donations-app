'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@whop/react/components';

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          bountyAmount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-12 mb-8">Post a New Bounty</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-11">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onValueChange={setTitle}
              placeholder="e.g., Edit my 2-minute gameplay clip"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-11">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onValueChange={setDescription}
              placeholder="Looking for an editor to add subtitles and zoom effects to a short clip."
              required
              rows={6}
            />
          </div>
          <div>
            <label htmlFor="bountyAmount" className="block text-sm font-medium text-gray-11">
              Bounty Amount ($)
            </label>
            <Input
              id="bountyAmount"
              type="number"
              value={bountyAmount}
              onValueChange={setBountyAmount}
              placeholder="e.g., 25"
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Post Bounty'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
