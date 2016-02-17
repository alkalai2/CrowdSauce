# json-parse
> Curried function that calls `JSON.parse` on provided input returning either the parsed JSON or the specified default value if the data fails to parse as valid JSON instead of throwing a `SyntaxError`.

[![Build Status](http://img.shields.io/travis/wilmoore/json-parse.js.svg)](https://travis-ci.org/wilmoore/json-parse.js) [![Code Climate](https://codeclimate.com/github/wilmoore/json-parse.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/json-parse.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install json-parse --save
```

> You can also use Duo, Bower or [download the files manually](https://github.com/wilmoore/json-parse.js/releases).

###### npm stats

[![npm](https://img.shields.io/npm/v/json-parse.svg)](https://www.npmjs.org/package/json-parse) [![NPM downloads](http://img.shields.io/npm/dm/json-parse.svg)](https://www.npmjs.org/package/json-parse) [![David](https://img.shields.io/david/wilmoore/json-parse.js.svg)](https://david-dm.org/wilmoore/json-parse.js)

## Overview

Similar to `try { return JSON.parse } …` but more functional and compositionally friendly.

## API Example

###### Basic

```js
var parse = require('json-parse')

parse([])('[1,2,3]')
//=> [ 1, 2, 3 ]

parse([])('[1,2,3')
//=> []
```

###### Pointfree Style

```js
var parse = require('json-parse')

Promise.resolve('[1,2,3]')
.then(parse([]))
.then(sum)
//=> 6

Promise.resolve(undefined)
.then(parse([]))
.then(sum)
//=> 0
```

## API

### `parse(defaultValue, data)`

###### arguments

 - `defaultValue (*)` Default value to return if given data does not parse as valid JSON.
 - `data (*)` Data to parse as JSON.

###### returns

 - `(*)` JavaScript value corresponding to parsed data.

## Alternatives

 - [parse-json]
 - [safe-json-parse]

## Contributing

> SEE: [contributing.md](contributing.md)

## Licenses

[![GitHub license](https://img.shields.io/github/license/wilmoore/json-parse.js.svg)](https://github.com/wilmoore/json-parse.js/blob/master/license)

[parse-json]: https://www.npmjs.com/package/parse-json
[safe-json-parse]: https://www.npmjs.com/package/safe-json-parse
