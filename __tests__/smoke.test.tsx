import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';

test('App renders without throwing', async () => {
  let tree: renderer.ReactTestRenderer | undefined;
  await act(async () => {
    tree = renderer.create(<App />);
  });
  expect(tree).toBeDefined();
});
