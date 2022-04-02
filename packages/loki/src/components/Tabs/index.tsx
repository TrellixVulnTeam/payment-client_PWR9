import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

import TabPanel from './TabPanel';
import Tabs from './Tabs';
import Tab from './Tab';

interface ITabs {
  currentTab: string | number;
  tabList: {
    label: string | React.ReactNode;
    value: string | number;
    panel: React.ReactNode;
  }[];
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    tabPanel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const FormTabs: React.FunctionComponent<ITabs> = ({ currentTab, tabList, onChange }) => {
  const classes = useStyles();
  return (
    <>
      <Tabs value={currentTab} onChange={onChange}>
        {tabList.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {tabList.map((tab) => (
        <TabPanel key={tab.value} value={tab.value} index={currentTab} spacingBox={0} className={classes.tabPanel}>
          {tab.panel}
        </TabPanel>
      ))}
    </>
  );
};

export default FormTabs;
