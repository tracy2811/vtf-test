# VTF Test Task (Frontend)

Project in JavaScript, React that is rendering a screen with table:

* Each row: category

* Each column: date

* Each cell: 2 values from API (current price, recommended price as input), checkbox, image

and a button to send POST request with data in selected cells.

## Run development build

### 1. Get source code

```bash
# Clone this repository
git clone https://github.com/tracy2811/vtf-test.git

# Go to vtf-test
cd vtf-test
```

### 2. Install dependencies and run development server

Make sure Nodejs is install. In this project, Express is used to create api for mocking. Therefore, we need install dependencies for both backend and frontend.

```bash
# Install backend dependencies
cd backend && npm i

# Run server
node app.js

# Install frontend dependencies
cd ../frontend && npm i

# Run development build
npm start
```

## API Guide

Backend is simplyfied and used for mocking only.

* GET request to `http:/localhost:8000?cat=categoryname&date=datestring` returns json with format `{ category, date, price: { current, recommend } }`. `category`, and `date` are extracted from request query, prices are random.

* POST request to http:/localhost:8000/rooms with rooms array in body returns this array in success.

## Credit

* Icons are retrieved from [https://fontawesome.com/](https://fontawesome.com/)

