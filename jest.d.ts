// jest.d.ts
declare namespace jest {
  interface Matchers<R> {
    toEqualXml(expected: string): R;
  }
}
