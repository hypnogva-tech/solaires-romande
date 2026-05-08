import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for solar panel installation requests
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  canton: varchar("canton", { length: 64 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(), // Maison individuelle, Villa, Chalet, PPE
  surface: int("surface").notNull(), // m²
  budget: varchar("budget", { length: 64 }).notNull(), // lt20k, 20-40k, gt40k
  delai: varchar("delai", { length: 64 }).notNull(), // Au plus vite, 3-6 mois, 6-12 mois
  nom: varchar("nom", { length: 255 }).notNull(),
  tel: varchar("tel", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// TODO: Add your tables here
