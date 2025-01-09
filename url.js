
let fullURL = window.location.href;
console.log(fullURL);
let protocol = window.location.protocol;
console.log(protocol);
let host = window.location.host;
console.log(host);
let hostname = window.location.hostname;
console.log(hostname);
let pathname = window.location.pathname;
console.log(pathname);
let queryString = window.location.search;
console.log(queryString);
let hash = window.location.hash;
console.log(hash);
let endpoint = window.location.pathname;    // e.g., /path/to/page
console.log("Endpoint:", endpoint);

    import url from 'url';
{// import url from 'url';

    // Example URL to parse
    let urlString = 'https://example.com/path/to/page?query=1#section';
    // Parse the URL
    let parsedUrl = new URL(urlString);
        console.log("Full URL:", parsedUrl.href);
        console.log("Protocol:", parsedUrl.protocol);
        console.log("Host:", parsedUrl.host);
        console.log("Hostname:", parsedUrl.hostname);
        console.log("Pathname:", parsedUrl.pathname);
        console.log("Query String:", parsedUrl.search);
        console.log("Hash:", parsedUrl.hash);

}
