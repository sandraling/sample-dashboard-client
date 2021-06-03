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
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';

import { useAuth } from './Auth';
import { AboutMe } from './AboutMe';
import { Dashboard } from './Dashboard';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LanguageIcon from '@material-ui/icons/Language';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import BarChartIcon from '@material-ui/icons/BarChart';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ReceiptIcon from '@material-ui/icons/Receipt';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import StoreIcon from '@material-ui/icons/Store';

const navListDirectory = [
    {name: "Home", link: "/home", icon: <HomeIcon />},
    {name: "Dashboard", link: "/dashboard", icon: <BarChartIcon />},
    {name: "About Me", link: "/about-me", icon: <PersonOutlineIcon />},
    {name: "Products", link: "/products", icon: <StoreIcon />},
    {name: "Invoices", link: "/invoices", icon: <ReceiptIcon />},
    {name: "Mail Marketing", link: "/mail-marketing", icon: <MailOutlineIcon />},
    {name: "Chat Room", link: "/chat-room", icon: <QuestionAnswerIcon />},
    {name: "Calendar", link: "/calendar", icon: <CalendarTodayIcon />},
    {name: "Help Center", link: "/help-center", icon: <HelpOutlineIcon />},
    {name: "Settings", link: "/settings", icon: <SettingsIcon />}
];

/**
 * Returns a list item component for navigational drawer based on params.
 * @param navObj Contains the list item's displayed name, icon, and link
 */
const navItemGenerator = (
    navObj: {name: string, link: string, icon: JSX.Element}, 
    currentPathname: string,
    onClick: () => void
) => {
    const { name, link, icon } = navObj;
    return (
      <Link to="#" key={name} onClick={onClick}>
          <ListItem button selected={link === currentPathname}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
          </ListItem>
      </Link>
    )
};

export const Main = () => {
    const auth = useAuth();
    const [open, setOpen] = React.useState(false);
    const [notifCount, setNotifCount] = React.useState(0);
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(open => !open);
    }

    return (
        <div className="main">
            <header>
                <AppBar className="header__appbar" color="secondary">
                    <Toolbar className="header__toolbar" variant="dense">
                        <div className="header__toolbar--left  noSelect">
                            <IconButton onClick={toggleDrawer} className="menuButton">
                                <MenuIcon />
                            </IconButton>
                            <div className="title">
                                Sample Dash
                            </div>
                        </div>
                        <div className="header__toolbar--right">
                        <IconButton color="inherit" aria-label="menu">
                            <LanguageIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" aria-label="menu">
                            <QuestionAnswerIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" aria-label="menu">
                            <NotificationsIcon fontSize="small" />
                            <div className={"badge " + (notifCount > 0 ? "show" : "hidden")}></div>
                        </IconButton>
                        <Divider orientation="vertical" />
                        <Button onClick={() => auth?.logout()}>
                            <Typography variant="body1">
                                {(auth) ? auth.getUserData().firstName + " " + auth.getUserData().lastName : ""}
                            </Typography>
                            <ExpandMoreIcon />
                            <AccountCircleIcon fontSize="large" />
                        </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </header>

            <nav>
                <Drawer
                    variant="permanent"
                    className={"drawer " + clsx({
                        ["drawer--opened"]: open,
                        ["drawer--closed"]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            ["drawer--opened"]: open,
                            ["drawer--closed"]: !open,
                        })
                    }}>
                    <div className="drawer__topbar " >
                        <div className={"drawer__topbar--inner " + clsx({
                            "drawer__topbar--opened": open,
                            "drawer__topbar--closed": !open,
                        })}>
                            <div className="drawer__topbar--text noSelect">Sample Dash</div>
                            <IconButton onClick={toggleDrawer}>
                                {open ? <ChevronLeftIcon /> : <MenuIcon />}
                            </IconButton>
                        </div>
                    </div>
                    <List>
                        {navListDirectory.map(listItem => navItemGenerator(listItem, location.pathname, () => setOpen(false)))}
                    </List>
                </Drawer>
            </nav>

            <div className={"content "  + clsx({
                ["content--drawerOpened"]: open,
                ["content--drawerClosed"]: !open,
            })}>
                <Switch>
                    <Route path={[
                        "/home", 
                        "/about-me",
                        "/products",
                        "/invoices",
                        "/mail-marketing",
                        "/chat-room",
                        "calendar",
                        "/help-center",
                        "/settings"
                        ]}>
                        <Redirect to="/dashboard" />
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route render={() => <h1>404</h1>} />
                </Switch>
            </div>
        </div>
    )
}