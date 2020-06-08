JS Workflows
============

This directory contains custom workflows for [YouTrack](https://www.jetbrains.com/youtrack/),
written on JS-based API, available since YouTrack 2017.3. 

Set up
------

This project is NPM-based and allows downloading workflows are JS-scripts
from youtrack server and uploading them back to server.

Suggested NPM version is 8.9.1 or higher.

Run `npm i` to install development dependencies.

The following servers are supported:
* Standalone YouTrack server, both HTTP and HTTPS
* YouTrack InCloud - get one for free [here](https://www.jetbrains.com/youtrack/download/get_youtrack.html#section=incloud)

Each server requires a list of properties to be set using `npm config set` command.
For example, to set a token in the following section, use the following command 
(replace the token with your own one):

`npm config set token_test perm:cm9vdA==.V29ya2Zsb3dz.20nG7GXwrS9LO50ruPXfWH3YaZcNCo`

You can easily check the current values of your parameters with the following command:
 
`npm config list` 

### Standalone server without special SSL settings

* `token_own`: permanent token for your account on this server (see 
[Manage-Permanent-Token](https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html))
* `host_own`: url of your server (e.g. "http://localhost:8081")

### Standalone server with private signed SSL certificate

* `token_ssl`: permanent token for your account on this server (see 
[Manage-Permanent-Token](https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html))
* `host_ssl`: url of your server (e.g. "http://localhost:8081")
* `cert_ssl`: path to certificate for the server (see below how to get it)

### How to get certificate from your server

* Open your server in Chrome.
* Open developer tools and to to Security tab.
* Export certificate from that tab.

Valid commands
--------------

```
# At your own instance
npm run list-own
npm run download-own -- <wf-name>
npm run upload-own -- <wf-name>

# At your own instance with private signed SSL certificate
npm run list-ssl
npm run download-ssl -- <wf-name>
npm run upload-ssl -- <wf-name>

# Make a ZIP archive to upload it to YouTrack manually
npm run zip -- <wf-name>
```
