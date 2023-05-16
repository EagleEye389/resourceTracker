import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { asset } from "../../store/type";
import { UPDATE_LIST } from "../../store/actionType";
import {
  setSessionData,
  getSessionData,
  clearSessionData,
} from "../../utils/index";

const AssetTable = () => {
  const assetList: asset[] = useSelector((state: any) => state.assetList);
  const dispatch = useDispatch();

  const [data, setData] = useState([] as asset[]);

  const setDataInStoreAndState = (List: asset[]) => {
    setData(List);
    dispatch({
      type: UPDATE_LIST,
      payload: {
        List,
      },
    });
  };
  const handleDelete = (id: number, position: number) => {
    setSessionData("deletedItem", { index: position, data: data[position] });
    const List = data.filter((row: asset) => row.resourceId !== id);
    setDataInStoreAndState(List);
  };

  useEffect(() => {
    setData(assetList);
  }, [assetList]);

  useEffect(() => {
    const handleUnload = () => {
      setSessionData("assetTable", data);
      clearSessionData("deletedItem");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event,event.ctrlKey,event.key);
      if (event.ctrlKey && event.key === "z") {
        console.log("inside");
        event.preventDefault();
        const record = getSessionData("deletedItem");
        console.log(record);
        if (record) {
          const { index, data: Item } = JSON.parse(record);
          console.log(Item);
          let newData;
          if (data.length == 0) {
            newData = [Item];
          } else {
            newData = [...data.slice(0, index), Item, ...data.slice(index)];
          }
          console.log(newData)
          setDataInStoreAndState(newData);
          clearSessionData("deletedItem");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  return data.length > 0 ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Resource Id</TableCell>
            <TableCell>Resource Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.resourceId}>
              <TableCell>{row.resourceId}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDelete(row.resourceId, index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <>"No Asset added"</>
  );
};

export default AssetTable;
