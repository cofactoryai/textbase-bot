export function getAPIURL(){
    let url = process.env.REACT_APP_API_URL || 'http://localhost:9001/';
    let devMode = 'prod'
    return {
        url,
        devMode
    }
}
