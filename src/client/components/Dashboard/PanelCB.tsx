import * as React from 'react';
import { AreaChart } from './AreaChartPanel';

export const PanelCB = (props: {locale: string, currency: string}) => {
    const { locale, currency } = props;

    return (
        <AreaChart 
            title='Subscribers' 
            locale={locale} 
            currency={currency}
            chartHeight={350} />
    )
}
