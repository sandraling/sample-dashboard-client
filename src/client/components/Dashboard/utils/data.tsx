/**
 * Holds data types, url and mock data for dashboard. 
 */

//================================================================================
// Summary Data
//================================================================================

/**
 * Data type for panel A and BB in dashboard
 */
export interface ADataType {
  name: string,
  value: number
}

function createAData(
  name: string,
  value: number
): ADataType {
  return { name, value };
}

export const AData = [
  createAData('1', 50),
  createAData('2', 80),
  createAData('3', 40),
  createAData('4', 80),
  createAData('5', 100),
  createAData('6', 45),
  createAData('7', 65),
  createAData('8', 89),
  createAData('9', 65),
  createAData('10', 25),
  createAData('11', 45),
  createAData('12', 80),
  createAData('13', 60),
];

//================================================================================
// Public API Stock Data
//================================================================================

export const stockDataSource = {
  daily: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo",
  monthly: "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo"
}

export interface RawStockDataType {
  "Meta Data": any,
  [key: string]: { 
    [date: string]: RawStockDataObjectValueType
  }
}

export interface RawStockDataObjectValueType {
  "1. open": string,
  "2. high": string,
  "3. low": string,
  "4. close": string,
  "5. volume": string
}

/**
 * For processed data storage.
 * Key denoting data type,  
 * with value of corresponding data in chart-ready data structure
 */
export interface StockDatasetType {
  "daily": StockDataType,
  "monthly": StockDataType
}

export type StockDataType = Array<{ name: string, data: Array<[number, number]>}>

//================================================================================
// Budget Summary Data
//================================================================================

export const BBData = {
  totalBudget: 50000,
  totalSpent: 18570,
  totalSaved: 31430
};

export const BBChartData: Array<[string, number]> = [
  ["Total Spent", BBData.totalSpent],
  ["Money Saved", BBData.totalSaved]
];

//================================================================================
// Referrer Table Data
//================================================================================

export interface referrerDataType {
  id: number,
  location: string,
  views: number,
  sales: number,
  conversion: number,
  total: number
}

function createReferrerData(
  id: number,
  location: string,
  views: number,
  sales: number,
  conversion: number,
  total: number
): referrerDataType {
  return { id, location, views, sales, conversion, total };
}

export const referrerData = [
  createReferrerData(1, "google.com", 3746, 752, 43, 19291),
  createReferrerData(2, "facebook.com", 8126, 728, 32, 17638),
  createReferrerData(3, "twitter.com", 8836, 694, 28, 16218),
  createReferrerData(4, "Direct, email, IM", 1173, 645, 24, 14421),
  createReferrerData(5, "linkedin.com", 2739, 539, 20, 12370),
  createReferrerData(6, "dribbble.com", 1762, 432, 18, 9928)
]
