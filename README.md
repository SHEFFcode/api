# Jeremy Shefer Door Dash Take Home Project
This is my take home project for door dash. 

For API docs skip to the end.

## Notes

**Note** Please note yahoo finance has a bug that is causing some errors to show up during tests. It is documented [here](https://github.com/pilwon/node-yahoo-finance/pull/42). 

This was not an issue yesterday, but is causing some issues to my tests today and DDASH request stalls because of it, which might require multiple requests. I do not have time to transition to a different API today, as I have to move on to another take home.

---

I added onhandled promise rejection catcher, that would log to disk to identify errors, but ideally I would write via winston to ELK stack logger.

Ideally we would use datadog to set up dashboards to monitor API traffic and identify and issues.

If we were on Azure we would hook up their [performance analyzer](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler).

---
I built the API with the view of the future, where the compute route could be expanded to handle all sort of computations, and use the stock compute engine (or any other potential future compute engine) class to make them.

Compute engine uses composition, by requiring the api-wrapper, which could be named stock API or some other name potentially. The wrapper always produces the same touple ouput [quote.high, quote.date], ragardless of 3d party api representation.

The alternative to array touple is to use a custom class data structure for both this touple and the maxProfitTuple I use in compute engine, and have their constructor accept 3 or 2 values.  But I just did not have time to implement that yet.

The actual 3d party yahoo API is abstracted away in a wrapper.  

---

Project uses CORS and rate limiting to prevent abuse.

---

In production one would generally use forever-monitor to keep the process chugging along even if it falls over.

---

In production I would generally use node --inspect profiler to check for any memory leaks or other performance testing if I had time.

--- 

In prodiction I would make a status page, so that I could quickly hit the status route and get some sort of quick insight into the operations of the microservice. It would have to be a private route, or again use datadog.

## Basics
The project is a node / express API with a single route [documented](##max-profit-route) below.

The api has two modes: production and dev. Dev mode does not do clustering, and allows for easier debugging. This mode is also auto enabled when tests are ran.

## Building and Running
In order to build and run the project run the following [yarn](https://yarnpkg.com/en/) commands:

* yarn install / npm install
* yarn serve / npm run serve (production)
* yarn serve-dev / npm run serve-dev (development, no clustering)

```sh
yarn install
yarn serve
```

OR

```sh
yarn install
yarn serve-dev
```

---

In order to test the project run the following commands:

**Note:** Please note yahoo finance has a bug that is causing some errors to show up during tests. It is documented [here](https://github.com/pilwon/node-yahoo-finance/pull/42).

* yarn test / npm run test (to run the test suite)
* yarn test-watch / npm run test-watch (keep test suite around via nodemon)

```sh
yarn test
```

OR 

```sh
yarn test-watch
```

---

In order to zip up a distribution version of the project run the following command:

* yarn zip / npm run zip (zip the project and put into dist folder for deployment)

```sh
yarn zip
```

## Max Profit Route
Accepts a stock symbol and returns the buy and sell dates in the last 180 days that would have produced the highest profit.

* **URL**

  `/compute/maxprofit/:symbol`

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `symbol=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "status": 200, "error": null, "data": { "buy": "2017-10-25", "sell": "2018-03-13", "profit": 18.14} }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "status": 400, "error": 'Please provide a valid alpha only symbol!', "data": null }`
    **Description**: Invalid format for stock symbol

  OR
  
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ "status": 404, "error": 'No quotes found for current stock symbol.', "data": null }`
    **Description**: There is no stock with such symbol

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ "status": 404, "error": 'Error, no way to make a profit in 180 days.', "data": null }`
    **Description**: Profit is not possible with this stock

  OR

  * **Code:** 429 TOO MANY REQUESTS <br />
    **Content:** `Too many requests`
    **Description**: Exceeded allowed number of requests in a time period

  OR

  * **Code:** 503 TIMED OUT <br />
    **Content:** `{ "status": 503, "error": "Request Timed Out", "data": null }`
    **Description**: Request timed out due to slow connection or unhandled error.

* **Sample Call:**

  ```javascript
  fetch('http://localhost:3000/compute/maxprofit/MSFT')
		.then((response) => response.json())
			.then((json) => console.log(json));
  ```# api
