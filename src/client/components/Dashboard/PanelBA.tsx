import * as React from 'react';
import { AreaChart } from './AreaChartPanel';

export const PanelBA = (props: {locale: string, currency: string}) => {
    const { locale, currency } = props;

    return (
        <AreaChart 
            title='Views' 
            locale={locale} 
            currency={currency} 
            chartHeight={350} />
    )
}
