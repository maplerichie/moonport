import { responsiveFontSizes, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

const theme = responsiveFontSizes(
    createMuiTheme({
      props: {
        MuiAppBar: {
          position: "sticky",
        },
        MuiCard: {
          elevation: 0,
        },
      },
      palette: {
        type: "dark",
        primary: {
          light: "#53CBC9",
          main: "#EA5AA2",
          dark: "#1E0E2D",
          contrastText: "#fff",
        },
        secondary: {
          main: "#53CBC9",
        },
        background: {
          paper: "#E1147B",
        },
      },
      overrides: {
        MuiAppBar: {
          root: {
            background: "#EA5AA2",
          },
        },
        MuiTextField: {
          root: {
            overflow: "visible !important",
            color: "#E1147B ",
          },
        },
        MuiPaper: {
          root: {
            overflow: "visible !important",
            color: "#EA5AA2",
            backgroundColor: "#212121",
          },
        },
        MuiTable: {
          root: {
            color: "#53CBC9 visible !important",
          },
        },
        MuiMenuItem: {
          root: {
            color: "#52CBC9  !important",
          },
        },
        MuiLink: {
          root: {
            color: "linear-gradient(45deg, #E1147B 30%, #EA5AA2  90%)",
          },
        },
        MuiTouchRipple: {
          root: {
            color: "#53CBC9 visible !important",
          },
        },
        MuiButton: {
          root: {
            color: "#53CBC9",
          },
        },
        MuiTypography: {
          root: {
            outlineStyle: "#53CBC9",
            color: "#53CBC9",
          },
        },
      },
    })
  );
  
  export default theme;