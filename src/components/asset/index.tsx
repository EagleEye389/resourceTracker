import { useState, ChangeEvent } from "react";
import {
  Grid,
  Button,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  Container,
  SelectChangeEvent,
} from "@mui/material";


import { useSelector, useDispatch } from "react-redux";

import "./asset.css";
import { ADD_ITEM } from "../../store/actionType";
import { asset } from "../../store/type";

const TYPE = ["Laptop", "Phone", "Tablet"];
interface Props {
  handleClose: () => void;
}

const Asset = ({ handleClose }: Props) => {
  const assetList: asset[] = useSelector((state: any) => state.assetList);

  const [formState , setFormState] = useState({
    resourceId: {
      value: "",
      required: true,
      valid: false,
      load: false,
      error: "Only 8 digit unqiue resource id is valid",
      pattern: /^[0-9]{8}$/,
    },
    type: {
      value: "",
      required: true,
      valid: false,
      load: false,
      error: "Type is required",
    },
    description: {
      value: "",
      required: false,
      valid: true,
      load: false,
      limit: 200,
      error: "Maximum limit of text is 200",
    },
  });
  const [unqiue, setUnique] = useState(true);

  const dispatch = useDispatch();

  const handleChange = (event: 
    ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
    const {
      target: { value, name },
    } = event;
   const item = formState[name as keyof typeof formState];
    const updatedField = {
      ...item,
      value,
    };
    updatedField.load = true;
    updatedField.valid = validateField(updatedField);
    const updatedFormState = {
      ...formState,
      [name]: updatedField,
    };
    setFormState(updatedFormState);
    setUnique(true);
  };

  function validateField(field: any) {
    if (field.required && !field.value.trim()) {
      return false;
    }

    if (field.limit && field.value.length > field.limit) {
      return false;
    }

    if (field.pattern && !field.pattern.test(field.value)) {
      return false;
    }

    return true;
  }

  const handleSubmit = () => {
    const { resourceId, type, description } = formState;
    const isDataPresent = assetList.filter(item => `${item.resourceId}` == resourceId.value );
    if(isDataPresent.length){
       setUnique(false)
    } else {
    dispatch({
      type: ADD_ITEM,
      payload: {
        record: {
          resourceId: resourceId.value,
          type: type.value,
          description: description.value,
        },
      },
    });
    handleClose();
   }
  };
  return (
    <Container className="container">
      <Grid container spacing={4}>
        <Grid item xs={12} md={3} sm={3}>
          <InputLabel htmlFor="resourceId">Resource Id</InputLabel>
        </Grid>
        <Grid item xs={12} md={9} sm={9}>
          <TextField
            type="text"
            value={formState.resourceId.value}
            id="resourceId"
            required
            fullWidth
            name="resourceId"
            onChange={handleChange}
            InputLabelProps={{
              shrink: false,
            }}
            inputProps={{ 'data-testid': 'resourceId' }}
          />
          {formState.resourceId.load && !formState.resourceId.valid && (
            <FormHelperText error={!formState.resourceId.valid}>
              {formState.resourceId.error}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={3} sm={3}>
          <InputLabel htmlFor="dropdown">Resource Type</InputLabel>
        </Grid>
        <Grid item xs={12} md={9} sm={9}>
          <Select
            name="type"
            className="selectDropDown"
            id="dropdown"
            value={formState.type.value}
            onChange={handleChange}
            inputProps={{ 'data-testid': 'type' }}
          >
            <MenuItem value="Select a Type"></MenuItem>
            {TYPE.map((item) => {
              return (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
          {formState.type.load && !formState.type.valid && (
            <FormHelperText error={!formState.type.valid}>
              {formState.type.error}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={3} sm={3}>
          <InputLabel htmlFor="description">Resource Description</InputLabel>
        </Grid>
        <Grid item xs={12} md={9} sm={9}>
          <TextField
            placeholder="Placeholder"
            multiline
            rows={4}
            name="description"
            id="description"
            value={formState.description.value}
            fullWidth
            onChange={handleChange}
            InputLabelProps={{
              shrink: false,
            }}
          />
          {formState.description.load && !formState.description.valid && (
            <FormHelperText error={!formState.description.valid}>
              {formState.description.error}
            </FormHelperText>
          )}
        </Grid>
       
        
        <Grid item xs={12} md={12} sm={12}>
        {!unqiue && (
              <FormHelperText error={!unqiue}>
                Resource Id is not unique
              </FormHelperText>
            )}
      
          <Button
            disabled={
              !formState.resourceId.valid ||
              !formState.type.valid ||
              formState.description.value.length > formState.description.limit
            }
            variant="contained"
            onClick={handleSubmit}
          >
            Add Asset
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Asset;
