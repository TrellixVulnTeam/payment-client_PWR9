import { Box, Typography } from '@material-ui/core';
import { Danger } from 'assets/icons/ILT';

export declare interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({
  message = 'Something went wrong!',
}: ErrorMessageProps) => {
  return (
    <Box
      px="12px"
      py="4px"
      display="flex"
      alignItems="center"
      border="1px solid #FF4322" /* Secondary/Red500 */
      bgcolor="#FCE8E7" /* Decorative/Red/50 */
      borderRadius="4px"
    >
      <Danger width="24px" height="24px" color="error" />
      <Box component="span" pr="8px" />
      <Typography>{message}</Typography>
    </Box>
  );
};

export default ErrorMessage;
