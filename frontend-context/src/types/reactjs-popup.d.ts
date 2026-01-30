declare module "reactjs-popup" {
  import * as React from "react";

  interface PopupProps {
    trigger: React.ReactNode;
    modal?: boolean;
    nested?: boolean;
    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    contentStyle?: React.CSSProperties;
    arrow?: boolean;
    children?: (close: () => void) => React.ReactNode;
  }

  const Popup: React.FC<PopupProps>;

  export default Popup;
}
