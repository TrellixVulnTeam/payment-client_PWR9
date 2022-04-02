import _get from 'lodash-es/get';
import { Action, Resource } from '@greyhole/myrole/myrole_pb';
import { Box, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectPermissionByRoleId, selectRoleSelected, toggleAction, toggleActionAll } from 'redux/features/role/slice';

import Toggle from 'components/StyleGuide/Toggle';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import ArrowDown from 'assets/icons/ILT/lib/ArrowDown';
import { t } from 'i18next';
import { selectResourceEntities } from 'redux/features/resource/slice';

const Accordion = withStyles({
  root: {
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #D6DEFF',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    borderColor: '#D6DEFF',
    backgroundColor: '#F5F5F5',
    borderRadius: '8px 8px 0 0',
    '&$expanded': {
      minHeight: 56,
      borderBottom: '1px solid #D6DEFF',
    },
  },
  content: {
    borderColor: 'red',
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: 16,
    '&:first-child': {
      backgroundColor: '#FAFBFF',
    },
    '&:not(:last-child)': {
      borderBottom: '1px solid #D6DEFF',
    },
  },
}))(MuiAccordionDetails);

type Props = {
  resource: Resource.AsObject;
};

const ResourcesItem: React.FC<Props> = ({ resource }) => {
  const dispatch = useAppDispatch();

  const resourceEntities = useAppSelector(selectResourceEntities);

  const roleIdSelected = useAppSelector(selectRoleSelected);
  const permissionByRoleId = useAppSelector(selectPermissionByRoleId);
  const actionIdsOfResourceId = resourceEntities[resource.id].actionsList.map((ac) => ac.id);

  const [expanded, setExpanded] = useState(-1);

  const enableActionIds = _get(permissionByRoleId, `[${roleIdSelected}][${resource.id}]`) ?? [];
  const isAllOn = enableActionIds.length === actionIdsOfResourceId.length;

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : -1);
  };

  const handleToggleStatus = (e: React.SyntheticEvent, action: Action.AsObject) => {
    e.preventDefault();
    if (action.id) {
      dispatch(
        toggleAction({
          resourceId: resource.id,
          actionId: action.id,
        }),
      );
    }
  };

  const handleToggleAllStatus = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      toggleActionAll({
        resourceId: resource.id,
        actionList: isAllOn ? [] : actionIdsOfResourceId,
      }),
    );
  };

  return (
    <Accordion square={true} expanded={expanded === resource.id} onChange={handleChange(resource.id)}>
      <AccordionSummary
        expandIcon={
          <Icon
            component={ArrowDown}
            style={{
              color: expanded === resource.id ? '#0934E0' : '#031352',
            }}
          />
        }
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography
          type={expanded === resource.id ? TypoTypes.primary : TypoTypes.default}
          variant={TypoVariants.body1}
          weight={TypoWeights.bold}
        >
          {resource.name}
        </Typography>
      </AccordionSummary>
      {resource.actionsList.length > 0 ? (
        <>
          <AccordionDetails>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {t('Action')}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" width={100}>
                <Toggle checked={isAllOn} onClick={handleToggleAllStatus} style={{ marginRight: 10 }} />
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                  {t('All on')}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
          {resource.id === expanded &&
            resource.actionsList.map((action) => (
              <AccordionDetails>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Box>
                    <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.medium}>
                      {action.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" width={100}>
                    <Toggle
                      checked={enableActionIds.includes(action.id)}
                      onClick={(e: React.SyntheticEvent) => handleToggleStatus(e, action)}
                      style={{ marginRight: 10 }}
                    />
                    <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                      {enableActionIds.includes(action.id) ? t('On') : t('Off')}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            ))}
        </>
      ) : (
        <AccordionDetails>
          <Box display="flex" justifyContent="center" width="100%">
            <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
              {t('No action.')}
            </Typography>
          </Box>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default React.memo(ResourcesItem);
