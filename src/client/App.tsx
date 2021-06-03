import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect, RouteProps } from "react-router-dom"
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import theme from  './styling/mui/theme';

import { AuthProvider, useAuth } from "./components/Auth";
import { Landing } from "./components/Landing";
import { Main } from "./components/Main";

export const App = () => {
  const defaultTheme = theme;

  return (
    <>
      <StylesProvider injectFirst>
        <ThemeProvider theme={ defaultTheme }>
          <AuthProvider>
            <BrowserRouter>
              <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path={["/sign-up", "/account-recovery"]} component={Landing} />
                  <PrivateRoute
                    path={["/home", "/dashboard", "/about-me"]}
                    component={Main}
                  />
                  <Route render={() => <h1>404</h1>} />
              </Switch>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
};

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={(routeProps) => 
          (auth && auth.getLoginStatus() === true)
            ? (
              <Component {...routeProps} />
            ) : (
              <Redirect to="/" />
            )
      }
    />
  )
}