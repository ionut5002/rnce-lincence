const User = require('../models/user'); // Import User Model Schema
const Licence = require('../models/licence'); // Import Licence Model Schema
const Notification = require('../models/notification');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const nodemailer = require('nodemailer');
const env = require('../env');
const multer = require('multer');
var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


module.exports = (router) => {
  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

  /* ===============================================================
     CREATE NEW Licence
  =============================================================== */
  router.post('/newLicence', (req, res) => {
    // Check if licence title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Job title is required.' }); // Return error message
    } else {
      // Check if licence body was provided
      if (!req.body.body) {
        res.json({ success: false, message: 'Job body is required.' }); // Return error message
      } else {
        // Check if licence's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Job creator is required.' }); // Return error
        } else {
                    var RefundD = Date.now()+ 410*2*24*60*60*1000
                    var dateRef = new Date(RefundD).toLocaleDateString( options);
                    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
          // Create the licence object for insertion into database
          const licence = new Licence({
            title: req.body.title, // Title field
            body: req.body.body,// Body field
            WorkWidth: req.body.WorkWidth,
            WorkLength:req.body.WorkLength,
            StartDate:req.body.StartDate,
            Client:req.body.Client,
            Address:req.body.Address,
            LicenceType:req.body.LicenceType,
            TMType:req.body.TMType,
            path: req.body.path,
            createdBy: req.body.createdBy,
            RefundDate: dateRef
            
            
            
          });
          // Save licence into database
          licence.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Licence saved!', licence }); // Return success message
            }
          });
        }
      }
    }
  });

  /* ===============================================================
     GET ALL LICENCES
  =============================================================== */
  router.get('/allLicences', (req, res) => {
    // Search database for all licence posts
    Licence.find({}, (err, licences) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if licences were found in database
        if (!licences) {
          res.json({ success: false, message: 'No Licences found.' }); // Return error of no licences found
        } else {
          res.json({ success: true, licences: licences }); // Return success and licences array
        }
      }
    }).sort({ '_id': -1 }); // Sort licences from newest to oldest
  });

  /* ===============================================================
     GET SINGLE LICENCE
  =============================================================== */
  router.get('/singleLicence/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No Licence ID was provided.' }); // Return error message
    } else {
      // Check if the licence id is found in database
      Licence.findOne({ _id: req.params.id }, (err, licence) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid Licence id' }); // Return error message
        } else {
          // Check if licence was found by id
          if (!licence) {
            res.json({ success: false, message: 'Licence not found.' }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                } else {
                  res.json({ success: true, licence: licence }); // Return success
                  // Check if the user who requested single licence is the one who created it
                 /*  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this licence.' }); 
                  } else {
                    res.json({ success: true, licence: licence }); // Return success
                  } */
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE LICENCE POST
  =============================================================== */
  router.put('/updateLicence', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No Licence id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Licence.findOne({ _id: req.body._id }, (err, licence) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid licence id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!licence) {
            res.json({ success: false, message: 'Licence id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting licence update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update licence post
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this licence post.' }); // Return error message
                  } else {
                    licence.title = req.body.title, // Title field
                    licence.body = req.body.body,// Body field
                    licence.WorkWidth = req.body.WorkWidth,
                    licence.WorkLength = req.body.WorkLength,
                    licence.StartDate = req.body.StartDate,
                    licence.Client = req.body.Client,
                    licence.Address = req.body.Address,
                    licence.LicenceType = req.body.LicenceType,
                    licence.TMType = req.body.TMType
                    licence.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Licence Updated!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DELETE LICENCE POST
  =============================================================== */
  router.delete('/deleteLicence/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.params.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this licence post' }); // Return error message
                  } else {
                    // Remove the licence from database
                    licence.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Licence deleted!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });
 /* ===============================================================
     CLOSE LICENCE POST
  =============================================================== */
  router.put('/closeLicence/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this licence post' }); // Return error message
                  } else {
                    if(!licence.close){
                    licence.close=true;
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Licence Closed!' }); // Return success message
                      }
                    });
                    }else{
                      licence.close=false;
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Licence Reopened!' }); // Return success message
                      }
                    });

                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  /* ===============================================================
     UPLOAD LICENCE POST
  =============================================================== */
  router.put('/uploadLicence/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.role !== 'TMP') {
                    res.json({ success: false, message: 'You are not authorized to delete this licence post' }); // Return error message
                  } else {
                    licence.phase3=true;
                    licence.phase2=false;
                    licence.LicencePath=req.body.LicencePath
                    licence.LvalidFrom= req.body.LvalidFrom,
                    licence.LvalidTo= req.body.LvalidTo,
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Licence Uploaded!' }); // Return success message
                      }
                    });
                    
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  /* ===============================================================
     POST-WORKS LICENCE  POST
  =============================================================== */
  router.put('/post-works/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this licence post' }); // Return error message
                  } else {
                    licence.phase5=true;
                    licence.phase4=false;
                    licence.pathPost=req.body.pathPost
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Post Work Photos Uploaded!' }); // Return success message
                      }
                    });
                    
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  /* ===============================================================
     APPLYING LICENCE POST
  =============================================================== */
  
  router.put('/ApplyingForLicence/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.role !== 'TMP') {
                    res.json({ success: false, message: 'You are not authorized to apply for this licence' }); // Return error message
                  } else {
                    licence.phase2=true;
                    licence.phase1=false;
                    var datee = Date.now()+ 14*24*60*60*1000
                    var date = new Date(datee).toLocaleDateString( options);
                    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    licence.reminderIfValid= date
                    
                    
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Applying for licence !' }); // Return success message
                      }
                    });
                    
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  /* ===============================================================
     COMPLETE WORKS LICENCE POST
  =============================================================== */
  
  router.put('/CompleteWorks/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if licence was found in database
          if (!licence) {
            res.json({ success: false, messasge: 'Licence was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete licence is the same user who originally posted the licence
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to apply for this licence' }); // Return error message
                  } else {
                    licence.phase6=true;
                    licence.phase5=false;
                    
                    
                    licence.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Works  Complete!' }); // Return success message
                      }
                    });
                    
                  }
                }
              }
            });
          }
        }
      });
    }
  });
    /* ===============================================================
     BOOK-WORKS LICENCE POST
  =============================================================== */

  router.put('/book-works', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No Licence id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Licence.findOne({ _id: req.body._id }, (err, licence) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid licence id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!licence) {
            res.json({ success: false, message: 'Licence id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting licence update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update licence post
                  if (user.username !== licence.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this licence post.' }); // Return error message
                  } else {
                    licence.WorksStartDate = req.body.WorksStartDate, // Title field
                    licence.WorksEndDate = req.body.WorksEndDate,
                    licence.phase3=false;
                    licence.phase4=true;
                    licence.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Works Booked!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     LIKE LICENCE POST (NOT USED)
  =============================================================== */
  router.put('/likeLicence', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid licence id' }); // Return error message
        } else {
          // Check if id matched the id of a licence post in the database
          if (!licence) {
            res.json({ success: false, message: 'That licence was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the licence post
                  if (user.username === licence.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the licence post before
                    if (licence.likedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (licence.dislikedBy.includes(user.username)) {
                        licence.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = licence.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                        licence.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        licence.likes++; // Increment likes
                        licence.likedBy.push(user.username); // Add username to the array of likedBy array
                        // Save licence post data
                        licence.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Licence liked!' }); // Return success message
                          }
                        });
                      } else {
                        licence.likes++; // Incriment likes
                        licence.likedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save licence post
                        licence.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Licence liked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DISLIKE LICENCE POST (NOT USED)
  =============================================================== */
  router.put('/dislikeLicence', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for licence post using the id
      Licence.findOne({ _id: req.body.id }, (err, licence) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid licence id' }); // Return error message
        } else {
          // Check if licence post with the id was found in the database
          if (!licence) {
            res.json({ success: false, message: 'That licence was not found.' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the licence post
                  if (user.username === licence.createdBy) {
                    res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (licence.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (licence.likedBy.includes(user.username)) {
                        licence.likes--; // Decrease likes by one
                        const arrayIndex = licence.likedBy.indexOf(user.username); // Check where username is inside of the array
                        licence.likedBy.splice(arrayIndex, 1); // Remove username from index
                        licence.dislikes++; // Increase dislikeds by one
                        licence.dislikedBy.push(user.username); // Add username to list of dislikers
                        // Save licence data
                        licence.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Licence disliked!' }); // Return success message
                          }
                        });
                      } else {
                        licence.dislikes++; // Increase likes by one
                        licence.dislikedBy.push(user.username); // Add username to list of likers
                        // Save licence data
                        licence.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Licence disliked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     COMMENT ON LICENCE POST
  =============================================================== */
  router.post('/comments', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for licence post in database
        Licence.findOne({ _id: req.body.id }, (err, licence) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid Licence id' }); // Return error message
          } else {
            // Check if id matched the id of any licence post in the database
            if (!licence) {
              res.json({ success: false, message: 'Licence not found.' }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); // Return error message
                  } else {
                    // Add the new comment to the licence post's array
                    licence.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user.username,// Person who commented
                      attachements:req.body.attachements 
                    });
                    // Save licence post
                    licence.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
  /* ===============================================================
     UPLOAD PHOTOS
  =============================================================== */
  router.post("https://us-central1-upload-rnce.cloudfunctions.net/uploadFile", upload.array("uploads[]", 12), function (req, res) {
    console.log('files', req.files);
    res.send(req.files);
  });
/* ===============================================================
     CREATE NEW NOTIFICATION
  =============================================================== */
  router.post("/notifications", (req, res) => {
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Job creator is required.' }); // Return error
        } else {
          User.findOne({username: req.body.createdBy}, (err, user) => {
            // Check if error was found or not
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              // Check if licences were found in database
              if (!user) {
                res.json({ success: false, message: 'No user found.' }); // Return error of no licences found
              } else {
                if(user.role === 'TMP'|| user.role === 'HS'){
                  Licence.findOne({title: req.body.title}, (err, licence) => {
                    // Check if error was found or not
                    if (err) {
                      res.json({ success: false, message: err }); // Return error message
                    } else {
                      // Check if licences were found in database
                      if (!licence) {
                        res.json({ success: false, message: 'No licence found.' }); // Return error of no licences found
                      } else {
                        User.find({}, (err, users) => {
                          // Check if error was found or not
                          if (err) {
                            res.json({ success: false, message: err }); // Return error message
                          } else {
                            // Check if licences were found in database
                            if (!users) {
                              res.json({ success: false, message: 'No users found.' }); // Return error of no licences found
                            } else {const seenlist = [];
                              for(let i =0; i < users.length; i++){
                                if(users[i].username !== licence.createdBy || users[i].role !== 'TMP' || users[i].role !== 'HS' || users[i].username !== req.body.createdBy){
                                  seenlist.push(users[i].username);
                                  
                                }
                              }
                              const notification = new Notification({
                                changesTo:req.body.title,
                                author: req.body.createdBy,
                                seen: seenlist,
                                action: req.body.action
                              
                            });
                            
                            // Save notification into database
                            notification.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Notification saved' }); // Return success message
                              }
                            });
                               
                            }
                          }
                        })
                         
                      }
                    }
                  })
                } else{
                  Licence.findOne({createdBy: req.body.createdBy}, (err, licence) => {
                    // Check if error was found or not
                    if (err) {
                      res.json({ success: false, message: err }); // Return error message
                    } else {
                      // Check if licences were found in database
                      if (!licence) {
                        res.json({ success: false, message: 'No licence found.' }); // Return error of no licences found
                      } else {
                        User.find({}, (err, users) => {
                          // Check if error was found or not
                          if (err) {
                            res.json({ success: false, message: err }); // Return error message
                          } else {
                            // Check if licences were found in database
                            if (!users) {
                              res.json({ success: false, message: 'No users found.' }); // Return error of no licences found
                            } else { seenlist = [];
                              for(let i =0; i < users.length; i++){
                                if((users[i].role !== 'TMP')&&(users[i].role !== 'HS')){
                                  seenlist.push(users[i].username);
                                  
                                }
                              }
                              const notification = new Notification({
                                changesTo:req.body.title,
                                author: req.body.createdBy,
                                seen: seenlist,
                                action: req.body.action
                              
                            });
                            
                            // Save notification into database
                            notification.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Notification saved' }); // Return success message
                              }
                            });
                            }
                          }
                        })
                         
                      }
                    }
                  })

                }
                 
              }
            }
          })
          // Create the notification object for insertion into database
          
        }
      
    
  });
 /* ===============================================================
     MARK AS SEEN NOTIFICATION
  =============================================================== */
  router.put("/seen", (req, res)=>{
    
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Notification.findOne({ _id: req.body.id }, (err, notification) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid notification id' }); // Return error message
        } else {
          // Check if id matched the id of a licence post in the database
          if (!notification) {
            res.json({ success: false, message: 'That notifications was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  
                        notification.seen.push(user.username); // Add liker's username into array of likedBy
                        // Save licence post
                        notification.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'notification seen!' }); // Return success message
                          }
                        });
                }
              }
            });
          }
        }
      });
    }
  });
