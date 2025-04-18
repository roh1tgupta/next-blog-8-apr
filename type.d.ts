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