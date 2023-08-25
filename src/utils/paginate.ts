export const paginate = (query: any) => {
  let { page, limit } = query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 100;
  const skip = (page - 1) * limit;
  return { skip, limit };
};
