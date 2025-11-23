'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@whop/react/components';

interface Job {
  id: string;
  title: string;
  description: string;
  bountyAmount: number;
  status: string;
  creator: {
    name: string | null;
  };
  editor?: {
    name: string | null;
  } | null;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const res = await fetch(`/api/jobs/${jobId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch job details');
          }
          const data = await res.json();
          setJob(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [jobId]);

  const handleClaim = async () => {
    setIsClaiming(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/claim`, {
        method: 'PUT',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to claim job');
      }
      const updatedJob = await res.json();
      setJob(updatedJob);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 px-4 sm:px-6 lg:px-8 text-center">Loading job details...</div>;
  }

  if (error) {
    return <div className="py-12 px-4 sm:px-6 lg:px-8 text-center text-red-500">{error}</div>;
  }

  if (!job) {
    return <div className="py-12 px-4 sm:px-6 lg:px-8 text-center">Job not found.</div>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-a2 border border-gray-a4 rounded-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-12">{job.title}</h1>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">${job.bountyAmount}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                job.status === 'CLAIMED' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {job.status}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-11 mb-2">Description</h2>
            <p className="text-gray-10 whitespace-pre-wrap">{job.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-11 mb-2">Creator</h3>
              <p className="text-gray-10">{job.creator.name || 'Anonymous'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-11 mb-2">Editor</h3>
              <p className="text-gray-10">{job.editor?.name || 'Not Claimed'}</p>
            </div>
          </div>
          {job.status === 'OPEN' && (
            <Button className="w-full" size="4" onClick={handleClaim} disabled={isClaiming}>
              {isClaiming ? 'Claiming...' : 'Claim Bounty'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
