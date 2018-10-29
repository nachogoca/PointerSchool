# PointerSchool
Web application which shows graphically and interactively how pointers work.

## Getting Started - View the site locally
There are a number of ways to view this site locally.

### Using PHP
```bash
cd path/to/PointerSchool
php -S localhost:8000
```

You will serve the site on `http://localhost:8000/` and be accessible in your browser.

### Using Node.js
```bash
npm install -g http-server
cd path/to/PointerSchool
http-server
```

Will serve the site on:
```bash
http://127.0.0.1:8080
```

## How it works
* Hit "Visualize execution"
* Confirm the console changes from "Welcome to console." to "compliation success"
* Hit "Forward"
* You will now see the code in the editor run through the `int main()` block line by line
