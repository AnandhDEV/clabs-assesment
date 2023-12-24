import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

//css
import "./segment.css";
import AddSegmentForm from "./addSegmentForm";

function Segment() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={"segment_container"}>
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"flex-end"}
        gap={"20px"}
      >
        <Typography>Please Click Create Button to Add Segment</Typography>
        <Button
          variant="contained"
          sx={{ width: "300px" }}
          onClick={() => setOpen(true)}
        >
          Create Segment
        </Button>
      </Stack>

      <AddSegmentForm open={open} handleClose={handleClose} />
    </Box>
  );
}

export default Segment;
