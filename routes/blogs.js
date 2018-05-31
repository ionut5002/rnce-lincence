const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
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

  /* ===============================================================
     CREATE NEW JOB
  =============================================================== */
  router.post('/newBlog', (req, res) => {
    // Check if job title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Job title is required.' }); // Return error message
    } else {
      // Check if job body was provided
      if (!req.body.body) {
        res.json({ success: false, message: 'Job body is required.' }); // Return error message
      } else {
        // Check if job's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Job creator is required.' }); // Return error
        } else {
          // Create the job object for insertion into database
          const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            path: req.body.path,
            JobNo: req.body.JobNo,
            createdBy: req.body.createdBy,
            Client:req.body.Client,
            StartDate:req.body.StartDate,
            SpeedOfRoad:req.body.SpeedOfRoad,
            RoadWidth:req.body.RoadWidth,
            CarriagewayType:req.body.CarriagewayType,
            RoadLevel:req.body.RoadLevel,
            Volume:req.body.Volume,
            WorksType:req.body.WorksType,
            WorksHours:req.body.WorksHours,
            LocationOnRoad:req.body.LocationOnRoad,
            TypeOfTrafficCR:req.body.TypeOfTrafficCR,
            Address: req.body.Address,
            LocationMap: req.body.LocationMap,
            LicenceRequired:req.body.LicenceRequired,
            emergency:req.body.emergency,
            SafetyFolder:req.body.SafetyFolder,
            PSCS:req.body.PSCS,
            PSDP:req.body.PSDP
          });
          // Save job into database
          blog.save((err) => {
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
              res.json({ success: true, message: 'Job saved!', blog }); // Return success message
            }
          });
        }
      }
    }
  });

  /* ===============================================================
     GET ALL JOBS
  =============================================================== */
  router.get('/allBlogs', (req, res) => {
    // Search database for all job posts
    Blog.find({}, (err, blogs) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if jobs were found in database
        if (!blogs) {
          res.json({ success: false, message: 'No Jobs found.' }); // Return error of no jobs found
        } else {
          res.json({ success: true, blogs: blogs }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort jobs from newest to oldest
  });

  /* ===============================================================
     GET SINGLE JOB
  =============================================================== */
  router.get('/singleBlog/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No Job ID was provided.' }); // Return error message
    } else {
      // Check if the job id is found in database
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid Job id' }); // Return error message
        } else {
          // Check if job was found by id
          if (!blog) {
            res.json({ success: false, message: 'Job not found.' }); // Return error message
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
                  res.json({ success: true, blog: blog }); // Return success
                  
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE JOB POST
  =============================================================== */
  router.put('/updateBlog', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No Job id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Blog.findOne({ _id: req.body._id }, (err, blog) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'Job id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting job update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update job post
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                  } else {
                    blog.title = req.body.title;
                    blog.JobNo = req.body.JobNo; 
                    blog.body = req.body.body;
                    blog.Client = req.body.Client;
                    blog.StartDate = req.body.StartDate;
                    blog.SpeedOfRoad = req.body.SpeedOfRoad;
                    blog.RoadWidth = req.body.RoadWidth;
                    blog.CarriagewayType = req.body.CarriagewayType;
                    blog.RoadLevel = req.body.RoadLevel;
                    blog.Volume = req.body.Volume;
                    blog.WorksType = req.body.WorksType;
                    blog.WorksHours = req.body.WorksHours;
                    blog.LocationOnRoad = req.body.LocationOnRoad;
                    blog.TypeOfTrafficCR = req.body.TypeOfTrafficCR;
                    blog.Address = req.body.Address;
                    blog.LocationMap = req.body.LocationMap;
                    blog.LicenceRequired = req.body.LicenceRequired;
                    blog.emergency = req.body.emergency;
                    blog.SafetyFolder = req.body.SafetyFolder;
                    blog.PSCS = req.body.PSCS;
                    blog.PSDP = req.body.PSDP;

                    blog.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Job Updated!' }); // Return success message
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
     DELETE JOB POST
  =============================================================== */
  router.delete('/deleteBlog/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if job was found in database
          if (!blog) {
            res.json({ success: false, messasge: 'Job was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to delete job
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to delete job is the same user who originally posted the blog
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this blog post' }); // Return error message
                  } else {
                    // Remove the job from database
                    blog.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Job deleted!' }); // Return success message
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
     CLOSE JOB POST
  =============================================================== */
  router.put('/closeBlog/', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.body.id) {
      res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
      // Check if id is found in database
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
          // Check if job was found in database
          if (!blog) {
            res.json({ success: false, messasge: 'Job was not found' }); // Return error message
          } else {
            // Get info on user who is attempting to close job
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user attempting to close job is the same user who originally posted the blog
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this blog post' }); // Return error message
                  } else {
                    if(!blog.close){
                    blog.close=true;
                    blog.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Job Closed!' }); // Return success message
                      }
                    });
                    }else{
                      blog.close=false;
                    blog.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Job Reopened!' }); // Return success message
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
     LIKE JOB POST (NOT USED)
  =============================================================== */
  router.put('/likeBlog', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid job id' }); // Return error message
        } else {
          // Check if id matched the id of a job post in the database
          if (!blog) {
            res.json({ success: false, message: 'That job was not found.' }); // Return error message
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
                  // Check if user who liked post is the same user that originally created the job post
                  if (user.username === blog.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the job post before
                    if (blog.likedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (blog.dislikedBy.includes(user.username)) {
                        blog.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = blog.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                        blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        blog.likes++; // Increment likes
                        blog.likedBy.push(user.username); // Add username to the array of likedBy array
                        // Save blog post data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Job liked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.likes++; // Incriment likes
                        blog.likedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save blog post
                        blog.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Job liked!' }); // Return success message
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
     DISLIKE JOB POST (NOT USED)
  =============================================================== */
  router.put('/dislikeBlog', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for job post using the id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid job id' }); // Return error message
        } else {
          // Check if job post with the id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'That job was not found.' }); // Return error message
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
                  // Check if user who disliekd post is the same person who originated the job post
                  if (user.username === blog.createdBy) {
                    res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (blog.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (blog.likedBy.includes(user.username)) {
                        blog.likes--; // Decrease likes by one
                        const arrayIndex = blog.likedBy.indexOf(user.username); // Check where username is inside of the array
                        blog.likedBy.splice(arrayIndex, 1); // Remove username from index
                        blog.dislikes++; // Increase dislikeds by one
                        blog.dislikedBy.push(user.username); // Add username to list of dislikers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Job disliked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.dislikes++; // Increase likes by one
                        blog.dislikedBy.push(user.username); // Add username to list of likers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Job disliked!' }); // Return success message
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
     COMMENT ON JOB POST
  =============================================================== */
  router.post('/comment', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for job post in database
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid Job id' }); // Return error message
          } else {
            // Check if id matched the id of any job post in the database
            if (!blog) {
              res.json({ success: false, message: 'Job not found.' }); // Return error message
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
                    // Add the new comment to the job post's array
                    blog.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user.username,// Person who commented
                      attachements:req.body.attachements 
                    });
                    // Save job post
                    blog.save((err) => {
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
          // Create the notification object for insertion into database
          const notification = new Notification({
              changesTo:req.body.title,
              author: req.body.createdBy,
            
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
      
    
  });
 /* ===============================================================
     MARK AS SEEN A NOTIFICATION
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
          // Check if id matched the id of a blog post in the database
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
                        // Save blog post
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
    // Search database for all blog posts
    Notification.find({}, (err, notificatons) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!notificatons) {
          res.json({ success: false, message: 'No notifications found.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, notifications: notificatons }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
  });

  /* ===============================================================
     SEND EMAIL NOTIFICATION
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
    // Search database for all blog posts
    User.find({}, (err, users) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!users) {
          res.json({ success: false, message: 'No users found.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, users: users }); // Return success and blogs array
        }
      }
    }).select('email role');
  });
/* ===============================================================
     GET SINGLE USER
  =============================================================== */
  router.get('/singleUser/:blogC', (req, res) => {
    // Search database for all blog posts
    User.findOne({username: req.params.blogC}, (err, user) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!user) {
          res.json({ success: false, message: 'No user found.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, user: user }); // Return success and blogs array
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
      res.json({ success: false, message: 'No blog id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Notification.findOne({ _id: req.body._id }, (err, notification) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!notification) {
            res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
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

  


  return router;
};

