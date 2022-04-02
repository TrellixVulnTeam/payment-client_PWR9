import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';

import { useState, useRef } from 'react';

import Paper from 'components/StyleGuide/Paper';
import Icon from 'components/StyleGuide/Icon';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import FlagCN from 'assets/icons/ILT/lib/FlagCN';
import { AngleDown, FlagEng, FlagVN } from 'assets/icons/ILT';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => {
  return {
    languages: {
      border: 'none',
      width: '180px',
    },
    dropdownButton: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: 0.5,
      borderRadius: 8,
      border: '1px solid #fff',
      padding: '8px 10px 8px 16px',
      '&:hover , &.active': {
        backgroundColor: '#D6DEFF',
      },
    },
    flagIcon: {
      width: 20,
      height: 14,
    },
  };
});

const LANGUAGES = {
  en: 'English',
  vi: 'Tiếng Việt',
  cn: '简体汉字',
  tw: '繁體漢字',
};

const LANGUAGES_FLAGS = {
  en: FlagEng,
  vi: FlagVN,
  tw: FlagCN,
  cn: FlagCN,
};

export const KEY_ENGLISH = 'en';
export const KEY_I18N = 'i18nLng';

const MenuLanguages: React.FC = () => {
  const { i18n } = useTranslation();

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(localStorage.getItem(KEY_I18N) || KEY_ENGLISH);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClosePopper = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleSelect = (key) => {
    setSelect(key);
    i18n.changeLanguage(key);
    localStorage.setItem(KEY_I18N, key);
    window.location.reload();
  };

  const id = open ? 'menu-list-grow' : undefined;

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="menu"
        onClick={handleToggle}
        className={`${classes.dropdownButton} ${open ? 'active' : ''}`}
        startIcon={<Icon component={LANGUAGES_FLAGS[select]} />}
        endIcon={<AngleDown />}
      >
        <Typography variant={TypoVariants.button1} style={{ whiteSpace: 'nowrap' }}>
          {LANGUAGES[select]}
        </Typography>
      </Button>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorRef.current}
        transition
        placement="top-end"
        style={{ zIndex: 99999 }}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0, 8', // https://popper.js.org/docs/v1/#modifiersoffset
          },
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'top-end' : 'bottom-end',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClosePopper}>
                <MenuList id="menu-list-grow">
                  {Object.entries(LANGUAGES).map(([key, label]) => (
                    <MenuItem key={key} value={key} onClick={() => handleSelect(key)}>
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>
                          <Icon className={classes.flagIcon} component={LANGUAGES_FLAGS[key]} />
                        </Box>
                        <Typography variant={TypoVariants.button1}>{label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MenuLanguages;