/* ===============================================================
     GET ALL NOTIFICATIONS
  =============================================================== */
  router.get('/allNotifications', (req, res) => {
    // Search database for all licence posts
    Notification.find({}, (err, notificatons) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if licences were found in database
        if (!notificatons) {
          res.json({ success: false, message: 'No notifications found.' }); // Return error of no licences found
        } else {
          res.json({ success: true, notifications: notificatons }); // Return success and licences array
        }
      }
    }).sort({ '_id': -1 }); // Sort licences from newest to oldest
  });

  /* ===============================================================
     EMAIL NOTIFICATION SEND 
  =============================================================== */

  router.post('/send', (req, res) => {
    
      let transporter = nodemailer.createTransport({
         
          service: 'gmail',
 auth: {
        user: process.env.Gmail,
        pass: process.env.GPass
    }
      });
  
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"RNCE Notifications" <NotificationsRNCE@gmail.com>', // sender address
          to: req.body.to, // list of receivers
          subject: 'New Notification', // Subject line
          text: req.body.html, // plain text body
          html: req.body.html // html body
      };
  
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          res.json({message:'mail sent'})
         
      });
  });

  /* ===============================================================
     GET ALL USERS
  =============================================================== */
  router.get('/allUsers', (req, res) => {
    // Search database for all licence posts
    User.find({}, (err, users) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if licences were found in database
        if (!users) {
          res.json({ success: false, message: 'No users found.' }); // Return error of no licences found
        } else {
          res.json({ success: true, users: users }); // Return success and licences array
        }
      }
    }).select('email role');
  });

  /* ===============================================================
     GET SINGLE USER
  =============================================================== */

  router.get('/singleUser/:licenceC', (req, res) => {
    // Search database for all licence posts
    User.findOne({username: req.params.licenceC}, (err, user) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if licences were found in database
        if (!user) {
          res.json({ success: false, message: 'No user found.' }); // Return error of no licences found
        } else {
          res.json({ success: true, user: user }); // Return success and licences array
        }
      }
    }).select(' email '); 
  });

