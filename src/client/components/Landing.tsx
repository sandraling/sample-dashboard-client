import * as React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useLocation,
    useHistory,
    RouteComponentProps,
    useRouteMatch
} from 'react-router-dom';

import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { useAuth } from "./Auth";
import { AccountRecovery } from './AccountRecovery';

interface Props extends RouteComponentProps {}

export const Landing = (props: Props) => {
  const auth = useAuth();

  if (auth && auth.getLoginStatus() === true) {
    return (
      <Redirect to='/home' />
    )
  }

  return (
    <Router>
      <div className='container landing__layout--desktop'>
        <div className='landing__cover-img--desktop' />
        <div className='landing__content--outer landing__cover-img--mobile'>
          <div className='landing__content--inner'>
            <Switch>
              <Route path='/' exact>
                <Login />
              </Route>
              <Route path='/sign-up'>
                <SignUp />
              </Route>
              <Route path='/account-recovery'>
                <AccountRecovery />
              </Route>
              <Route render={() => <h1>404</h1>} />
            </Switch>
          </div>
        </div> {/* div.landing__content--outer */}
      </div>
    </Router>
  )
}

export const TosFooter = () => {
  return (
    <footer className='landing__tos'>
      <Link to='/tos' >Term of use. Privacy policy</Link>
    </footer>
  )
}
