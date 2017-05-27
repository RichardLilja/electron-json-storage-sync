'use strict';

const m = require('mochainon');
const path = require('path');
const fs = require('fs');
const storage = require('../lib/storage');
const utils = require('../lib/utils');

describe('Electron JSON storage sync', function () {

  this.timeout(20000);

  beforeEach(storage.clear);

  describe('.set(key, data)', function() {

    it('should return result object with status false if invalid key', function() {
      m.chai.expect(storage.set(null, {}).status).to.be.false;
      m.chai.expect(storage.set('  ', {}).status).to.be.false;
      m.chai.expect(storage.set(123, {}).status).to.be.false;
    });

    it('should return result object with status false if data is not a valid JSON object', function() {
      let obj = {};
      m.chai.expect(storage.set('foo', obj.a = {b: obj}).status).to.be.false;
      m.chai.expect(storage.set('foo', undefined).status).to.be.false;
    });

    it('should be able to store a valid JSON object', function() {
      const result = storage.set('foo', {bar:'baz'}).status;
      m.chai.expect(result).to.be.true;
    });

    describe('given an existing stored key', function() {

      beforeEach(function() {
        storage.set('foo', {bar:'baz'});
      });

      it('should be able to override the stored key', function() {
        storage.set('foo', {bar:'not baz'});
        const result = storage.get('foo');
        m.chai.expect(result.status).to.be.true;
        m.chai.expect(result.data).to.deep.equal({bar:'not baz'});
      });

    });

  });

  describe('.get(key)', function() {

    beforeEach(function() {
      storage.set('foo', {bar:'baz'});
    });

    afterEach(function() {
      storage.clear();
    });

    it('should return result object with status false if key is not valid', function() {
      m.chai.expect(storage.get(null).status).to.be.false;
      m.chai.expect(storage.get('  ').status).to.be.false;
      m.chai.expect(storage.get(123).status).to.be.false;
    });

    it('should return result object with status false if file is not available', function() {
      m.chai.expect(storage.get('notafile').status).to.be.false;
    });

    it('should return result object with status true and valid data if file is available', function() {
      const result = storage.get('foo');
      m.chai.expect(result.status).to.be.true;
      m.chai.expect(result.data).to.deep.equal({bar:'baz'});
    });

  });

  describe('.clear()', function() {

    beforeEach(function() {
      storage.set('foo', {bar:'baz'});
      storage.set('bar', {bar:'baz'});
    });

    it('should clear all .json files in the storage directory', function() {
      const result = storage.clear();
      m.chai.expect(result.status).to.be.true;
      m.chai.expect(storage.get('foo').status).to.be.false;
      m.chai.expect(storage.get('bar').status).to.be.false;
    });

    it('should only remove .json files', function() {
      const storageDir = utils.getStorageDir();
      const filePath = path.join(storageDir, 'test.txt');
      fs.writeFileSync(filePath, 'abc123', 'utf8');
      storage.clear();
      const txt = fs.readFileSync(filePath, 'utf8');
      m.chai.expect(txt).to.equal('abc123');
    });

  });

  describe('.keys()', function() {

    beforeEach(function() {
      storage.set('foo', {bar:'baz'});
      storage.set('bar', {bar:'baz'});
    });

    afterEach(function() {
      storage.clear();
    });

    it('should return all keys present in the storage directory', function() {
      const jsonFiles = storage.keys().data;
      m.chai.expect(jsonFiles).to.be.an('array').that.include('foo', 'bar');
    });

    it('should not create keys of files that are not json files', function() {
      const storageDir = utils.getStorageDir();
      const filePath = path.join(storageDir, 'test.txt');
      fs.writeFileSync(filePath, 'abc123', 'utf8');
      const jsonFiles = storage.keys().data;
      m.chai.expect(jsonFiles).to.be.an('array').that.include('foo', 'bar');
    });

    it('should return success object with empty array if no keys are available', function() {
      storage.clear();
      const jsonFiles = storage.keys().data;
      m.chai.expect(jsonFiles).to.be.an('array').that.is.empty;
    });

  });

  describe('.remove(key)', function() {

    beforeEach(function() {
      storage.set('foo', {bar:'baz'});
      storage.set('bar', {bar:'baz'});
    });

    afterEach(function() {
      storage.clear();
    });

    it('should only remove a json file matching the key', function() {
      storage.remove('foo');
      const jsonFiles = storage.keys().data;
      m.chai.expect(jsonFiles).to.not.include('foo');
      m.chai.expect(jsonFiles).to.include('bar');
    });

    it('should not remove files of with extensions other than .json', function() {
      const storageDir = utils.getStorageDir();
      const filePath = path.join(storageDir, 'foo.txt');
      fs.writeFileSync(filePath, 'abc123', 'utf8');
      storage.remove('foo');
      const txt = fs.readFileSync(filePath, 'utf8');
      m.chai.expect(txt).to.equal('abc123');
    });

  });

  describe('.has(key)', function() {

    beforeEach(function() {
      storage.set('foo', {bar:'baz'});
      storage.set('bar', {bar:'baz'});
    });

    afterEach(function() {
      storage.clear();
    });

    it('should return success object with data true if key is found', function() {
      const result = storage.has('foo').data;
      m.chai.expect(result).to.be.true;
    });

    it('should return success object with data false if key is not found', function() {
      const result = storage.has('baz').data;
      m.chai.expect(result).to.be.false;
    });

  });

});
