import { describe, it, expect, vi, beforeEach } from "vitest";
import { leadsRouter } from "./leads";
import * as db from "../db";
import * as notification from "../_core/notification";

// Mock the database and notification modules
vi.mock("../db");
vi.mock("../_core/notification");

describe("leadsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit a lead successfully", async () => {
    // Mock the database and notification calls
    vi.mocked(db.createLead).mockResolvedValue({ insertId: 1 } as any);
    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    // Get the submit procedure
    const submitProcedure = leadsRouter.createCaller({} as any).submit;

    // Test input
    const testInput = {
      canton: "Vaud",
      type: "Maison individuelle",
      surface: 60,
      budget: "20-40k",
      delai: "Au plus vite",
      nom: "Jean Dupont",
      tel: "+41 79 000 00 00",
      email: "jean@example.com",
    };

    // Call the procedure
    const result = await submitProcedure(testInput);

    // Assertions
    expect(result).toEqual({ success: true, message: "Lead créé avec succès" });
    expect(db.createLead).toHaveBeenCalledWith({
      canton: "Vaud",
      type: "Maison individuelle",
      surface: 60,
      budget: "20-40k",
      delai: "Au plus vite",
      nom: "Jean Dupont",
      tel: "+41 79 000 00 00",
      email: "jean@example.com",
    });
    expect(notification.notifyOwner).toHaveBeenCalled();
  });

  it("should validate email format", async () => {
    const submitProcedure = leadsRouter.createCaller({} as any).submit;

    const testInput = {
      canton: "Vaud",
      type: "Maison individuelle",
      surface: 60,
      budget: "20-40k",
      delai: "Au plus vite",
      nom: "Jean Dupont",
      tel: "+41 79 000 00 00",
      email: "invalid-email", // Invalid email
    };

    // Should throw validation error
    await expect(submitProcedure(testInput)).rejects.toThrow();
  });

  it("should require all fields", async () => {
    const submitProcedure = leadsRouter.createCaller({} as any).submit;

    const testInput = {
      canton: "",
      type: "Maison individuelle",
      surface: 60,
      budget: "20-40k",
      delai: "Au plus vite",
      nom: "Jean Dupont",
      tel: "+41 79 000 00 00",
      email: "jean@example.com",
    };

    // Should throw validation error for empty canton
    await expect(submitProcedure(testInput)).rejects.toThrow();
  });
});
