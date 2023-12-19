/**
 * This File holds Function and Constants for handling HTTP Responses
 */

const responseMessages = {
  NOT_FOUND: 'Content Not Found',
  INTERNAL_SERVER: 'Internal Server Error',
  OK: 'Operation Successful',
  UNAUTHORIZED: 'Unauthorized',
  BAD_REQUEST: 'Bad Request',
};

const responseCodes = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const responseHandlers = {
  ok: handle200,
  notFound: handle404,
  internalServer: handle500,
  unauthorized: handle401,
  badRequest: handle400,
};

function handle200(req, res, end = false) {
  res.writeHead(responseCodes.OK);

  if (end) {
    res.end();
  }
}

function handle400(req, res, end = false) {
  res.writeHead(responseCodes.BAD_REQUEST);

  if (end) {
    res.end();
  }
}

function handle401(req, res, end = false) {
  res.writeHead(responseCodes.UNAUTHORIZED);

  if (end) {
    res.end();
  }
}

function handle404(req, res, end = false) {
  res.writeHead(responseCodes.NOT_FOUND);

  if (end) {
    res.end();
  }
}

function handle500(req, res, end = false) {
  res.writeHead(responseCodes.INTERNAL_SERVER);

  if (end) {
    res.end();
  }
}

module.exports = { responseCodes, responseMessages, responseHandlers };
