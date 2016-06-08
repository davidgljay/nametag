export default function errorLog(msg) {
  return function error(err) {
    console.log(msg + (err || ': ') + err);
  };
};
