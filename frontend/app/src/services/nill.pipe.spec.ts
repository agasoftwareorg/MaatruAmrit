import { NillPipe } from './nill.pipe';

describe('NillPipe', () => {
  it('create an instance', () => {
    const pipe = new NillPipe();
    expect(pipe).toBeTruthy();
  });
});
