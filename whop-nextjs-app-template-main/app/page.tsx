'use client';

import { useEffect, useState } from 'react';
import { Button } from '@whop/react/components';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  bountyAmount: number;
  creator: {
    name: string | null;
  };
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-12">
            ClipQueue - Editing Bounties
          </h1>
          <Link href="/jobs/new">
            <Button>Post a Job</Button>
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-11 mb-4">
            Open Bounties
          </h2>
          {isLoading ? (
            <p className="text-gray-10">Loading bounties...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-10">No open bounties at the moment. Check back later!</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link href={`/jobs/${job.id}`} key={job.id} className="block p-4 border border-gray-a4 rounded-lg hover:bg-gray-a2 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-12">{job.title}</h3>
                      <p className="text-sm text-gray-11 mt-1">{job.description}</p>
                      <p className="text-xs text-gray-9 mt-2">
                        Posted by {job.creator.name || 'Anonymous'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-500">${job.bountyAmount}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
