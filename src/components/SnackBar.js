import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function CustomSnackBar({
  open,
  handleClose,
  severity,
  message,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
