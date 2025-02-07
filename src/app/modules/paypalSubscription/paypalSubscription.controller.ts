// import { Request, Response } from 'express';
// import { paypalSubscriptionService } from './paypalSubscription.service';

// import httpStatus from 'http-status';

// const paypalSubscriptioncreate = catchAsync(async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const result = await paypalSubscriptionService.create({ email });
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'paypalSubscription created successfully!',
//     data: result,
//   });
// });

// export const paypalSubscriptionController = {
//   paypalSubscriptioncreate,
// };
