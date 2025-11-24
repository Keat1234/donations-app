// Mock Prisma client for deployment without database
export const prisma = {
  donation: {
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (params: any) => ({ id: params.where.id, ...params.data }),
    findMany: async () => [],
    aggregate: async () => ({ _sum: { amount: 0 } }),
    count: async () => 0,
  },
};
