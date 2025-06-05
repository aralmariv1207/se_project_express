const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Access request information
  console.log("Error occurred on:", req.method, req.url);
  console.log("Request body:", req.body);
  console.log("Query parameters:", req.query);

  // If response hasn't been sent yet, handle the error
  if (!res.headersSent) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
  // If headers were already sent, delegate to Express default error handler
  return next(err);
};

module.exports = { errorHandler };
