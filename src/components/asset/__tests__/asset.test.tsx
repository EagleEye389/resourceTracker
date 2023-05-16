import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Asset from "../index";

const mockStore = configureStore([]);

describe("Asset component", () => {
  let store: any;
  let handleCloseMock: any;

  beforeEach(() => {
    store = mockStore({
      assetList: [],
    });
    handleCloseMock = jest.fn();
  });

  test("renders Asset component", async () => {
    render(
      <Provider store={store}>
        <Asset handleClose={handleCloseMock} />
      </Provider>
    );

    expect(screen.getByTestId("resourceId")).toBeInTheDocument();
    expect(screen.getByLabelText("Resource Description")).toBeInTheDocument();
    expect(screen.getByTestId("type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Asset" })).toBeInTheDocument();
  });

  test("handles form submission with unique resource ID", async () => {
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <Asset handleClose={handleCloseMock} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Resource Id"), { target: { value: "12345678" } });   
    const type = screen.getByTestId("type");
    fireEvent.change(type, { target: { value: 'Laptop' } });
    fireEvent.change(screen.getByLabelText("Resource Description"), { target: { value: "Test description" } });

    fireEvent.click(screen.getByRole("button", { name: "Add Asset" }));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "ADD_ITEM",
      payload: {
        record: {
          resourceId: "12345678",
          type: "Laptop",
          description: "Test description",
        },
      },
    });

    expect(handleCloseMock).toHaveBeenCalled();
  });

  test("handles form submission with non-unique resource ID", async () => {
    store.dispatch = jest.fn();

    const mockAssetList = [
      { resourceId: "12345678", type: "Laptop", description: "Test description 1" },
      { resourceId: "23456789", type: "Phone", description: "Test description 2" },
    ];
    store = mockStore({
      assetList: mockAssetList,
    });

    render(
      <Provider store={store}>
        <Asset handleClose={handleCloseMock} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Resource Id"), { target: { value: "12345678" } });
    const type = screen.getByTestId("type");
    fireEvent.change(type, { target: { value: 'Laptop' } });
    fireEvent.change(screen.getByLabelText("Resource Description"), { target: { value: "Test description" } });

    fireEvent.click(screen.getByRole("button", { name: "Add Asset" }));
    expect(screen.getByText("Resource Id is not unique")).toBeInTheDocument();
    expect(handleCloseMock).not.toHaveBeenCalled();
  });


});
