import { createStore } from "redux";
import { UPDATE_LIST, ADD_ITEM } from "./actionType";
import { AssetList } from "./type";

const InitialState = {
  assetList: [],
};
const rootReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case UPDATE_LIST:
      const {
        payload: { List },
      } = action;
      return {
        ...state,
        assetList: [...List],
      };
    case ADD_ITEM:
      const {
        payload: { record },
      } = action;
      return {
        ...state,
        assetList: [record, ...state.assetList],
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer);
export default store;
