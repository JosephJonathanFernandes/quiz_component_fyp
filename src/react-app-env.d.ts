/// <reference types="react-scripts" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  import React from 'react';
  export = React;
  export as namespace React;
  
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const useParams: any;
}