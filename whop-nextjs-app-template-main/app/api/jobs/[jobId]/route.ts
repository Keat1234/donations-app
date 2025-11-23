import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        editor: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      return new NextResponse(JSON.stringify({ error: 'Job not found' }), { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
