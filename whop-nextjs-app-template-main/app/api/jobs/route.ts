import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { headers } from 'next/headers';

// This is a placeholder for user authentication.
// In a real application, you would get the user from the request,
// likely through a session or a token.
async function getMockUser() {
  const email = 'creator@example.com';
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        whopId: 'mock-whop-id-creator',
        email,
        name: 'Mock Creator',
        role: 'CREATOR',
      },
    });
  }

  return user;
}

export async function POST(req: Request) {
  try {
    const user = await getMockUser();

    if (!user || user.role !== 'CREATOR') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { title, description, bountyAmount } = body;

    if (!title || !description || !bountyAmount) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        bountyAmount: parseFloat(bountyAmount),
        creatorId: user.id,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
