const express = require('express');
const router = express.Router();

// Alpha Vantage API configuration
// Users can get a free API key from https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Yahoo Finance helper function using yahoo-finance2
async function fetchFromYahooFinance(symbol) {
    try {
        const yahooFinance = require('yahoo-finance2').default;
        
        // Map symbol for Yahoo Finance (remove .BSE suffix if present)
        const yahooSymbol = symbol.replace('.BSE', '.NS');
        
        const quote = await yahooFinance.quote(yahooSymbol);
        
        return {
            success: true,
            data: {
                symbol: symbol,
                name: quote.shortName || quote.longName || symbol,
                price: quote.regularMarketPrice || 0,
                volume: quote.regularMarketVolume || 0,
                open: quote.regularMarketOpen || 0,
                high: quote.regularMarketDayHigh || 0,
                low: quote.regularMarketDayLow || 0,
                previousClose: quote.regularMarketPreviousClose || 0,
                change: quote.regularMarketChange || 0,
                changePercent: quote.regularMarketChangePercent || 0,
                marketCap: quote.marketCap || 0,
                peRatio: quote.trailingPE || 0,
                eps: quote.epsTrailingTwelveMonths || 0,
                '52WeekHigh': quote.fiftyTwoWeekHigh || 0,
                '52WeekLow': quote.fiftyTwoWeekLow || 0,
                beta: quote.beta || 0,
                dividendYield: quote.dividendYield ? quote.dividendYield * 100 : 0
            }
        };
    } catch (error) {
        console.error('Yahoo Finance error:', error);
        return { success: false, error: error.message };
    }
}

// Get historical data from Yahoo Finance
async function getYahooHistoricalData(symbol, period = '1y') {
    try {
        const yahooFinance = require('yahoo-finance2').default;
        const yahooSymbol = symbol.replace('.BSE', '.NS');
        
        const result = await yahooFinance.historical(yahooSymbol, {
            period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            period2: new Date(),
            interval: '1d'
        });
        
        return {
            success: true,
            data: result.map(item => ({
                date: item.date.toISOString().split('T')[0],
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            })).slice(-100) // Last 100 trading days
        };
    } catch (error) {
        console.error('Yahoo Finance historical error:', error);
        return { success: false, error: error.message };
    }
}

// Map common Indian stock symbols to Alpha Vantage symbols
const symbolMapping = {
    'RELIANCE': 'RELIANCE.BSE',
    'TCS': 'TCS.BSE',
    'HDFCBANK': 'HDFCBANK.BSE',
    'INFY': 'INFY.BSE',
    'WIPRO': 'WIPRO.BSE',
    'ICICIBANK': 'ICICIBANK.BSE',
    'SBIN': 'SBIN.BSE',
    'BAJFINANCE': 'BAJFINANCE.BSE',
    'HINDUNILVR': 'HINDUNILVR.BSE',
    'ITC': 'ITC.BSE',
    'KOTAKBANK': 'KOTAKBANK.BSE',
    'AXISBANK': 'AXISBANK.BSE',
    'MARUTI': 'MARUTI.BSE',
    'TITAN': 'TITAN.BSE',
    'ASIANPAINT': 'ASIANPAINT.BSE',
    'NESTLEIND': 'NESTLEIND.BSE',
    'HDFC': 'HDFC.BSE',
    'ADANIPORTS': 'ADANIPORTS.BSE',
    'POWERGRID': 'POWERGRID.BSE',
    'NTPC': 'NTPC.BSE',
    'COALINDIA': 'COALINDIA.BSE',
    'ONGC': 'ONGC.BSE',
    'BPCL': 'BPCL.BSE',
    'CIPLA': 'CIPLA.BSE',
    'DRREDDY': 'DRREDDY.BSE',
    'SUNPHARMA': 'SUNPHARMA.BSE',
    'BHARTIARTL': 'BHARTIARTL.BSE',
    'ULTRACEMCO': 'ULTRACEMCO.BSE',
    'GRASIM': 'GRASIM.BSE',
    'JSWSTEEL': 'JSWSTEEL.BSE',
    'TATASTEEL': 'TATASTEEL.BSE',
    // NSE indices
    'NIFTY': '^NSI',
    'NIFTY 50': '^NSI',
    'SENSEX': '^BSESN',
    'BANK NIFTY': '^NSEBANK',
    'FIN NIFTY': '^NSEFIN',
    'MIDCAP NIFTY': '^NSEMDCP',
    // US stocks
    'AAPL': 'AAPL',
    'GOOGL': 'GOOGL',
    'MSFT': 'MSFT',
    'AMZN': 'AMZN',
    'TSLA': 'TSLA',
    'META': 'META',
    'NVDA': 'NVDA'
};

