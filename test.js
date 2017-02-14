const chai = require('chai');
const fetch = require('node-fetch');

const domain = 'https://jimmy-endpoint.apps.exosite-staging.io';
const headers = {
  'Content-Type': 'application/json'
};
const key = 'state';
const successResult = JSON.stringify({
  result: 'success'
});
const value = 'turnOff';

chai.should();

describe('Murano route', function() {

  this.timeout(120 * 1000);
  
  it('should response Hello World while calling GET /hello/world', (done) => {
    fetch(`${domain}/hello/world`)
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        body.should.equal('Hello World');
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  });
  
  it('should response request parameter while calling GET /hello/world/{more}', (done) => {
    const parameter = 'more';
    fetch(`${domain}/request/${parameter}`)
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        body.should.equal(parameter);
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  });

  it('should response request body value while calling POST /request', (done) => {
    const body = {
      more: value
    }
    fetch(`${domain}/request`, { 
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
      })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        body.should.equal(value);
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  });

  it('should response { \"result\": \"success\" } while calling POST /keystore/set', (done) => {
    const body = {
      key: key,
      value: value
    }
    fetch(`${domain}/keystore/set`, { 
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
      })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        body.should.equal(successResult);
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  });

  it('should response { \"key\": \"value\" } while calling GET /keystore/get/{key}', (done) => {
    fetch(`${domain}/keystore/get/${key}`)
      .then((response) => {
        response.headers.get('dqa-1077').should.equal('https://i.exosite.com/jira/browse/DQA-1077');
        return response.text();
      })
      .then((body) => {
        const result = JSON.stringify({
          state: value
        });
        body.should.equal(result);
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  });

  it('should response { \"result\": \"success\" } and ' + 
      'delete the value while calling DELETE /keystore/delete', (done) => {
    const body = {
      key: key,
    }
    fetch(`${domain}/keystore/delete`, { 
        headers: headers,
        method: 'DELETE',
        body: JSON.stringify(body),
      })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        body.should.equal(successResult);
        return fetch(`${domain}/keystore/get/${key}`);
      })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        const result = JSON.stringify({});
        body.should.equal(result);
        return done();
      })
      .catch ((error) => {
        console.log('Request failed', error);
      });
  })
});
