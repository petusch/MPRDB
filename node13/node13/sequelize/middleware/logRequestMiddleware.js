import Request from '../log/Request';

const logRequestsMiddleware = (req, res, next) => {
  const {
    connection: { remoteAddress: clientIp },
    path,
  } = req;
  const userAgent = req.get('User-Agent');

  const request = new Request({
    clientIp: clientIp,
    date: new Date(),
    path,
    userAgent,
  });
console.log("request:  " + path);
  request.save();

  next();
};

export default logRequestsMiddleware;