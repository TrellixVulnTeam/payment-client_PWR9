import { t } from 'i18next';
import { Dialog, DialogContent, Box } from '@material-ui/core';
import { Button, ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import DialogTitle from '../Title';

type Props = {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
};

const DialogDiscard = ({ open, onClose, onDiscard }: Props) => {
  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle
        title={t('Discard action')}
        subtitle={t(
          'The action you are doing will not be saved if you cancel or close it. Are you certain to discard?',
        )}
        handleClose={onClose}
      />
      <DialogContent>
        <Box pb={2} display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <Button fullWidth={false} variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
              <Typography variant={TypoVariants.button1}>{t('Cancel')}</Typography>
            </Button>
          </Box>
          <Button fullWidth={false} variant={ButtonVariants.primary} size={ButtonSizes.lg} onClick={onDiscard}>
            <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
              {t('Discard')}
            </Typography>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDiscard;
