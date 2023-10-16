import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  type: AlertColor;
  message: string;
};

export type MessageRef = {
  handleClick: () => void;
};

const Message = ({ type, message }: Props, ref: ForwardedRef<MessageRef>) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    handleClick: () => {
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
