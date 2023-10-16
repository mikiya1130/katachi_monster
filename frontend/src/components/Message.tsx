/**
 * ポップアップメッセージを出す
 *
 * サンプルコード
 * ```tsx
 * "use client";

 * import { useEffect, useRef } from "react";

 * import Message, { MessageRef } from "@/components/Message";

 * const Component = () => {
 *   const ref = useRef<MessageRef>(null);

 *   useEffect(() => {
 *     if (ref.current) {
 *       ref.current.call({ type: "info", message: "message" });
 *     }
 *   }, []);

 *   return <Message ref={ref} />;
 * };

 * export default Component;
 */
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";

type CallArgs = {
  type: AlertColor;
  message: string;
};

export type MessageRef = {
  call: ({ type, message }: CallArgs) => void;
};

const Message = (_: unknown, ref: ForwardedRef<MessageRef>) => {
  const [type, setType] = useState<AlertColor>("info");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    call: ({ type, message }: CallArgs) => {
      setType(type);
      setMessage(message);
      setOpen(true);
    },
  }));

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default forwardRef(Message);
