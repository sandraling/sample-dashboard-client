import * as React from 'react';
import { BarChart, Bar } from 'recharts';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

let colorCounter = 0;   // Used for chart color id generation

/**
 * Fit for content in panel A
 * @param props configuration for one of the panel A's
 * @returns content for panel A
 */
export const PanelA = (props: { 
    title: string,
    total: string,
    delta: number,
    data: Array<object>,
    dataKey: string,
    color: string
}) => {
    const {
        title,
        total,
        delta,
        data,
        dataKey,
        color
    } = props;
    
    return (
        <>
            <Typography variant="subtitle1" className="title">
                {title}
            </Typography>
            <div className="row spaceBetween">
                <div className="column">
                        <Typography variant="h3">
                            {total}
                        </Typography>
                    <div className={"row " + clsx({
                        "number--negative": delta < 0,
                        "number--positive": delta >= 0
                    })}>
                        {delta < 0 ? <ArrowDownwardIcon style={{ fontSize: "1em" }} /> : <ArrowUpwardIcon style={{ fontSize: "1em" }} />} 
                        <Typography variant="caption">
                            {delta + "%"}
                        </Typography>
                    </div>
                </div>

                <ABarChart data={data} dataKey={dataKey} color={color} />
            </div>
        </>
    )
}

/**
 * Custom bar chart that fits for panel A.
 */
const ABarChart = (props: {data: Array<object>, dataKey: string, color: string}) => {
    const {
        data,
        dataKey,
        color
    } = props;
    const colorId = "color" + colorCounter++;
    
    return (
        <BarChart width={120} height={45} data={data} barCategoryGap={0.5}>
            <defs>
                <linearGradient id={colorId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="20%" stopColor={color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
                </linearGradient>
            </defs>
            <Bar dataKey={dataKey} fill={"url(#" + colorId + ")"} />
        </BarChart>
    )
}