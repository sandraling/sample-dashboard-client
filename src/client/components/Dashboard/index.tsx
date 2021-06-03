import * as React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Divider,
    Grid,
    FormControl,
    Select,
    Button,
    Typography
} from '@material-ui/core';
import * as Data from './utils/data';
import * as _ from 'lodash';
import { PanelA } from './PanelA';
import { PanelBA } from './PanelBA';
import { PanelBB } from './PanelBB';
import { PanelCA } from './PanelCA';
import { PanelCB } from './PanelCB';

const chartBaseColor = "#A8A8A8";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        panelSetContainer: {
            width: '100%',
            margin: 'auto',
            flex: '1 1 auto',
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
    })
);
        
export const Dashboard = () => {
    const classes = useStyles();
    const locale = "en-US";
    const currency = "USD"; 

    return (
        <main className="dashboard">
                {
                /**
                 * Below grid is the container of 3 main groups of dashboard elements:
                 * A - Total stats overview - 3 panels: AA, AB, AC of same structure, each containing a barchart;
                 * B - First set of detailed stats - 2 panels: BA w/ an area chart and BB w/ a pie chart;
                 * C - Second set of detailed stats - 2 panels: CA w/ a table and CB w/ an area chart.
                 */ 
                }
                <Grid container spacing={5} justify="space-between" className={classes.panelSetContainer}>
                    {/* Dashboard Main Title */}
                    <Grid item xs={12} style={{ paddingBottom: 0 }}>
                        <Typography variant="h2">
                            Overview
                        </Typography>
                    </Grid>
                    
                    {/* Panel A Section */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper square className="dashboard__panel dashboard__panel--A dashboard__panel--AA">
                            <PanelA title="Total Views" total="246K" delta={-13.8} data={Data.AData} dataKey="value" color="#6BDDFE" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper square className="dashboard__panel dashboard__panel--A dashboard__panel--AB">
                            <PanelA title="Products Sold" total="2453" delta={13.8} data={Data.AData} dataKey="value" color="#A4A1FB" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper square className="dashboard__panel dashboard__panel--A dashboard__panel--AC">
                            <PanelA title="Total Earnings" total="$39K" delta={-13.8} data={Data.AData} dataKey="value" color="#60E2A1" />
                        </Paper>
                    </Grid>

                    {/* Panel BA Section: Views Areachart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper square className="dashboard__panel dashboard__panel--BA">
                            <PanelBA locale={locale} currency={currency} />
                        </Paper>
                    </Grid>
                    
                    {/* Panel BB Section: Money Piechart */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper square className="dashboard__panel dashboard__panel--BB">
                            <PanelBB locale={locale} currency={currency} /> 
                        </Paper>
                    </Grid>
                    
                    {/* Panel CA Section: Referrer Table */}
                    <Grid item xs={12} md={7}>
                        <Paper square className="dashboard__panel dashboard__panel--CA">
                            <PanelCA locale={locale} currency={currency} /> 
                        </Paper>
                    </Grid>
                    
                    {/* Panel CB Section: Subscriber Areachart */}
                    <Grid item xs={12} md={5}>
                        <Paper square className="dashboard__panel dashboard__panel--CB">
                            <PanelCB locale={locale} currency={currency} />
                        </Paper>
                    </Grid>
                
                </Grid>
            </main>
    )
}


