import { t } from 'i18next';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { Button, ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Box from 'components/StyleGuide/Box';

export declare interface DialogActionsProps {
  actions: React.ReactNode;
  activeStep: number;
  handleBack?: () => void;
}

const DialogActions = (props: DialogActionsProps) => {
  const { actions, handleBack } = props;

  return (
    <>
      <Box mt={3}>
        {actions}
        <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={handleBack}>
          <Typography variant={TypoVariants.button1} type={TypoTypes.default} weight={TypoWeights.medium}>
            {t('Back to previous step')}
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default DialogActions;
