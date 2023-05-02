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
![Screenshot_22](https://user-images.githubusercontent.com/112005397/235750362-fbb20fda-59a8-4dd4-b4e5-4b40a69b6fd4.png)

Automatically creates image element of .png, .jpg and .gif files
![image](https://user-images.githubusercontent.com/112005397/235750524-0da40c21-d893-4efc-849a-99b829649504.png)

Automatically view content of .txt and .md files
![image](https://user-images.githubusercontent.com/112005397/235750785-eeb6d27c-ab44-4b73-8e9b-230d14581498.png)