/* ===============================================================
     ADD NEW USER AS SEEN TO OLD NOTIFICATIONS
  =============================================================== */
  router.put('/updateNotification', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No licence id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Notification.findOne({ _id: req.body._id }, (err, notification) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid licence id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!notification) {
            res.json({ success: false, message: 'Licence id was not found.' }); // Return error message
          } else {
                    
            notification.seen.push(req.body.newUser);
            notification.save((err) => {
              if (err) {
                if (err.errors) {
                  res.json({ success: false, message: 'Please ensure form is filled out properly' });
                } else {
                  res.json({ success: false, message: err }); // Return error message
                }
              } else {
                res.json({ success: true, message: 'Notification Updated!' }); // Return success message
              }
            });
          }
            
           
          
        }
      })
    }
  });



  
/* ===============================================================
     AUTO EMAIL NOTIFICATION (phase1 reminder to apply)
  =============================================================== */

  const CronJob = require('cron').CronJob;
  const ApplyReminder = new CronJob({
    cronTime: '00 30 10 * * 1-5',
    onTick: function() {
      Licence.find({}, (err, licences) => {
        // Check if error was found or not
        if (err) {
          console.log(err) // Return error message
        } else {
          // Check if licences were found in database
          if (!licences) {
            console.log('no licence found') // Return error of no licences found
          } else {
             // Return success and licences array
             for(let i =0; i < licences.length; i++){
              const licenceSubject = licences[i].title
              const lincenceType = licences[i].LicenceType
              console.log(licenceSubject)
              if(licences[i].phase1){
                
                User.find({}, (err, users) => {
                  // Check if error was found or not
                  if (err) {
                    console.log(err) // Return error message
                  } else {
                    // Check if licences were found in database
                    if (!users) {
                      console.log('no users found') // Return error of no licences found
                    } else {
                      for(let i =0; i < users.length; i++){
                        if(users[i].role ==='TMP'){
                          let transporter = nodemailer.createTransport({
         
                            service: 'gmail',
                   auth: {
                          user: process.env.Gmail,
                          pass: process.env.GPass
                      }
                        });
                    
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"RNCE Reminder" <NotificationsRNCE@gmail.com>', // sender address
                            to: users[i].email, // list of receivers
                            subject: licenceSubject, // Subject line
                            text: 'Don&#39;t forget to apply for this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>', // plain text body
                            html:'Don&#39;t forget to apply for this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>' // html body
                        };
                    
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('message send')
                           
                        });
                        }
                      }
                      
                       // Return success and licences array
                    }
                  }
                })
          
          }
            }
          }
        }
      })
    },
    start: false,
    timeZone: 'Europe/Dublin'
  });
