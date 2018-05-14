/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check licence title length
let titleLengthChecker = (title) => {
  // Check if licence title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body
    if (body.length < 5 || body.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};



//Client Checkers
let ClientLengthChecker = (Client) => {
  // Check if Client exists
  if (!Client) {
    return false; // Return error
  } else {
    // Check length of Client
    if (Client.length < 3 || Client.length > 25) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid Client
    }
  }
};
let AlphaNumericCheckerClient = (Client) => {
  // Check if Client exists
  if (!Client) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid Client
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(Client); // Return regular expression test results (true or false)
  }
};

const ClientValidators =[
  {
    validator: ClientLengthChecker,
    message: 'Client must be more than 3 characters but no more than 25'
  },
  {
    validator: AlphaNumericCheckerClient,
    message: 'Clien must be alphanumeric.'
  }
]
//WorkWidth checkers
let WorkWidthLengthChecker = (WorkWidth) => {
  // Check if WorkWidth exists
  if (!WorkWidth) {
    return false; // Return error
  } else {
    // Check length of WorkWidth
    if (WorkWidth.length < 1 || WorkWidth.length > 4) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid WorkWidth
    }
  }
};
let NumericCheckerWorkWidth = (WorkWidth) => {
  // Check if title exists
  if (!WorkWidth) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^\d*\.?\d*$/);
    return regExp.test(WorkWidth); // Return regular expression test results (true or false)
  }
};

const WorkWidthValidators =[
  {
    validator: WorkWidthLengthChecker,
    message: 'Client must be more than 1 characters but no more than 4'
  },
  {
    validator: NumericCheckerWorkWidth,
    message: 'WorkWidth must be numeric.'
  }
]
//WorkLength checkers
let WorkLengthLengthChecker = (WorkLength) => {
  // Check if WorkLength exists
  if (!WorkLength) {
    return false; // Return error
  } else {
    // Check length of WorkLength
    if (WorkLength.length < 1 || WorkLength.length > 4) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid WorkLength
    }
  }
};
let NumericCheckerWorkLength = (WorkLength) => {
  // Check if title exists
  if (!WorkLength) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^\d*\.?\d*$/);
    return regExp.test(WorkLength); // Return regular expression test results (true or false)
  }
};

const WorkLengthValidators =[
  {
    validator: WorkLengthLengthChecker,
    message: 'Client must be more than 1 characters but no more than 4'
  },
  {
    validator: NumericCheckerWorkLength,
    message: 'WorkLength must be numeric.'
  }
]



let AddressLengthChecker = (Address) => {
  // Check if Address exists
  if (!Address) {
    return false; // Return error
  } else {
    // Check length of Address
    if (Address.length < 10 || Address.length > 200) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid Address
    }
  }
};

const AddressValidators =[
  {
    validator: AddressLengthChecker,
    message: 'Address must be more than 10 characters but no more than 200.'
  }
]

// Array of Body validators
const bodyValidators = [
  // First Body validator
  {
    validator: bodyLengthChecker,
    message: 'Body must be more than 5 characters but no more than 500.'
  }
];

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of Comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];
const twoyears = 365*2*24*60*60*1000;
// Licence Model Definition
const licenceSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  body: { type: String, required: true, validate: bodyValidators },
  WorkWidth:{type:String, required: true, validate:WorkWidthValidators},
  WorkLength:{type:String, required: true, validate:WorkLengthValidators},
  StartDate:{type:String, required: true},
  Client: {type:String, required: true, validate:ClientValidators},
  Address:{type:String,required:true, validate:AddressValidators},
  path:{type:Array},
  LicenceType:{type:String, required:true},
  TMType:{type:String,required: true},

  WorksStartDate:{type:String, default:''},
  WorksEndDate:{type:String, default:''},
  LvalidFrom:{type:String, default:''},
  LvalidTo:{type:String, default:''},
  LicencePath:{type:Array},

  pathPost:{type:Array},
  close: {type:Boolean, default:false},
  phase1: {type:Boolean, default:true},
  phase2: {type:Boolean, default:false},
  phase3: {type:Boolean, default:false},
  phase4: {type:Boolean, default:false},
  phase5: {type:Boolean, default:false},
  phase6: {type:Boolean, default:false},

  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  RefundDate: { type: Date, default: () => Date.now() + 410*2*24*60*60*1000},
  comments: [{
    comment: { type: String, validate: commentValidators },
    commentator: { type: String },
    attachements:{ type:Array },
    createdTime: { type: Date, default: Date.now }
  }]
});

// Export Module/Schema
module.exports = mongoose.model('Licence', licenceSchema);
