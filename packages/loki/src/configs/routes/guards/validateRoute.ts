
/**
 * Allow redirect to forgot password flow
 * @param next
 * @returns
 */
const validateRoute = ({ next }) => {
  next();
};

export default validateRoute;
