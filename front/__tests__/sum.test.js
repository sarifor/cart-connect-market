// import { jest } from '@jest/globals';
// const sum = require('./sum.js');
import sum from '../src/sum.js';

test('1 + 1 = 2', () => {
  expect(sum(1, 1)).toBe(2);
});