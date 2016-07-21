# interactive-brexit-companion

Usage
=====

Setup
-----
`npm install`

Development
-----------
`npm start`

Production / deployment
-----------------------

Deploy using [riff-raff](https://github.com/guardian/riff-raff)

Coding style and linting
------------------------
`npm run lint`

We are using a modified version of [AirBnB's JavaScript Style Guide](style-guide.md).

Nginx configuration
-------------------

Follow these [nginx setup](doc/nginx-setup.md) instructions

Using third party js
--------------------
1. Install package using JSPM e.g.

	`jspm install reqwest` or

	`jspm install github:guardian/iframe-messenger`

2. Import package. e.g.

	`import reqwest from 'reqwest'` or

	`import reqwest from 'guardian/iframe-messenger'`

Text/JSON in javascript
-----------------------
```
import someHTML from './text/template.html!text'
import someJSON from './data/data.json!json'
```

Test Harness
============

* `index.html` - Stripped down test harness. Includes frontend fonts and curl for loading boot.js.
* `immersive.html` - Immersive-style interactive page pulled from theguardian.com
* [`interactive.html`](http://localhost:8000/interactive.html) - Interactive page pulled from theguardian.com
