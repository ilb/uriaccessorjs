import { uriToString } from '../src/uri.js';
import Url from 'url';

test('uriToString_URL', () => {
  const str = 'https://www.yandex.ru/';
  const uri = new URL(str);
  expect(uriToString(uri)).toStrictEqual(str);
});

test('uriToString_Url', () => {
  const str = 'https://www.yandex.ru/';
  const uri = Url.parse(str);
  expect(uriToString(uri)).toStrictEqual(str);
});

test('uriToString_String', () => {
  const str = 'https://www.yandex.ru/';
  expect(uriToString(str)).toStrictEqual(str);
});
