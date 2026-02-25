import { z } from 'zod';

export function validate({ body, query, params }) {
  return (req, res, next) => {
    try {
      // tạo chỗ chứa dữ liệu đã validate
      req.validated ??= {};

      if (body) req.validated.body = body.parse(req.body);
      if (query) req.validated.query = query.parse(req.query);
      if (params) req.validated.params = params.parse(req.params);
      
      next();
    } catch (err) {
      next(err); // để errorHandler map ZodError
    }
  };
}

// export z để dùng tiện khi define schema
export { z };