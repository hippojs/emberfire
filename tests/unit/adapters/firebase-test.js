/* jshint expr:true */
import {
  describeModule,
  it
} from 'ember-mocha';

import MockFirebase from 'mock-firebase';
import sinon from 'sinon';

describeModule('adapter:firebase', 'FirebaseAdapter', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {

    describe('#init', function () {

      it('throws an error when the firebase property is not supplied', function() {
        assert.throws(function() {
          this.subject();
        });
      });

    });

    describe('#applyQueryToRef', function () {
      var mockFirebase, adapter, ref;

      beforeEach(function () {
        mockFirebase = new MockFirebase('https://emberfire-demo.firebaseio.com');
        adapter = this.subject({
          firebase: mockFirebase
        });
        ref = mockFirebase.ref();
        // mock ref doesnt support the new query stuff, yet
        ref.orderByKey = function () { return this; };
        ref.orderByPriority = function () { return this; };
        ref.orderByChild = function () { return this; };
        ref.limitToFirst = function () { return this; };
        ref.limitToLast = function () { return this; };
        ref.startAt = function () { return this; };
        ref.endAt = function () { return this; };
        ref.equalTo = function () { return this; };
      });

      it('defaults to orderByKey', function () {
        var spy = sinon.spy(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, {});
        assert(spy.calledOnce, 'orderByKey should be called');
      });

      it('orderBy: `_key` calls orderByKey', function () {
        var spy = sinon.spy(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, { orderBy: '_key' });
        assert(spy.calledOnce, 'orderByKey should be called');
      });

      it('orderBy: `_priority` calls orderByPriority', function () {
        var spy = sinon.spy(ref, 'orderByPriority');

        adapter.applyQueryToRef(ref, { orderBy: '_priority' });
        assert(spy.calledOnce, 'orderByPriority should be called');
      });

      it('orderBy: `x` calls orderByChild(x)', function () {
        var spy = sinon.spy(ref, 'orderByChild');

        adapter.applyQueryToRef(ref, { orderBy: 'x' });
        assert(spy.calledWith('x'), 'orderByChild should be called with `x`');
      });

      ['limitToFirst', 'limitToLast', 'startAt', 'endAt', 'equalTo'].forEach(function (key) {

        it(`calls ${key} and passes through value when specified`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = 'value';

          adapter.applyQueryToRef(ref, query);
          assert(spy.calledOnce);
          assert(spy.calledWith('value'));
        });

        it(`calls ${key} and passes through value when empty string`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = '';

          adapter.applyQueryToRef(ref, query);
          assert(spy.calledOnce);
          assert(spy.calledWith(''));
        });

        it(`does not call ${key} when the value is null`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = null;

          adapter.applyQueryToRef(ref, query);
          assert(spy.called === false, `${key} should not be called`);
        });

      });

    });
  }
);
