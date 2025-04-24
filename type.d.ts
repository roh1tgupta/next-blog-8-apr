declare module 'react-quill-new' {
  export interface ReactQuillProps {
    value: string;
    onChange: (value: string) => void;
    id: string;
    className: string;
    modules?: {
      toolbar?: {
        container?: unknown;
        handlers?: Record<string, () => void>;
      };
    };
  }
}

interface NetworkInformation extends EventTarget {
  readonly downlink?: number;
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt?: number;
  readonly saveData?: boolean;
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  onchange?: ((this: NetworkInformation, ev: Event) => unknown) | null;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}