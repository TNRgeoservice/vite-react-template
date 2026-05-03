// Minimal type declaration — shpjs has no shipped types
declare module 'shpjs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function shp(input: ArrayBuffer | string): Promise<any>;
  export = shp;
}
