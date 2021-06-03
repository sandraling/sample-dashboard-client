import * as React from 'react';
import { Link } from 'react-router-dom';
import { 
    Button, 
    Typography, 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core';
import * as Data from './utils/data';
import { numberFormatter } from './utils/formatter';

export const PanelCA = (props: {locale: string, currency: string}) => {
    const {locale, currency} = props;

    return (
        <div className="innerContainer column spaceBetween">
            <Typography className="mainTitle" variant="h4">
                Referrer
            </Typography>
            <Table aria-label="referrer table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell1">LOCATION</TableCell>
                        <TableCell align="center" className="tableCell2">VIEWS</TableCell>
                        <TableCell align="center" className="tableCell3">SALES</TableCell>
                        <TableCell align="center" className="tableCell4">CONVERSION</TableCell>
                        <TableCell align="right" className="tableCell5">TOTAL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Data.referrerData.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell component="th" scope="row" className="tableCell1">{row.location}</TableCell>
                            <TableCell align="center" className="tableCell2">{row.views}</TableCell>
                            <TableCell align="center" className="tableCell3">{row.sales}</TableCell>
                            <TableCell align="center" className="tableCell4">{row.conversion + "%"}</TableCell>
                            <TableCell align="right" className="tableCell5">{numberFormatter(Number(row.total), locale, currency)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button className="link">
                <Link to="#">
                    <Typography variant="body1">
                        Show More
                    </Typography>
                </Link>
            </Button>
        </div>
    )
};