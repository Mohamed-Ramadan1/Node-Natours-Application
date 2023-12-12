// filtering
// const queryObject = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObject[el]);

// //Advanced Filtering
// let queryStr = JSON.stringify(queryObject);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

// let query = Tour.find(JSON.parse(queryStr));

// //sort
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }
// //Limit (Sending only specific fields of the data set)
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// // pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page dose not exist');
// }

// // query = query.skip(skip).limit(limit);
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: [true, 'User must have a name !'] },
//   email: {
//     type: String,
//     required: [true, 'User should have a email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Pleas provide a valid email']
//   },

//   photo: {
//     type: String
//   },

//   password: {
//     type: String,
//     required: [true, 'User should have a string'],
//     minlength: 8,
//     select: false
//   },

//   passwordConfirm: {
//     type: String,
//     required: [true, 'user should confirm the password'],
//     validate: {
//       validator: function(el) {
//         return el === this.password;
//       },
//       message: 'Passwords are not the same '
//     }
//   },

//   passwordChangedAt: {
//     type: Date
//   }
// });
