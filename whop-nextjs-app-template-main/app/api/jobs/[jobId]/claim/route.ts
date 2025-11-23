import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// This is a placeholder for user authentication.
async function getMockEditor() {
  const email = 'editor@example.com';
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        whopId: 'mock-whop-id-editor',
        email,
        name: 'Mock Editor',
        role: 'EDITOR',
      },
    });
  }

  return user;
}

export async function PUT(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;
    const editor = await getMockEditor();

    if (!editor || editor.role !== 'EDITOR') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse(JSON.stringify({ error: 'Job not found' }), { status: 404 });
    }

    if (job.status !== 'OPEN') {
      return new NextResponse(JSON.stringify({ error: 'Job is not open for claiming' }), { status: 400 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'CLAIMED',
        editorId: editor.id,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error claiming job:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
