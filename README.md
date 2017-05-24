# electron-json-storage-sync

> Synchronously write and read user settings in Electron apps

This is a synchronous version of [electron-json-storage](https://github.com/jviotti/electron-json-storage). Credits to [jviotti](https://github.com/jviotti) for writing the original async version. Version 1.0.0 only implements methods .set, .get and .clear.

Installation
------------

Install `electron-json-storage-sync` by running:

```sh
$ npm install --save electron-json-storage-sync
```

You can require this module from either the **main** or **renderer** process (with and without `remote`).

Documentation
-------------

### Storage module
```javascript
const storage = require('electron-json-storage-sync');
```

### .get(key)
```javascript
const result = storage.get('foo');
if (result.status) {
  // do something with result.data
} else {
  // handle result.error
}
```

### .set(key, data)
```javascript
const result = storage.set('foo', {bar:'baz'});
if (result.status) {
  // data has been stored
} else {
  // handle result.error
}
```

### .clear()
```javascript
const result = storage.clear();
if (result.status) {
  // storage has been cleared
} else {
  // handle result.error
}
```
