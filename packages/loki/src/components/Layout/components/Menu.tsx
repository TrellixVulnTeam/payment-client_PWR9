import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AllowedTo from 'components/AllowedTo';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { sidebarAdmin, SidebarProps } from './sidebar';
import { hasChildren } from './utils';

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(0, 2),
  },
  listItem: {
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  listItemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(1.5),
    '& svg': {
      color: '#031352',
    },
  },
  listItemSelected: {
    backgroundColor: '#D6DEFF !important',
    '& svg': {
      color: '#0934E0',
    },
  },
  listMultipleItemSelected: {
    backgroundColor: 'transparent !important',
    '& svg': {
      color: '#0934E0',
    },
  },
}));

export default function SidebarList() {
  return (
    <>
      {sidebarAdmin.map((item, key) => (
        <MenuItem key={key} item={item} />
      ))}
    </>
  );
}

type MenuItemProps = {
  item: SidebarProps;
};

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return (
    <AllowedTo perform={item.permissions} logic="or">
      <Component item={item} />
    </AllowedTo>
  );
};

type SingleLevelProps = {
  item: SidebarProps;
};

const SingleLevel: React.FC<SingleLevelProps> = ({ item }) => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  return (
    <ListItem
      button
      selected={location.pathname.includes(item.path)}
      className={classes.listItem}
      onClick={() => history.push(item.path)}
      classes={{
        selected: classes.listItemSelected,
      }}
    >
      <ListItemIcon
        classes={{
          root: classes.listItemIcon,
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={TypoVariants.button2}
            weight={TypoWeights.medium}
            type={location.pathname.includes(item.path) ? TypoTypes.primary : TypoTypes.default}
          >
            {item.title}
          </Typography>
        }
      />
    </ListItem>
  );
};

type MultiLevelProps = {
  item: SidebarProps;
};

const MultiLevel: React.FC<MultiLevelProps> = ({ item }) => {
  const classes = useStyles();
  const location = useLocation();

  const { items: children } = item;
  const [open, setOpen] = useState(Boolean(children.find((item) => location.pathname.includes(item.path))));

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ListItem
        button
        selected={open}
        onClick={handleClick}
        className={classes.listItem}
        classes={{
          selected: classes.listMultipleItemSelected,
        }}
      >
        <ListItemIcon
          classes={{
            root: classes.listItemIcon,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={TypoVariants.button2} weight={TypoWeights.medium}>
              {item.title}
            </Typography>
          }
        />
        {open ? <ExpandLessIcon fontSize="medium" /> : <ExpandMoreIcon fontSize="medium" />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.list}>
          {children.map((item, key) => (
            <MenuItem key={key} item={item} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};
