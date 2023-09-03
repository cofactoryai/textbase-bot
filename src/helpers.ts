export function getAPIURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const apiParam = urlParams.get('API_URL');
  let url = process.env.REACT_APP_API_URL || 'http://localhost:9001/';
  let devMode = 'prod';
  if (apiParam) {
    url = apiParam;
    devMode = 'local';
  }

  return {
    url,
    devMode,
  };
}
