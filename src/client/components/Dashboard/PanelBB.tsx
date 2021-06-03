import * as React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
    Grid, 
    Typography, 
    Divider,
    Button
} from '@material-ui/core';

import * as Data from './utils/data';
import { numberFormatter } from './utils/formatter';


export const PanelBB = (props: {locale: string, currency: string}) => {
    const {locale, currency} = props;
    const data = Data.BBData;
    const chartData = Data.BBChartData;

    return (
        <div className="innerContainer column spaceBetween">
            <Typography className="mainTitle" variant="h4">
                Money
            </Typography>
            <Grid container alignItems="center" justify="space-between">
                <Grid item xs>
                    <Typography gutterBottom variant="h5">
                        Total Budget
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography gutterBottom variant="h6" className={clsx({
                        "number--positive": data.totalBudget >= 0,
                        "number--negative": data.totalBudget < 0
                    })}>
                        {numberFormatter(data.totalBudget, locale, currency)}
                    </Typography>
                </Grid>
            </Grid>
            <Divider variant="middle" />
            <BudgetPieChart 
                data={chartData}
                percentageSaved={Math.round(data.totalSaved / data.totalBudget * 100)}
                locale={locale}
                currency={currency} />
            <Divider variant="middle" />
            <Button className="link">
                <Link to="#">
                    <Typography variant="body1">
                        View Full Report
                    </Typography>
                </Link>
            </Button>
        </div>
    )
}

/**
 * Custom pie chart for budget.
 */
const BudgetPieChart = (props: {
    data: typeof Data.BBChartData,
    percentageSaved: number,
    locale: string,
    currency: string,
}) => {
    const {
        data,
        percentageSaved,
        locale,
        currency
    } = props;

    const options =  {
        chart: {
            height: "180px",
            styledMode: true
        },
        credits: {
            enabled: false
        },
        title: {
            enable: false,
            text: percentageSaved + "%<br>Saved",
            verticalAlign: "middle",
            y: 15,
            style: {
                lineHeight: "2px"
            }
        },
        tooltip: {
            pointFormatter: function() {
                let self: any = this;
                return `${numberFormatter(self.percentage, locale)}%<br>` +
                    `${numberFormatter(self.y, locale, currency)} out of ${numberFormatter(self.total, locale, currency)}`;
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Budget Summary',
            innerSize: '85%',
            data: data
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                }
            }]
        }
    };
    
    return (
        <div className="chart pieChart">
            <HighchartsReact highcharts={Highcharts} options={options} />
            <Grid container alignContent="space-between" spacing={3} className="legend">
                    {data.map((category, index) => (
                        <Grid key={`legend-${index}`} container item xs spacing={2}>
                            <Grid item>
                                <svg height="10" width="10">
                                    <circle cx="5" cy="5" r="5" className={`highcharts-color-${index}`} />
                                </svg> 
                            </Grid>
                            <Grid container item xs direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h5">
                                        {category[0]}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography gutterBottom variant="subtitle1">
                                        {numberFormatter(category[1], locale, currency)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
        </div>
    )
}
