import { createTheme } from '@material-ui/core/styles';
import { shadows } from './shadows';
import { typography } from './typography';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0934E0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5D1BE0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2BE990',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F53131',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD52F',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#031352',
      secondary: '#7C84A3',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FAFBFF',
    },
  },
  shadows,
  typography,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  overrides: {
    MuiCssBaseline: {},
    MuiButton: {
      root: {
        textTransform: 'inherit',
        fontFamily: 'Kanit',
        fontStyle: 'normal',
        letterSpacing: '0.75px',
        padding: '8px 16px',
      },
      label: {
        fontSize: '16px',
      },
      sizeLarge: {
        padding: '14px 16px',
        fontSize: '16px',
      },
      outlined: {
        border: '1px solid #D6DEFF',
      },
    },
    MuiTypography: {
      button: {
        textTransform: 'inherit',
      },
    },
    MuiInput: {
      root: {
        borderRadius: '8px',
        border: '1px solid #D6DEFF',
        '&:hover': {
          border: '2px solid #0934E0',
        },
        outlined: {
          border: '1px solid #D6DEFF',
          '& $notchedOutline': {
            borderColor: '1px solid #D6DEFF',
          },
          readonly: {
            background: 'red',
          },
        },
        '& $notchedOutline': {
          borderColor: '1px solid #D6DEFF',
        },
      },
      input: {
        letterSpacing: '0.5px',
        padding: '13px 16px',
      },
      underline: {
        '&:before, &:after': {
          display: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        border: '1px solid #D6DEFF',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'red',
          },
          '&:hover fieldset': {
            borderColor: 'yellow',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'green',
          },
          readonly: {
            background: 'red',
          },
        },
      },
      input: {
        padding: '14.5px 14px',
      },
      multiline: {
        padding: '14.5px 14px',
      },
      notchedOutline: {
        borderColor: 'transparent',
      },
    },
    MuiFormLabel: {
      root: {
        marginBottom: '8px',
      },
    },
    MuiFormHelperText: {
      root: {
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '10px',
        lineHeight: '160%',
        letterSpacing: '1.25px',
        '&$error': {
          color: '#FF4322',
        },
      },
    },
    MuiSelect: {
      root: {
        paddingRight: '36px !important',
      },
      select: {
        paddingRight: '24px',
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
      icon: {
        color: '#031352 !important',
        width: 24,
        height: 24,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: '16px',
      },
      paperWidthSm: {
        maxWidth: '512px !important',
      },
      paperWidthMd: {
        maxWidth: '780px !important',
      },
      paperWidthLg: {
        maxWidth: '1048px !important',
      },
    },
    MuiContainer: {
      maxWidthMd: {
        maxWidth: '780px !important',
      },
      maxWidthLg: {
        maxWidth: '1048px !important',
      },
      maxWidthXl: {
        maxWidth: '1584px !important',
      },
    },
  },
  props: {
    MuiButton: {},
  },
});
