#### XChanger-backend

This is just an intermiadary server that will serve the current exchange rates to the client side ([XChanger](https://github.com/komsic/XChanger)) from [currencylayer](https://currencylayer.com/).


#### Technology Used
- Node
- Babel
- Express
- Heroku

#### Installation
- Get an access key from [currencylayer](https://currencylayer.com/)
- Add it to your .env file (as indicated in .env-sample file)
- Run `npm install`
- Then run `npm run dev`
- Alternatively, access the app through this [heroku link](https://xchanger-backend.herokuapp.com/)

#### API Endpoint
| S/N| Request type   |  API description                               | Endpoint                      	                                                             |
|:--:|:--------------:|:----------------------------------------------:|:-------------------------------------------------------------------------------------------:|
| 1  | GET            | Get the currency rates of the given currencies | /rates?base_currency=[]&currencies=[] e.g `/rates?base_currency=NGN&currencies=CAD,EUR,USD` |
