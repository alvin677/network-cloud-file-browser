# Wifi File Browser
Browse files on a computer through the web-browser. Download files, view images and read text documents.

# Installation Guide
To set this up, download the **app.js** file and use **Node.js** (https://nodejs.org/en) to run it.
There are no other requirements except for the standard node libraries.

Type the following command in your **command line** (CMD, Terminal or other) after installing Node.js:
```
node app.js
```

In the **files** folder, you can create/put files or folders that you want to be viewable through the web-server. 
After running the app.js program, you can go on the web page.
If you're running it on the same machine you want to test it on, just open up your web browser and search:
```localhost:80/files```

If you're running it on a server like a **Raspberry Pi** then you need to find the IPv4 Address of your server:
```ifconfig```
or
```ipconfig```
depending on operating system.

Then enter the IPv4 address following with ':80/files'
*example:* 
```192.168.58.19:80/files```

# Screenshots
