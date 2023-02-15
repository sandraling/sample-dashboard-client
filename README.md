# Sample Dashboard
A responsive demo dashboard resulted from a few design images made reality. 

## Demo
![Sample Dashboard Demo](demo/demo.gif)

## Accessing the Hosted Version
Visit https://zen-williams-175346.netlify.app/ (may be unavailable at the time)

## Running it Locally
1. Create a `.env` file with `MONGO_URI` and `SECRET_KEY` populated by your own mongoDB
2. `npm run dev` and open on localhost:8080 

## Features
- A working registration and login;
- A dashboard displaying multiple statistics.

## What is Used?
- React
- Typescript
- Sass
- JWT
- ~Recharts~ Highcharts
- Material UI
- axios
- formik & yup
- Webpack with Babel
- MongoDB
... and more! 

## Personal Comments
Login data is pulled from a database, and the areacharts are populated by a stock website's API. See https://www.alphavantage.co/
Other than that, everything else is placeholder data.

## Disclaimer
This is a learning project. It is not being actively updated. Password creation is deliberately made restriction free, so feel free to use a simple password just to check out the project!
