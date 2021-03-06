import { PrettyLabelPipe } from './pretty-label.pipe';

describe('PrettyLabelPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new PrettyLabelPipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... more tests ...
});
