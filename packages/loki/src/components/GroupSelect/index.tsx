import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { AngleDown } from 'assets/icons/ILT';
import CustomizedCheckbox from './Checkbox';

const useStyles = makeStyles((_theme) => ({
  formControl: {
    minWidth: '120px',
    maxWidth: '220px',
  },
  select: {
    height: '40px',
  },
  listSubheader: {
    marginTop: '8px',
    marginBottom: '4px',
    paddingLeft: '16px',
  },
  menuItem: {
    padding: '8px 16px',
    paddingLeft: '24px',
    height: '32px',
  },
  listItemIcon: {
    minWidth: 0,
  },
  placeholder: {
    opacity: 0.4,
  },
  labelSelect: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const IconAngleDown = (props: any) => {
  return (
    <AngleDown
      className={props.className}
      style={{
        position: 'absolute',
        color: 'grey',
        userSelect: 'none',
        pointerEvents: 'none',
        right: 8,
        marginLeft: '8px',
      }}
    />
  );
};

interface IGroupSelect {
  label: string;
  groups: {
    label: string;
    name: string;
    options: { name: string; value: any }[];
  }[];
  onSelect: (selected: any) => void;
}

const GroupSelect: React.FunctionComponent<IGroupSelect> = ({
  label,
  groups,
  onSelect,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const value = event.target.value;
    if (Array.isArray(value)) {
      setSelected(value);
    }
  };

  const groupsOptions = groups.map((group) => {
    const items = [];
    if (groups.length > 1) {
      items.push(
        <Typography
          className={classes.listSubheader}
          variant="subtitle2"
          color="textPrimary"
        >
          {group.label}
        </Typography>,
      );
    }
    group.options.forEach((option) => {
      const value = `${group.name}-${option.value}`;
      items.push(
        <MenuItem key={option.value} value={value} className={classes.menuItem}>
          <ListItemIcon className={classes.listItemIcon}>
            <CustomizedCheckbox checked={selected.indexOf(value) > -1} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="textSecondary">
                {option.name}
              </Typography>
            }
          />
        </MenuItem>,
      );
    });
    return items;
  });

  const handleOnClose = () => {
    const groupSelected = selected.reduce((_acc: any, item) => {
      const [groupName, value] = item.split('-');
      if (_acc[groupName]) {
        _acc[groupName].push(value);
      } else {
        _acc[groupName] = [value];
      }
      return _acc;
    }, {});
    onSelect(groupSelected);
  };

  return (
    <FormControl className={classes.formControl}>
      <Select
        multiple
        onClose={handleOnClose}
        defaultValue={[]}
        className={classes.select}
        onChange={handleChange}
        IconComponent={IconAngleDown}
        displayEmpty={true}
        renderValue={() =>
          selected.length > 0 ? (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className={classes.labelSelect}
            >
              {label}: {selected.length}
            </Typography>
          ) : (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className={classes.labelSelect}
            >
              {label}
            </Typography>
          )
        }
      >
        {groupsOptions}
      </Select>
    </FormControl>
  );
};

export default React.memo(GroupSelect);
