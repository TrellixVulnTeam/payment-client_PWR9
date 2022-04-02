import i18n from 'i18n';
import { Box, Icon } from '@material-ui/core';
import { iToast } from '@ilt-core/toast';
import _get from 'lodash-es/get';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PhoneNumber } from '@greyhole/myid/myid_pb';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectUserById } from 'redux/features/users/slice';
import { updateUserThunk } from 'redux/features/users/thunks';

import AllowedTo from 'components/AllowedTo';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { Edit } from 'assets/icons/ILT';
import { PerformPermission } from 'configs/routes/permission';
import { getErrorMessageFromCode } from 'utils/constant/message';
import BasicInfoForm from './BasicInfo';
import ReviewInfoForm from './ReviewInfo';

type FormValues = {
  fullName: string;
  groupId: number | undefined;
  roleId: number | undefined;
  phoneNumber: PhoneNumber.AsObject;
};

enum STEPS {
  BASIC_INFO = 0,
  REVIEW_INFO = 1,
}

const steps = [{ label: i18n.t('Upload receipt') }, { label: i18n.t('Review') }];

const DialogEdit: React.FC = () => {
  const dispatch = useAppDispatch();

  const { id: userIdParam } = useParams<{ id: string }>();
  const userInfo = useAppSelector((state) => selectUserById(state, userIdParam));

  const methods = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      groupId: null,
      roleId: null,
      phoneNumber: {
        countryCode: null,
        nationalNumber: null,
      },
    },
  });

  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFO);
  const [open, setOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState('idle');

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (userInfo) {
      reset({
        fullName: _get(userInfo, 'metadata.fullName', ''),
        phoneNumber: {
          countryCode: _get(userInfo, 'phone.countryCode', ''),
          nationalNumber: _get(userInfo, 'phone.nationalNumber', ''),
        },
        groupId: _get(userInfo, 'rolesList[0].groupId'),
        roleId: _get(userInfo, 'rolesList[0].roleId'),
      });
    }
  }, [reset, userInfo]);

  const handleOpen = () => {
    handleFirst();
    setOpen(true);
    reset();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleFirst = () => setActiveStep(STEPS.BASIC_INFO);

  const handleUpdateUser = async (formValues: FormValues) => {
    setStatusLoading('updating');
    const { response, error } = await dispatch(
      updateUserThunk({
        id: userInfo.userId,
        changesList: [
          {
            email: userInfo.email,
            phoneNumber: formValues.phoneNumber,
            roles: {
              rolesList: [
                {
                  roleId: formValues.roleId || userInfo.rolesList[0]?.roleId,
                  groupId: formValues.groupId || userInfo.rolesList[0]?.groupId,
                },
              ],
            },
            metadata:
              formValues.fullName &&
              JSON.stringify({
                ...userInfo.metadata,
                ...formValues,
              }),
          },
        ],
      }),
    ).unwrap();

    if (response) {
      iToast.success({
        title: t('Success'),
        msg: t('You already have updated info of {{fullName}}', { fullName: userInfo.metadata.fullName }),
      });
      handleClose();
    } else {
      iToast.error({
        title: 'Error',
        msg: getErrorMessageFromCode(error.code),
      });
    }
    setStatusLoading('idle');
  };

  return (
    <>
      <AllowedTo perform={PerformPermission.userManagementUserList.updateUser}>
        <Button
          startIcon={() => (
            <Box mr={1}>
              <Icon component={Edit} />
            </Box>
          )}
          size={ButtonSizes.sm}
          onClick={handleOpen}
          variant={ButtonVariants.secondary}
          style={{ minWidth: 100 }}
        >
          <Typography variant={TypoVariants.button1} weight={TypoWeights.medium}>
            {t('Edit')}
          </Typography>
        </Button>
      </AllowedTo>
      <AlopayDialog
        open={open}
        preventClose={methods.formState.isDirty}
        title={t('Edit user')}
        onClose={handleClose}
        handleBack={handleBack}
        steps={steps}
        maxWidth="sm"
        actions={
          <>
            {activeStep === STEPS.BASIC_INFO && (
              <>
                <Button size={ButtonSizes.lg} variant={ButtonVariants.primary} onClick={handleSubmit(handleNext)}>
                  {t('Next to preview')}
                </Button>
              </>
            )}
            {activeStep === STEPS.REVIEW_INFO && (
              <>
                <Button
                  size={ButtonSizes.lg}
                  variant={ButtonVariants.primary}
                  onClick={handleSubmit(handleUpdateUser)}
                  loading={statusLoading === 'updating'}
                >
                  {t('Update')}
                </Button>
                <Button size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={handleBack}>
                  {t('Back to previous step')}
                </Button>
              </>
            )}
          </>
        }
      >
        <FormProvider {...methods}>
          {activeStep === STEPS.BASIC_INFO && <BasicInfoForm />}
          {activeStep === STEPS.REVIEW_INFO && <ReviewInfoForm />}
        </FormProvider>
      </AlopayDialog>
    </>
  );
};

export default DialogEdit;