ApplyReminder.start()


/* ===============================================================
     AUTO EMAIL NOTIFICATION (licence expired reminder to close)
  =============================================================== */

  
  const CloseLicence = new CronJob({
    cronTime: '00 30 10 * * 1-5',
    onTick: function() {
      Licence.find({}, (err, licences) => {
        // Check if error was found or not
        if (err) {
          console.log(err) // Return error message
        } else {
          // Check if licences were found in database
          if (!licences) {
            console.log('no licence found') // Return error of no licences found
          } else {
             // Return success and licences array
             for(let i =0; i < licences.length; i++){
              const licenceSubject = licences[i].title
              const lincenceType = licences[i].LicenceType
              console.log(licenceSubject)
              if(((new Date (licences[i].LvalidTo)) <= (new Date())) && (!licences[i].close)||((licences[i].phase6)&& (!licences[i].close))){
                
                User.findOne({username: licences[i].createdBy}, (err, user) => {
                  // Check if error was found or not
                  if (err) {
                    console.log(err) // Return error message
                  } else {
                    // Check if licences were found in database
                    if (!user) {
                      console.log('no user found') // Return error of no licences found
                    } else {
                          let transporter = nodemailer.createTransport({
         
                            service: 'gmail',
                   auth: {
                          user: process.env.Gmail,
                          pass: process.env.GPass
                      }
                        });
                    
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"RNCE Reminder" <NotificationsRNCE@gmail.com>', // sender address
                            to: user.email, // list of receivers
                            subject: licenceSubject, // Subject line
                            text:'The Licence is no more valid you have to close this licence request:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>', // plain text body
                            html:'The Licence is no more valid.You have to close this licence request:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +
                                  '</strong><br /> P.S. Don&#39;t forget to upload Post Works Photos and Mark it as complete before you close it.' // html body
                        };
                        let mailOptions2 = {
                          from: '"RNCE Reminder" <NotificationsRNCE@gmail.com>', // sender address
                          to: user.email, // list of receivers
                          subject: licenceSubject, // Subject line
                          text:'The Licence is marked as Complete.You have to close this licence request:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>', // plain text body
                          html:'The Licence is marked as Complete.You have to close this licence request:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>' // html body
                      };
                    
                        // send mail with defined transport object
                       if(((new Date (licences[i].LvalidTo)) <= (new Date())) && (!licences[i].close)){
                        transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                              return console.log(error);
                          }
                          console.log('message send')
                         
                      });
                       }else{
                        transporter.sendMail(mailOptions2, (error, info) => {
                          if (error) {
                              return console.log(error);
                          }
                          console.log('message send2')
                         
                      });
                       }
                       
                      
                       // Return success and licences array
                    }
                  }
                })
          
          }
            }
          }
        }
      })
    },
    start: false,
    timeZone: 'Europe/Dublin'
  });
  CloseLicence.start()

