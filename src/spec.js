// eslint-disable-next-line import/no-extraneous-dependencies
import { enableFetchMocks } from 'jest-fetch-mock';
import { ApiError } from './errors';
import { JsonFetch, defaultOptions } from './index';

enableFetchMocks();

const defaultHeaders = defaultOptions.headers;

describe(`instantiation`, () => {
  it('Should have default headers', () => {
    const http = new JsonFetch();
    expect(http.defaultOptions.headers).toEqual(defaultHeaders);
  });

  it('Should allow to override default headers', () => {
    const http = new JsonFetch({
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    expect(http.defaultOptions.headers).toEqual({
      'Content-Type': 'text/plain',
      Accept: 'application/json',
    });
  });
});

describe('Http methods', () => {
  const http = new JsonFetch();
  const url = 'some_url';
  const response = { data: [] };
  fetch.mockResponse(JSON.stringify({ ...response }), { status: 200 });

  it('Shoud return a promise when calling get', () => {
    expect(http.get(url).constructor.name).toBe('Promise');
  });

  it('Should call get with url and params', () =>
    http.get(url).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: defaultHeaders,
      });
    }));

  it('Should call get with url and specific options', () =>
    http.get(url, { cors: true }).then(() => {
      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: defaultHeaders,
        cors: true,
      });
    }));

  it('Should parse json object if successfull status', () =>
    http.get(url).then(resp => {
      expect(resp).toEqual(response);
    }));

  it('Should throw an API error if status code is wrong and response is a well formed json', () => {
    fetch.once(JSON.stringify({}), { status: 400 });
    return expect(http.get(url)).rejects.toBeInstanceOf(ApiError);
  });

  it("Should throw a FetchError error if the body isn't json string", () => {
    fetch.once({}, { status: 400 });
    expect.assertions(1);
    // I didn't know how to get the FetchError object in jest
    return http
      .get(url)
      .catch(err => expect(err.constructor.name).toEqual('FetchError'));
  });
});
