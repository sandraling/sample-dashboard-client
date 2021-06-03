import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  primary: { 
    main: '#43425D',
    light: '#5a5978',
    dark: '#3C3B54',
    contrastText: '#E5E5E5'
  },
  secondary: { 
    main: '#ffffff',
    dark: '#3C3B54',
    contrastText: '#CDCCE5'
  }
};

const theme = createMuiTheme({ 
  palette
});

export default theme;