import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PracticeModal } from "../practice-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

// Mock the store
vi.mock("@/store/use-practice-modal", () => ({
  usePracticeModal: vi.fn(),
}));

describe("PracticeModal component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    // @ts-expect-error: mocking store return value
    usePracticeModal.mockReturnValue({
      isOpen: false,
      close: vi.fn(),
    });

    const { container } = render(<PracticeModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders correctly when open", () => {
    // @ts-expect-error: mocking store return value
    usePracticeModal.mockReturnValue({
      isOpen: true,
      close: vi.fn(),
    });

    render(<PracticeModal />);
    expect(
      screen.getByRole("heading", { name: /practice lesson/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/use practice lessons to regain hearts/i),
    ).toBeInTheDocument();
  });

  it('calls close when "I understand" is clicked', () => {
    const mockClose = vi.fn();
    // @ts-expect-error: mocking store return value
    usePracticeModal.mockReturnValue({
      isOpen: true,
      close: mockClose,
    });

    render(<PracticeModal />);
    fireEvent.click(screen.getByRole("button", { name: /i understand/i }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
