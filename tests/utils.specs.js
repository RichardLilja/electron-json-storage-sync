'use strict';

const m = require('mochainon');
const path = require('path');
const utils = require('../lib/utils');

describe('Utils', function() {

  this.timeout(20000);

  describe('.getStorageDir()', function() {

    it('should return an absolute path', function() {
      const storagePath = utils.getStorageDir();
      m.chai.expect(path.isAbsolute(storagePath)).to.be.true;
    });

    it('directory should be child of electron userData directory', function() {
      const storageDir = utils.getStorageDir();
      const userDataDir = utils.getUserDataDir();
      m.chai.expect(path.resolve(storageDir, '../')).to.equal(userDataDir);
    });

  });

  describe('.getFilePath(key)', function() {

    it('should throw if key is not of type string', function() {

      m.chai.expect(function() {
        utils.getFilePath();
      }).to.throw('Invalid Key');

      m.chai.expect(function() {
        utils.getFilePath(123);
      }).to.throw('Invalid Key');

    });

    it('should throw if key is empty string', function() {

      m.chai.expect(function() {
        utils.getFilePath('');
      }).to.throw('Invalid Key');

      m.chai.expect(function() {
        utils.getFilePath('   ');
      }).to.throw('Invalid Key');

    });

    it('should append the .json extension automatically', function() {
      const fileName = path.basename(utils.getFilePath('foo'));
      m.chai.expect(fileName).to.equal('foo.json');
    });

    it('should not add .json twice', function() {
      const fileName = path.basename(utils.getFilePath('foo.json'));
      m.chai.expect(fileName).to.equal('foo.json');
    });

    it('should preserve an extension other than .json', function() {
      const fileName = path.basename(utils.getFilePath('foo.data'));
      m.chai.expect(fileName).to.equal('foo.data.json');
    });

    it('should return an absolute path', function() {
      const filePath = utils.getFilePath('foo');
      m.chai.expect(path.isAbsolute(filePath)).to.be.true;
    });

    it('should encode special characters', function() {
      const fileName = path.basename(utils.getFilePath('foo?bar:baz'));
      m.chai.expect(fileName).to.equal('foo%3Fbar%3Abaz.json');
    });

  });

});