/* ===============================================================
     AUTO EMAIL NOTIFICATION (refund reminder)
  =============================================================== */

  const RefundReminder = new CronJob({
    cronTime: '00 30 10 * * *',
    onTick: function() {
      Licence.find({}, (err, licences) => {
        // Check if error was found or not
        if (err) {
          console.log(err) // Return error message
        } else {
          // Check if licences were found in database
          if (!licences) {
            console.log('no licence found') // Return error of no licences found
          } else {
             // Return success and licences array
             for(let i =0; i < licences.length; i++){
              const licenceSubject = licences[i].title
              const lincenceType = licences[i].LicenceType
              console.log(licenceSubject)
              var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
              if(((new Date (licences[i].RefundReminder).toLocaleDateString(options)) === (new Date().toLocaleDateString(options)))){
                
                User.find({}, (err, users) => {
                  // Check if error was found or not
                  if (err) {
                    console.log(err) // Return error message
                  } else {
                    // Check if licences were found in database
                    if (!users) {
                      console.log('no users found') // Return error of no licences found
                    } else {
                      for(let i =0; i < users.length; i++){
                        if((users[i].role ==='TMP')|| (users[i].username === licences[i].createdBy)){
                          let transporter = nodemailer.createTransport({
         
                            service: 'gmail',
                   auth: {
                          user: process.env.Gmail,
                          pass: process.env.GPass
                      }
                        });
                    
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"RNCE Reminder" <NotificationsRNCE@gmail.com>', // sender address
                            to: users[i].email, // list of receivers
                            subject: licenceSubject +'REFUND', // Subject line
                            text: 'Don&#39;t forget to apply for this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>', // plain text body
                            html:'Don&#39;t forget to apply for REFUND for this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>' // html body
                        };
                    
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('message send')
                           
                        });
                        }
                      }
                      
                       // Return success and licences array
                    }
                  }
                })
          
          }
            }
          }
        }
      })
    },
    start: false,
    timeZone: 'Europe/Dublin'
  });
  RefundReminder.start()

  
 /* ===============================================================
     AUTO EMAIL NOTIFICATION (phase1 reminder to apply)
  =============================================================== */

  
  const reminderIfValid = new CronJob({
    cronTime: '00 30 10 * * *',
    onTick: function() {
      Licence.find({}, (err, licences) => {
        // Check if error was found or not
        if (err) {
          console.log(err) // Return error message
        } else {
          // Check if licences were found in database
          if (!licences) {
            console.log('no licence found') // Return error of no licences found
          } else {
             // Return success and licences array
             for(let i =0; i < licences.length; i++){
              const licenceSubject = licences[i].title
              const lincenceType = licences[i].LicenceType
              console.log(licenceSubject)
              var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
              if((licences[i].phase2)&&((new Date (licences[i].reminderIfValid).toLocaleDateString(options)) === (new Date().toLocaleDateString(options)))){
                
                User.find({}, (err, users) => {
                  // Check if error was found or not
                  if (err) {
                    console.log(err) // Return error message
                  } else {
                    // Check if licences were found in database
                    if (!users) {
                      console.log('no users found') // Return error of no licences found
                    } else {
                      for(let i =0; i < users.length; i++){
                        if(users[i].role ==='TMP'){
                          let transporter = nodemailer.createTransport({
         
                            service: 'gmail',
                   auth: {
                          user: process.env.Gmail,
                          pass: process.env.GPass
                      }
                        });
                    
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"RNCE Reminder" <NotificationsRNCE@gmail.com>', // sender address
                            to: users[i].email, // list of receivers
                            subject: licenceSubject +'Check Status', // Subject line
                            text:'Please check the status this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>', // plain text body
                            html:'Please check the status this licence:'+'<strong>'+ licenceSubject +'</strong> Type: <strong>' + lincenceType +'</strong>' // html body
                        };
                    
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('message send')
                           
                        });
                        }
                      }
                      
                       // Return success and licences array
                    }
                  }
                })
          
          }
            }
          }
        }
      })
    },
    start: false,
    timeZone: 'Europe/Dublin'
  });
  reminderIfValid.start()

  return router;
};

