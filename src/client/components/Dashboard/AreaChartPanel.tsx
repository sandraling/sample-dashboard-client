import * as React from 'react';
import axios from 'axios';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
    FormControl,
    Select,
    Typography
} from '@material-ui/core';

import * as Data from './utils/data';
import { getMonthsAgoDate } from '../utils/dateManipulation';
import { numberFormatter } from './utils/formatter';
import { convertDateToUnix } from './utils/formatter';

export const AreaChart = (props: {title: string, locale: string, currency: string, chartHeight?: number}) => {
    const { title, locale, currency, chartHeight } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [dataset, setDataset] = 
    React.useState<Data.StockDatasetType>({
        "daily": [],
        "monthly": []
    });
    const chartRef = 
        React.useRef<{ 
            chart: Highcharts.Chart, 
            container: React.RefObject<HTMLDivElement>
        }>(null);
    const [timeInterval, setTimeInterval] = React.useState(6);
    const [xAxisBounds, setXAxisBounds] = React.useState<{[key: number]: [number, number]}>({});
    // Avoid typing as just Highchart.Options since some valid settings will present a type error
    // "Highcharts warning: Invalid attribute 'x2' in config" is present in example code by Highcharts themselves as well
    // As of Apr 13, 2021 on https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/gradient/
    const [chartOptions, setChartOptions] = React.useState<any>({
        chart: {
            type: 'areaspline',
            styledMode: true,
            height: chartHeight ? chartHeight : null,
            margin: [30, 40, 30, 40], // Top, right, bottom, left
            events: {
                render: () => verticalGridLineEdit()
            }
        },

        title: {
            text: undefined
        },   
             
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { 
                hour: '%H:%M',
                day: '%b. %e',
                week: '%b. %e',
                month: '%b. %Y',
                year: '%Y'
            },
            labels: {
                y: 25
            },
            tickPixelInterval: 200,
            tickLength: 0
        },

        yAxis: [{
            title: {
                text: null
            },
            labels: {
                align: 'left',
                x: -30
            }
        }, {
            opposite: true,
            title: {
                text: null
            },
            labels: {
                align: 'right',
                x: 30
            }
        }],

        tooltip: {
            pointFormatter: function () {
                const self: any = this;
                const name: string = self.series.name;
                return name + ": " + 
                    numberFormatter(
                        self.y, 
                        locale, 
                        (name === "Amount" ? undefined : currency)
                    ) + "<br>";
            }
        },

        legend: {
            enabled: false,
            align: 'left'
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            series: {
                marker: {
                    symbol: 'circle'
                }
            }
        },

        defs: {
            gradient0: {
                tagName: 'linearGradient',
                id: 'gradient-0',
                x1: 1,
                y1: 0,
                x2: 0,
                y2: 0.5,
                children: [{
                    tagName: 'stop',
                    offset: 0
                }, {
                    tagName: 'stop',
                    offset: 1
                }]
            },
            gradient1: {
                tagName: 'linearGradient',
                id: 'gradient-1',
                x1: 1,
                y1: 0,
                x2: 0,
                y2: 0.5,
                children: [{
                    tagName: 'stop',
                    offset: 0
                }, {
                    tagName: 'stop',
                    offset: 1
                }]
            }
        }
    });
    const isFirstRun = React.useRef(true);

    React.useEffect(() => {
        // Fetch data for area charts: panel BA and CB
        const dailyDataReq = axios.get<Data.RawStockDataType>(Data.stockDataSource.daily);
        const monthlyDataReq = axios.get<Data.RawStockDataType>(Data.stockDataSource.monthly);
        axios
            .all([dailyDataReq, monthlyDataReq])
            .then(
                axios.spread((...res) => {
                    const dailyData = processStockData(Object.values(res[0].data)[1], "daily");
                    const monthlyData = processStockData(Object.values(res[1].data)[1], "monthly");
                    setDataset({
                        "daily": dailyData,
                        "monthly": monthlyData
                    })

                    let dateBoundary: typeof xAxisBounds = {};
                    let endDate: number;
                    // Note that data is sort from old to new, 
                    // so we get the last element for most recent date
                    endDate = dailyData[0].data[dailyData[0].data.length - 1][0]; 
                    dateBoundary[0.25] = [endDate - 86400*1000*7, endDate]; // there are 86400s in 1 unix day
                    dateBoundary[1] = [getMonthsAgoDate(endDate, 1), endDate];
                    endDate = monthlyData[0].data[monthlyData[0].data.length - 1][0];
                    dateBoundary[6] = [getMonthsAgoDate(endDate, 6), endDate];
                    dateBoundary[12] = [getMonthsAgoDate(endDate, 12), endDate];
                    setXAxisBounds(dateBoundary);
                })
            )
            .catch(e => setError(true));
    }, []);

    React.useEffect(() => {
        // Prevent option update prior to data fetching
        if(isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const curData: Data.StockDataType = (timeInterval < 6 ? dataset["daily"] : dataset["monthly"]);
        setChartOptions({ ...chartOptions, 
            xAxis: {
                ...chartOptions.xAxis,
                floor: xAxisBounds[timeInterval][0],
                ceiling: xAxisBounds[timeInterval][1]
            },
            series: [{
                name: 'Price',
                yAxis: 0,
                type: 'areaspline',
                data: curData[3].data.slice()
            }, {
                name: 'Amount',
                yAxis: 1,
                type: 'areaspline',
                data: curData[4].data.slice()
            }]
        });
        if (loading) setLoading(false);
    }, [xAxisBounds, timeInterval]);

    React.useEffect(() => {
        verticalGridLineEdit();
    }, [chartOptions])

    /**
     * Stylizes area chart by lengthening vertical grid lines and y axis lines.
     * Limitations: If there are x-axis grid lines overlap with y-axis line,
     * in event of plot dimension changes, these grid lines would be mispositioned
     * in the x coordinate. 
     * In our case, the area chart doesn't change in dimensions and this customization
     * appears low in priority to begin with. Hence, this may not be revisited.
     * In event of a change in mind, it is possible to cherry pick xAxis ticks by index
     * and reassign their svg M commmand's x coord. param. to a coord. similar to
     * how we modify y-axis x coord.
     */
    const verticalGridLineEdit = () => {
        if (chartRef.current) {
            const chart = chartRef.current.chart;
            const ticks = chart.xAxis[0].ticks;
            const yAxes = chartRef.current.chart.yAxis;
            let gridLine, d, line, yAxis;

            // Lengthen x-axis grid lines at the top
            Object.values(ticks).forEach(tick => {
                gridLine = tick.gridLine as any;
                if (gridLine && gridLine.d) {
                    d = gridLine.d.split(' ');
                    d[2] = chart.plotTop - 10;
                    gridLine.attr({
                        d: d
                    })
                }
            });

            // Lengthen y-axis line at the top
            Object.entries(yAxes).forEach(([_, value]) => {
                yAxis = value as any;
                line = yAxis.axisLine;
                d = line.d.split(' ');
                d[1] = d[4] = (yAxis.opposite)
                    ? chart.plotWidth + chart.plotLeft + 0.5
                    : chart.plotLeft - 0.5;
                d[2] = chart.plotTop - 10;
                line.attr({
                    d: d
                })
            });
        }
    };
    
    const intervalChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setTimeInterval(event.target.value as number);
    };

    const highlightSeries = (index: number) => {
        if (chartRef.current !== null) {
            const series = chartRef.current.chart.series;
            series[index].setState('hover');
            series[(index + 1) % series.length].setState('inactive');
        }
    };

    const unhighlightSeries = () => {
        if (chartRef.current !== null) {
            const series = chartRef.current.chart.series;
            series.forEach(s => s.setState('normal'));
        }
    };

    return (
        <div className="innerContainer column spaceBetween">
            <div className="row spaceBetween">                         
                <Typography className="mainTitle" variant="h4">
                    {title}
                </Typography>
                <FormControl variant="outlined">
                    <Select
                        native
                        value={timeInterval}
                        onChange={(e) => intervalChange(e)}
                        inputProps={{
                            name: 'BAChartInterval',
                            id: 'panelBA__dropdown',
                        }}
                        >
                        <option value={0.25}>Last week</option>
                        <option value={1}>Last month</option>
                        <option value={6}>Last 6 months</option>
                        <option value={12}>Last year</option>
                    </Select>
                </FormControl>
            </div>
            <div className='areaChart'>
                {loading === false && error === false
                    ? <>
                        <HighchartsReact 
                            ref={chartRef}
                            highcharts={Highcharts}
                            options={chartOptions} />
                        <CustomizedLegend 
                            dataKeys={["Price", "Amount"]}
                            highlight={highlightSeries}
                            unhighlight={unhighlightSeries} />
                    </>
                    : null}
            </div>
        </div>
    );
}

