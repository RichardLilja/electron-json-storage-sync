'use strict';

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const fs = require('fs');
const utils = require('./utils');

exports.set = function(key, data) {

  let filePath;
  try {
    filePath = utils.getFilePath(key);
  } catch (err) {
    return utils.createErrorObject(err);
  }

  let stringifiedJson;
  try {
    stringifiedJson = JSON.stringify(data);
  } catch (err) {
    return utils.createErrorObject(err);
  }

  // testing for undefined since it's not throwing on JSON.stringify.
  // However it will throw on JSON.parse
  if (!stringifiedJson) {
    return utils.createErrorObject(new Error('Invalid JSON object'));
  }

  try {
    mkdirp.sync(utils.getStorageDir());
  } catch (err) {
    return utils.createErrorObject(err);
  }

  try {
    fs.writeFileSync(filePath, stringifiedJson, 'utf8');
  } catch (err) {
    return utils.createErrorObject(err);
  }

  return utils.createSuccessObject(data);
};

exports.get = function(key) {

   let filePath;
   try {
     filePath = utils.getFilePath(key);
   } catch (err) {
     return utils.createErrorObject(err);
   }

   let data;
   try {
     data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   } catch (err) {
     return utils.createErrorObject(err);
   }

   return utils.createSuccessObject(data);
};

exports.clear = function() {
  const storageDir = utils.getStorageDir();
  const jsonFiles = path.join(storageDir, '*.json');

  try {
    rimraf.sync(jsonFiles);
  } catch (err) {
    return utils.createErrorObject(err);
  }

  return utils.createSuccessObject({});
};
