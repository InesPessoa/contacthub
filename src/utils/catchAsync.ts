export const catchAsync = (fn: Function) => {
  const catchError = (req: Request, res: Response, next: any) => {
    fn(req, res, next).catch(next);
  };
  return catchError;
};