// Get mapped symbol
function getMappedSymbol(symbol) {
    const upperSymbol = symbol.toUpperCase().trim();
    return symbolMapping[upperSymbol] || symbol.toUpperCase().trim() + '.BSE';
}

// Route 1: Get stock quote (price, volume, etc.) - with Yahoo Finance fallback
router.get('/quote/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const mappedSymbol = getMappedSymbol(symbol);
        
        const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${mappedSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            res.json({
                success: true,
                symbol: symbol.toUpperCase(),
                name: symbol.toUpperCase(),
                price: parseFloat(quote['05. price']),
                volume: parseInt(quote['06. volume']),
                open: parseFloat(quote['02. open']),
                high: parseFloat(quote['03. high']),
                low: parseFloat(quote['04. low']),
                previousClose: parseFloat(quote['08. previous close']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
                dataSource: 'Alpha Vantage'
            });
        } else if (data['Note'] || data['Information']) {
            // API limit reached - Try Yahoo Finance as fallback
            console.log('Alpha Vantage API limit reached, trying Yahoo Finance...');
            const yahooResult = await fetchFromYahooFinance(mappedSymbol);
            
            if (yahooResult.success) {
            res.json({
                    success: true,
                    symbol: yahooResult.data.symbol,
                    name: yahooResult.data.name,
                    price: yahooResult.data.price,
                    volume: yahooResult.data.volume,
                    open: yahooResult.data.open,
                    high: yahooResult.data.high,
                    low: yahooResult.data.low,
                    previousClose: yahooResult.data.previousClose,
                    change: yahooResult.data.change,
                    changePercent: yahooResult.data.changePercent,
                    dataSource: 'Yahoo Finance',
                    warning: '⚠️ Alpha Vantage API limit reached. Using Yahoo Finance data (may not be 100% accurate).'
                });
            } else {
                res.status(429).json({
                    success: false,
                    error: 'API limit reached. Yahoo Finance fallback also failed.',
                    isLimited: true
                });
            }
        } else {
            res.status(404).json({
                success: false,
                error: 'Stock symbol not found. Please check the symbol and try again.'
            });
        }
    } catch (error) {
        console.error('Stock quote error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock quote'
        });
    }
});

