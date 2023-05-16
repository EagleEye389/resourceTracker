import { useState, useEffect } from "react";

import "./App.css";
import Asset from "./components/asset/index";
import AssetTable from "./components/asset-table/index";
import { Button, Container, Dialog,Divider } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from "react-redux";
import { UPDATE_LIST } from "./store/actionType";

/**
 *  Each assest will have a unique id called Resource ID
 *  It is an number of 8 digit.
 *  An asset can be type of [ phone, tabled, laptop]
 *  An Description also [limit 200 char]
 *
 *
 * Data is stored in array and need to show in the system, most recent on the top of the list.
 * Remove the asset from the list.
 * Keep the data in session.
 *
 * Revert the last deleted data in a cache to recover using ctrl +z
 *
 */

 
function App() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const data = sessionStorage.getItem('assetTable');
    if(data) {
      const List = JSON.parse(data);
      dispatch({
        type: UPDATE_LIST,
        payload: {
          List,
      }})
    }
  }, []);

  return (
    <>
      <Container className="box">
        <Button 
        sx={{
          marginBottom: '2rem'
        }}
        variant="contained" onClick={handleClickOpen}  startIcon={<AddIcon />}>
          Add an asset 
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        >
          <Asset handleClose={handleClose} />
        </Dialog>
        <Divider />
        <AssetTable />
      </Container>
    </>
  );
}

export default App;
