const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

//simple middleware
app.use(express.json());

// Reading the tours data form the file.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// handel the get request (get the tours data)
app.get('/api/v1/tours', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//get tour by id
app.get('/api/v1/tours/:id', (req, res, next) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// handel the post request
app.post('/api/v1/tours', (req, res, next) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// start the server on the port of 3000
app.listen(port);