/**
 * Return supplied data in array form appropriate for area chart usage.
 * Returned object's data is ordered by date, from old to recent.
 * @param data unprocessed daily/monthly data from API source;
 *             should be sort by date recency
 * @param interval string distinguishing data's time interval,
 *                 i.e. "daily"/"monthly" 
 */
 const processStockData = (
    data: { [data: string]: Data.RawStockDataObjectValueType },
    interval: string
): Data.StockDataType => {
    const newestDateStr: string = Object.keys(data)[0];
    let processedData: Data.StockDataType = [];

    // Initialize processedData structure
    Object.entries(data[newestDateStr]).forEach(([key, _]) => 
        processedData.push({
            name: key.slice(3).replace(/^\w/, (c) => c.toUpperCase()),
            data: []
        })
    );
    
    // Set up date for filtering data:
    // Entries older than oldestDate will not be included in result
    const newestDate: number = convertDateToUnix(newestDateStr, Data.stockDataTz);
    const oldestDate: number = (interval === "daily") 
        ? getMonthsAgoDate(newestDate, 2) 
        : getMonthsAgoDate(newestDate, 13);
    let curDate: number;

    return _.transform(data, (result, value, key) => {
        curDate = convertDateToUnix(key, Data.stockDataTz);
        Object.values(value).map((value, index) => {
            result[index].data.unshift([
                curDate,
                parseFloat(value)
            ]);
        })
        return curDate > oldestDate;
    }, processedData)
}

/**
 * Returns a customized legend component.
 * @param props.dataKeys data key name
 * @param props.colors colors used by data keys; allows overlap 
 */
const CustomizedLegend = (props: { 
    dataKeys: Array<string>, 
    highlight: (index: number) => void, 
    unhighlight: () => void
}) => {
    const { 
        dataKeys,
        highlight,
        unhighlight
    } = props;
    return (
    <ul className="legend">
        {dataKeys.map((dataKey, index) => (
            <li key={`item-${index}`} onMouseEnter={() => highlight(index)} onMouseLeave={() => unhighlight()}>
                <svg width="20" height="10">
                    <rect x="0" y="0" rx="5" ry="5" width="20" height="10" className={`legend-color-${index}`} />
                </svg>
                <span className="text">{dataKey}</span>
            </li>
        ))}
    </ul>
    );
}