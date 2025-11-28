import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../service/store";
import App from "../App";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    // Check for the main title
    expect(screen.getByText("Transform Your Media")).toBeInTheDocument();
    expect(screen.getByText(/Text to Audio/i)).toBeInTheDocument();
    expect(screen.getByText(/Video to Audio/i)).toBeInTheDocument();
  });
});
