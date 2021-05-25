# find-unused-types

Run by `node run.js <dir>`

Sample output:

```
node run.js ~/path/to/repo


The following types may not be used:
Because there is buildin types:
        - jest
        - markdown-to-jsx
        - nock
        - webpack
        - webpackbar

Because the corresponding deps is not used:
        - babel__core
        - cordova
        - css-font-loading-module
        - cucumber
        - dropbox-chooser
        - enhanced-resolve
        - estree
        - events
        - gapi
        - gapi.auth2
        - gapi.client.drive
        - gapi.client.sheets
        - gapi.people
        - googlemaps
        - grecaptcha
        - js-yaml
        - markdown-to-jsx
        - netease-captcha
        - node
        - puppeteer
        - query-string
        - react-motion
        - semver
        - stripe-v3
        - testing-library__jest-dom
        - webpack-env
```
