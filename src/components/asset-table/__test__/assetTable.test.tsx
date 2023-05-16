import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AssetTable from "../index";
import { UPDATE_LIST } from "../../../store/actionType";

const mockStore = configureStore([]);

describe("AssetTable", () => {
  let store: any;
  let initialState: any;

  beforeEach(() => {
    initialState = {
      assetList: [
        {
          resourceId: 1,
          type: "Laptop",
          description: "Sample laptop",
        },
        {
          resourceId: 2,
          type: "Phone",
          description: "Sample phone",
        },
        {
          resourceId: 3,
          type: "Tablet",
          description: "Sample phone 2",
        },
      ],
    };
    store = mockStore(initialState);
  });

  test("renders asset table correctly", () => {
    render(
      <Provider store={store}>
        <AssetTable />
      </Provider>
    );

    expect(screen.getByText("Resource Id")).toBeInTheDocument();
    expect(screen.getByText("Resource Type")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Sample laptop")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Sample phone 2")).toBeInTheDocument();
  });

  test("deletes asset when delete button is clicked", () => {
    render(
      <Provider store={store}>
        <AssetTable />
      </Provider>
    );

    expect(screen.getAllByRole("row")).toHaveLength(4);
    const deleteButton = screen.getAllByRole("button", { name: "Delete" })[0];
    fireEvent.click(deleteButton);
    expect(screen.getAllByRole("row")).toHaveLength(3);
    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: UPDATE_LIST,
        payload: {
          List: [
            {
              resourceId: 2,
              type: "Phone",
              description: "Sample phone",
            },
            {
              resourceId: 3,
              type: "Tablet",
              description: "Sample phone 2",
            },
          ],
        },
      },
    ]);
  });

  test("displays 'No Asset added' message when no assets are present", () => {
    initialState.assetList = []; // Empty asset list
    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <AssetTable />
      </Provider>
    );

    expect(screen.getByText(/No Asset added/i)).toBeInTheDocument();
  });

  test("Simulate Ctrl + Z keypress", () => {
    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <AssetTable />
      </Provider>
    );
    const deleteButton = screen.getAllByRole("button", { name: "Delete" })[0];
    fireEvent.click(deleteButton);
    expect(screen.getAllByRole("row")).toHaveLength(3);
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });
});
