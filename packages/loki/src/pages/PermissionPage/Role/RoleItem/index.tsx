import { t } from 'i18next';
import React from 'react';
import { Role } from '@greyhole/myrole/myrole_pb';
import IconButton from '@material-ui/core/IconButton';
import { Box, Grid } from '@material-ui/core';
import Menu from 'components/StyleGuide/Menu';
import MenuItem from 'components/StyleGuide/MenuItem';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { MoreHorizon } from 'assets/icons/ILT';
import { formatDate } from 'utils/date';
import { PerformPermission } from 'configs/routes/permission';
import { isLegalPermission } from 'components/AllowedTo/utils';
import useAuth from 'hooks/useAuth';

type RoleItemProps = {
  item: Role.AsObject;
  onSelect: (role: Role.AsObject) => void;
};

const RoleItem = ({ item, onSelect }: RoleItemProps) => {
  const menuRef = React.useRef();
  const [openMenu, setOpenMenu] = React.useState(false);

  const { userPermissions } = useAuth();

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleUpdate = () => {
    onSelect(item);
  };

  const isCanPermissionUpdate = isLegalPermission(PerformPermission.permissionRole.updateRole, userPermissions);

  return (
    <>
      <Paper background={PaperBackgrounds.ghost} radius={PaperRadius.max} style={{ height: '100%' }}>
        <Box p={3} height="100%" display="flex" flexDirection="column">
          <Grid container direction="column">
            <Grid item container justifyContent="space-between">
              <Grid item>
                <Typography variant={TypoVariants.head3} weight={TypoWeights.bold}>
                  {item.name}
                </Typography>
              </Grid>
              {isCanPermissionUpdate && (
                <Grid item>
                  <IconButton style={{ padding: 0 }} onClick={handleOpenMenu} ref={menuRef}>
                    <MoreHorizon />
                  </IconButton>
                  {openMenu && (
                    <Menu anchorRef={menuRef} onClose={handleCloseMenu}>
                      <MenuItem onClick={handleUpdate}>{t('Update')}</MenuItem>
                    </Menu>
                  )}
                </Grid>
              )}
            </Grid>
            <Grid item>
              <Box mt={1} mb={2}>
                <Typography variant={TypoVariants.body1} type={TypoTypes.titleSub}>
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box mt="auto">
            <Box>
              <Typography component="span" variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
                {t('Created at')}:{' '}
              </Typography>
              <Typography component="span" variant={TypoVariants.body2}>
                {item.createdAt ? formatDate(item.createdAt?.seconds * 1000) : '--------'}
              </Typography>
            </Box>
            <Box mt={0.5}>
              <Typography component="span" variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
                {t('Last update')}:{' '}
              </Typography>
              <Typography component="span" variant={TypoVariants.body2}>
                {item.updatedAt ? formatDate(item.updatedAt?.seconds * 1000) : '--------'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default RoleItem;
