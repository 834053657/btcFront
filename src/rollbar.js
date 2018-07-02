import Rollbar from 'rollbar';

// Track error by rollbar.com
if (location.host === '47.106.111.213:9060') {
  Rollbar.init({
    accessToken: 'cecdbce666034b4fa14ec98fb1b69d60',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'test',
    },
  });
}
