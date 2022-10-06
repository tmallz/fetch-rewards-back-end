# fetch-rewards-back-end

## Purporse 
The purpose of this test was to make a functioning web service that handled uses spending rewards points. The oldest points are to be spent first, across as many payers as necessary

## Usage
- Clone the repo: `git clone git@github.com:tmallz/fetch-rewards-back-end.git`
- Navigate into the project folder
- Install dependancies:  `npm install`
- Start the server: `npm run start`

## Functionality: 
 - Once the app is up and running you will need to use an API client (such as [postman](https://www.postman.com/downloads/) or [insomnia](https://insomnia.rest/download) ) to test all of the routes
 - For navigating to the respective routes will allow you to see how the data is being modified, for instance if you add a transaction with a new payer, you will see that http://localhost:5000/transactions and http://localhost:5000/payer/ have been update
 - Routes: 
   -http://localhost:5000/payer/ (GET request): Returns a list of the contents of the payers table from the DB
  -- http://localhost:5000/payer/ (POST request): Allows the user to post a new payer to the DB (Params : { "payer": "STRING_PAYER_NAME_HERE" })
  --- total points for each added payer default to 0 when added on this call. They get automatically updated on transaction add
  -- http://localhost:5000/transactions (GET request): Returns a list of all current transactions in the DB, ordered by timestamp (oldest -> newest)
  -- http://localhost:5000/transactions (POST request): Allows the user to post a new transaction to the DB (Params : { "payer": "STRING_PAYER_NAME_HERE", "points": INT_POINTS_GO_HERE})
  --- This route automatically updates the payer total points each time it is called to reflect the sum of the current transaction points for each payer.
  -- http://localhost:5000/balances (GET request): Returns a list of all current payers their balance in the DB
  -- http://localhost:5000/spend (POST Request): Allows user to spend their rewards points and updates tables accordingly (PARAMS: {"points": INT_POINTS_GO_HERE})
  --- This route spends the alloted points from the request on each transaction, as long as there are points remaining, in order of the olders transactions to the newest
  --- This route updates the payers table with the new totals
  --- Deletes the transactions that it spent all of the points from
  --- Updates the transaction that still has leftover points
  --- It then returns a list of points spent per payer
  
  ## Technologies
  - Express was used for the server and routing
  - Supabase was used for data storage and DB interaction
  
  ## Results
  - This is a fully functioning web service (backend only) that meets the requirements listed in the [coding challenge](https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf) requirements
  
