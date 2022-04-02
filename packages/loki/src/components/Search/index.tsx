import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, InputAdornment, IconButton, Avatar, Typography } from '@material-ui/core';
import { Close, Search } from 'assets/icons/ILT';

import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
} from '@material-ui/lab';

const useStylesAutocomplete = makeStyles({
  root: {
    maxWidth: '240px',
    width: '240px',
    height: '40px',
    paddingRight: '0px',
    backgroundColor: 'white',
    borderRadius: '8px',
    '&.Mui-focused': {
      '& $clearIndicator': {
        display: 'block',
      },
      '& $clearIndicator + div': {
        display: 'block',
      },

      '& $popupIndicator': {
        color: '#2194f3',
      },
    },
    '&:hover': {
      '& $clearIndicator': {
        display: 'block',
      },
      '& $clearIndicator + div': {
        display: 'block',
      },
    },
  },
  inputRoot: {
    paddingBottom: '0px !important',
    '& $input': {
      padding: '7px 0px 7px 11px !important',
    },
    '.MuiAutocomplete-hasClearIcon &, .MuiAutocomplete-hasPopupIcon &': {
      paddingRight: '0px',
    },
  },
  endAdornment: {
    top: 'unset',
  },
  clearIndicator: {
    padding: '5px',
    margin: '2px',
    marginLeft: '3px',
    display: 'none',
  },
  popupIndicator: {
    padding: '5px',
    margin: '2px',
    marginRight: '3px',
    marginLeft: '3px',
  },
  popupIndicatorOpen: {
    transform: 'rotate(0deg)',
  },
  input: {
    height: '20px',
    paddingTop: '7px',
    paddingBottom: '7px',
  },
  option: {
    paddingTop: '8px',
    paddingBottom: '8px',
    '&[aria-selected="true"] ': {
      backgroundColor: 'white',
    },
    '&[data-focus="true"]': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  popper: {
    width: '320px !important', // Override inline style of .MuiAutocomplete-popper
    left: '39px !important',
    top: '5px !important',
  },
  paper: {
    margin: 0,
    boxShadow: '0px 16px 32px rgba(37, 37, 51, 0.24)',
  },
  listbox: {
    padding: '0px 0px', // Remove top/bottom padding of AutoComplete listbox
  },
});

const useStylesMUI = makeStyles({
  Divider: {
    height: '20px',
    borderRight: '2px solid #DBDBDB',
    display: 'none',
  },
  MuiInputAdornmentPositionEnd: {
    marginLeft: '0px',
  },
  MuiAvatarRoot: {
    height: '48px',
    width: '48px',
    fontSize: '24px',
    marginRight: '12px',
  },
});

const SearchInput = () => {
  const autocompleteClasses = useStylesAutocomplete();
  const muiClasses = useStylesMUI();

  const [value] = useState<string | null>(null);
  const [, setTab] = useState(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options] = useState<any[]>([]);
  const [error] = useState('');

  const handleChange = (event: React.ChangeEvent<{}>, newTab: number) => {
    setTab(newTab);
  };

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    setInputValue(value);
  };

  const clearField = () => {
    setInputValue('');
  };

  const handleSearch = () => {};

  const handlePressEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {};

  const renderOption = (option: any, state: AutocompleteRenderOptionState) => {
    const firstName = option?.firstName;
    const avatar = option?.avatar;
    const firstNameInitial = firstName && firstName.length > 0 ? firstName[0] : '';

    return (
      <Box display="flex" flexDirection="row">
        <Avatar
          alt={firstName}
          src={avatar}
          classes={{
            root: muiClasses.MuiAvatarRoot,
          }}
        >
          {firstNameInitial}
        </Avatar>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ height: '20px', lineHeight: '20px' }}>
            <Typography variant="h5">{`${option?.lastName} ${option?.firstName}`.trim()}</Typography>
          </div>
          <div style={{ height: '18px', lineHeight: '18px' }}>
            <Typography variant="caption">{option?.username}</Typography>
          </div>
        </div>
      </Box>
    );
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      size="small"
      onKeyDown={(e) => {
        if (e.key === 'Enter') handlePressEnter(e);
      }}
      InputLabelProps={{
        ...params.InputLabelProps,
        shrink: true,
      }}
      inputProps={{
        ...params.inputProps,
        onChange: (event) => {
          return (params.inputProps as any)?.onChange(event);
        },
      }}
      InputProps={{
        ...params.InputProps,
        // type: 'search',
        classes: {
          root: autocompleteClasses.root,
          input: autocompleteClasses.input,
        },
        endAdornment: (
          <InputAdornment position="end" classes={{ positionEnd: muiClasses.MuiInputAdornmentPositionEnd }}>
            {inputValue?.length ? (
              <>
                <IconButton
                  aria-label="Quick clear field"
                  tabIndex={-1}
                  onClick={clearField}
                  className={autocompleteClasses.clearIndicator}
                >
                  <Close width="20px" height="20px" />
                </IconButton>
                <span className={muiClasses.Divider} />
              </>
            ) : null}
            {
              <IconButton
                aria-label="Search"
                tabIndex={-1}
                onClick={handleSearch}
                className={autocompleteClasses.popupIndicator}
              >
                <Search width="20px" height="20px" />
              </IconButton>
            }
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Autocomplete
      fullWidth
      autoHighlight={false}
      autoSelect={false}
      disableClearable
      forcePopupIcon
      clearOnEscape={false}
      clearOnBlur={false}
      open={open && !!inputValue && inputValue.length > 0}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      classes={autocompleteClasses}
      options={options}
      filterOptions={(options, state) => options} // Show all the options from API, not only the ones match with inputValue
      getOptionLabel={(option) => (!!option ? option?.lastName + ' ' + option?.firstName : '')}
      getOptionSelected={(options, value) => true} // Hackaround to implement freeSolo mode but still show noOptionsText.
      noOptionsText={error ? <span>Something went wrong!</span> : <span>No results.</span>}
      loadingText={<span>Searching...</span>}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={renderInput}
      renderOption={renderOption}
    />
  );
};

export default SearchInput;