// Route 2: Get fundamental analysis data - with Yahoo Finance fallback
router.get('/overview/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const mappedSymbol = getMappedSymbol(symbol);
        
        const response = await fetch(
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${mappedSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data['Symbol']) {
            res.json({
                success: true,
                symbol: symbol.toUpperCase(),
                name: data['Name'] || symbol.toUpperCase(),
                description: data['Description'] || '',
                exchange: data['Exchange'] || '',
                currency: data['Currency'] || 'INR',
                sector: data['Sector'] || '',
                industry: data['Industry'] || '',
                // Market Data
                marketCap: parseInt(data['MarketCapitalization'] || 0),
                peRatio: parseFloat(data['PERatio'] || 0),
                pegRatio: parseFloat(data['PEGRatio'] || 0),
                dividendYield: parseFloat(data['DividendYield'] || 0) * 100,
                dividendPerShare: parseFloat(data['DividendPerShare'] || 0),
                // Earnings
                eps: parseFloat(data['EPS'] || 0),
                epsForward: parseFloat(data['EPSForward'] || 0),
                // Price Data
                beta: parseFloat(data['Beta'] || 0),
                '52WeekHigh': parseFloat(data['52WeekHigh'] || 0),
                '52WeekLow': parseFloat(data['52WeekLow'] || 0),
                // Book Value
                bookValue: parseFloat(data['BookValue'] || 0),
                priceToBookRatio: parseFloat(data['PriceToBookRatio'] || 0),
                priceToSalesRatioTTM: parseFloat(data['PriceToSalesRatioTTM'] || 0),
                // Profitability
                profitMargin: parseFloat(data['ProfitMargin'] || 0) * 100,
                operatingMarginTTM: parseFloat(data['OperatingMarginTTM'] || 0) * 100,
                returnOnAssetsTTM: parseFloat(data['ReturnOnAssetsTTM'] || 0) * 100,
                returnOnEquityTTM: parseFloat(data['ReturnOnEquityTTM'] || 0) * 100,
                // Growth
                quarterlyEarningsGrowthYOY: parseFloat(data['QuarterlyEarningsGrowthYOY'] || 0) * 100,
                quarterlyRevenueGrowthYOY: parseFloat(data['QuarterlyRevenueGrowthYOY'] || 0) * 100,
                // Volume
                sharesOutstanding: parseInt(data['SharesOutstanding'] || 0),
                // Estimates
                analystTargetPrice: parseFloat(data['AnalystTargetPrice'] || 0),
                rating: data['AnalystRating'] || 'N/A',
                dataSource: 'Alpha Vantage'
            });
        } else if (data['Note'] || data['Information']) {
            // API limit reached - Try Yahoo Finance as fallback
            console.log('Alpha Vantage API limit reached, trying Yahoo Finance for overview...');
            const yahooResult = await fetchFromYahooFinance(mappedSymbol);
            
            if (yahooResult.success) {
                const q = yahooResult.data;
                res.json({
                    success: true,
                    symbol: q.symbol,
                    name: q.name,
                    description: '⚠️ Limited data from Yahoo Finance',
                    exchange: '',
                    currency: 'INR',
                    sector: 'N/A (Yahoo Finance)',
                    industry: 'N/A (Yahoo Finance)',
                    marketCap: q.marketCap,
                    peRatio: q.peRatio,
                    pegRatio: 0,
                    dividendYield: q.dividendYield,
                    dividendPerShare: 0,
                    eps: q.eps,
                    epsForward: 0,
                    beta: q.beta,
                    '52WeekHigh': q['52WeekHigh'],
                    '52WeekLow': q['52WeekLow'],
                    bookValue: 0,
                    priceToBookRatio: 0,
                    priceToSalesRatioTTM: 0,
                    profitMargin: 0,
                    operatingMarginTTM: 0,
                    returnOnAssetsTTM: 0,
                    returnOnEquityTTM: 0,
                    quarterlyEarningsGrowthYOY: 0,
                    quarterlyRevenueGrowthYOY: 0,
                    sharesOutstanding: 0,
                    analystTargetPrice: 0,
                    rating: 'N/A',
                    dataSource: 'Yahoo Finance',
                    warning: '⚠️ Alpha Vantage API limit reached. Using Yahoo Finance data (may not be 100% accurate).'
                });
            } else {
                res.status(429).json({
                    success: false,
                    error: 'API limit reached. Yahoo Finance fallback also failed.',
                    warning: 'isLimited: true'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                error: 'Stock symbol not found or no fundamental data available.'
            });
            }
        } catch (error) {
            console.error('Stock overview error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch fundamental data'
            });
        }
    });

    // Route 3: Get daily time series for charts - with Yahoo Finance fallback
    router.get('/daily/:symbol', async (req, res) => {
        try {
            const symbol = req.params.symbol;
            const mappedSymbol = getMappedSymbol(symbol);
            
            const response = await fetch(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${mappedSymbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data['Time Series (Daily)']) {
                const timeSeries = data['Time Series (Daily)'];
                const dates = Object.keys(timeSeries).sort().slice(-100); // Last 100 trading days
                
                const chartData = dates.map(date => ({
                    date: date,
                    open: parseFloat(timeSeries[date]['1. open']),
                    high: parseFloat(timeSeries[date]['2. high']),
                    low: parseFloat(timeSeries['3. low']),
                    close: parseFloat(timeSeries[date]['4. close']),
                    volume: parseInt(timeSeries[date]['5. volume'])
                }));
                
                res.json({
                    success: true,
                    symbol: symbol.toUpperCase(),
                    data: chartData,
                    dataSource: 'Alpha Vantage'
                });
            } else if (data['Note'] || data['Information']) {
                // API limit reached - Try Yahoo Finance as fallback
                console.log('Alpha Vantage API limit reached, trying Yahoo Finance for daily data...');
                const yahooResult = await getYahooHistoricalData(mappedSymbol);
                
                if (yahooResult.success) {
                    res.json({
                        success: true,
                        symbol: symbol.toUpperCase(),
                        data: yahooResult.data,
                        dataSource: 'Yahoo Finance',
                        warning: '⚠️ Alpha Vantage API limit reached. Using Yahoo Finance data (may not be 100% accurate).'
                    });
                } else {
                    res.status(429).json({
                        success: false,
                        error: 'API limit reached. Yahoo Finance fallback also failed.',
                        isLimited: true
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Stock symbol not found or no data available.'
                });
            }
        } catch (error) {
            console.error('Stock daily error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch daily data'
            });
        }
    });

    // Route 4: Search for stock symbols
    router.get('/search/:query', async (req, res) => {
        try {
            const query = req.params.query;
            
            const response = await fetch(
                `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data['bestMatches']) {
                const matches = data['bestMatches'].map(match => ({
                    symbol: match['1. symbol'],
                    name: match['2. name'],
                    type: match['3. type'],
                    region: match['4. region'],
                    currency: match['8. currency']
                }));
                
                res.json({
                    success: true,
                    matches: matches
                });
            } else if (data['Note'] || data['Information']) {
                // For search, we'll return a limited response since Yahoo Finance doesn't have a direct search API
                res.status(429).json({
                    success: false,
                    error: 'API limit reached. Please try again later.',
                    isLimited: true
                });
            } else {
                res.json({
                    success: true,
                    matches: []
                });
            }
        } catch (error) {
            console.error('Stock search error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to search stocks'
            });
            }
        });

module.exports = router;
