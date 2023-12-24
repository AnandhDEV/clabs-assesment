import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CustomSnackBar from "../../components/SnackBar";
import axios from "axios";

const initialSnack = {
  openSnack: false,
  message: "",
  severity: "success",
};

const successSnack = {
  openSnack: true,
  message: "Succesfully added Segment",
  severity: "success",
};

const errorSnack = {
  openSnack: true,
  message: "Error while add segment",
  severity: "error",
};

const schemaOptions = [
  { Label: "First Name", Value: "first_name" },
  { Label: "Last Name", Value: "last_name" },
  { Label: "Gender", Value: "gender" },
  { Label: "Age", Value: "age" },
  { Label: "Account Name", Value: "account_name" },
  { Label: "City", Value: "city" },
  { Label: "State", Value: "state" },
];

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

function AddSegmentForm({ open, handleClose }) {
  const [segment, setSegment] = useState("");
  const [schemas, setSchema] = useState([""]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [snack, setSnack] = useState({
    openSnack: false,
    message: "",
    severity: "success",
  });

  const { openSnack, message, severity } = snack;

  const handleSchemaChange = (e, index) => {
    let temp = [...schemas];
    temp[index] = e.target.value;

    setSchema(temp);
  };

  const handleAdd = () => {
    if (schemas.length === 7 && schemas.every((item) => item)) {
      setSnack({
        openSnack: true,
        message: "All options are selected",
        severity: "warning",
      });
    } else {
      let temp = [...schemas];
      setSchema([...temp, ""]);
    }
  };

  const handleRemove = (index) => {
    setSchema(schemas.filter((x, i) => i !== index));
  };

  const handleCloseSnack = () => {
    setSnack(initialSnack);
  };

  const handleSubmit = () => {
    if (!segment || schemas.some((item) => !item)) {
      setError(true);
    } else {
      addSegment();
    }
  };

  const reset = () => {
    setSchema([""]);
    setSegment("");
    setError(false);
    handleClose();
  };

  const addSegment = async () => {
    setLoader(true);
    const payload = {
      segment_name: segment,
      schema: schemaOptions
        .filter((item) => schemas.includes(item.Value))
        .map((x) => ({ [x.Value]: x.Label })),
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        "https://webhook.site/2e868f6a-697c-44e5-9562-7c4f4bdfda64",
        payload
      );
      setSnack(successSnack);
      reset();
      setLoader(false);
    } catch (err) {
      setSnack(errorSnack);
      setLoader(false);
    }
  };

  const options = useCallback(
    (schema) => {
      console.log(schema);
      let temp = schemas.filter((x) => x !== schema);

      return schemaOptions.filter((item) => !temp.includes(item.Value));
    },
    [schemas]
  );

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { width: { xs: 400, sm: 500 } },
          position: "relative",
        }}
      >
        <Header>
          <Typography variant="h6">Add Segment</Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "text.primary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Header>
        <Box className="segment_form_container">
          <Stack gap="10px">
            <Typography>Enter the Name of the Segment</Typography>

            <TextField
              label="Name of the Segment"
              size="small"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              error={error && !segment}
              helperText={error && !segment && "Please enter segment name"}
              fullWidth
            ></TextField>

            <Typography>
              To save segment, you need to add the schemas to build the query
            </Typography>
          </Stack>
          <Box>
            {schemas?.map((schema, index) => (
              <>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  marginBottom={error && !schema ? 0 : 2}
                >
                  <FormControl
                    fullWidth
                    key={schema}
                    size="small"
                    error={error && !schema}
                  >
                    {/* <InputLabel id="demo-simple-select-label">
                Add schema to segment
              </InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={schema || ""}
                      // label="Add schema to segment"
                      onChange={(e) => handleSchemaChange(e, index)}
                    >
                      {options(schema)?.map((item) => (
                        <MenuItem value={item.Value} key={item.Value}>
                          {item.Label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    onClick={() => handleRemove(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
                {error && !schema && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Please select schema
                  </FormHelperText>
                )}
              </>
            ))}

            <Button startIcon={<AddIcon />} size="small" onClick={handleAdd}>
              Add new schema
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "20px 32px 20px 32px",
            position: "absolute",
            bottom: 0,
            backgroundColor: "background.default",
            width: "100%",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleSubmit}
            disabled={loader}
          >
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Drawer>
      <CustomSnackBar
        open={openSnack}
        message={message}
        severity={severity}
        handleClose={handleCloseSnack}
      />
    </>
  );
}

export default AddSegmentForm;
