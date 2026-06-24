import React from 'react';
import renderer, { act } from 'react-test-renderer';
import '../src/components/blocks';
import { parseLayout } from '../src/registry/parseLayout';
import { PAYLOADS } from '../src/data/payloads';
import { ThemeProvider } from '../src/theme/ThemeContext';

test('every block in every payload renders without throwing', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  for (const id of Object.keys(PAYLOADS) as Array<keyof typeof PAYLOADS>) {
    const payload = PAYLOADS[id];
    const blocks = parseLayout(payload.layout);
    for (const { Component, block } of blocks) {
      await act(async () => {
        renderer.create(
          <ThemeProvider theme={payload.theme}>
            <Component block={block} />
          </ThemeProvider>,
        );
      });
    }
  }

  warnSpy.mockRestore();
});
