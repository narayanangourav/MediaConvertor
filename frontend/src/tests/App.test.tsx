import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../store/store";
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
    // Check for the main title or some element
    // Since we have a "Media Converter" title in Layout
    expect(screen.getByText(/Media/i)).toBeInTheDocument();
    expect(screen.getByText(/Converter/i)).toBeInTheDocument();
  });
});
