import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import initSqlJs, { type Database } from 'sql.js';

export interface VoucherRecord {
  id?: number;
  crew_name: string;
  crew_id: string;
  flight_number: string;
  flight_date: string;
  aircraft_type: string;
  seat1: string;
  seat2: string;
  seat3: string;
  created_at: string;
}

@Injectable()
export class VoucherService {
  private db: Database | null = null;
  private dbPath = './vouchers.db';

  async initDatabase(): Promise<void> {
    const SQL = await initSqlJs();
    
    try {
      // Try to load existing database
      if (fs.existsSync(this.dbPath)) {
        const buffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(buffer);
      } else {
        this.db = new SQL.Database();
      }
    } catch {
      const SQL = await initSqlJs();
      this.db = new SQL.Database();
    }

    // Create table if not exists
    this.db.run(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crew_name TEXT NOT NULL,
        crew_id TEXT NOT NULL,
        flight_number TEXT NOT NULL,
        flight_date TEXT NOT NULL,
        aircraft_type TEXT NOT NULL,
        seat1 TEXT NOT NULL,
        seat2 TEXT NOT NULL,
        seat3 TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    this.saveDatabase();
  }

  private saveDatabase(): void {
    if (!this.db) return;
    
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(this.dbPath, buffer);
  }

  async checkVoucherExists(flightNumber: string, date: string): Promise<boolean> {
    if (!this.db) await this.initDatabase();

    const result = this.db!.exec(
      `SELECT COUNT(*) as count FROM vouchers WHERE flight_number = '${flightNumber}' AND flight_date = '${date}'`
    );

    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0] > 0;
    }
    return false;
  }

  generateSeats(aircraftType: string): string[] {
    const seatConfigs: Record<string, { rows: number; seats: string[] }> = {
      'ATR': { rows: 18, seats: ['A', 'C', 'D', 'F'] },
      'Airbus 320': { rows: 32, seats: ['A', 'B', 'C', 'D', 'E', 'F'] },
      'Boeing 737 Max': { rows: 32, seats: ['A', 'B', 'C', 'D', 'E', 'F'] },
    };

    const config = seatConfigs[aircraftType];
    if (!config) {
      throw new Error(`Unknown aircraft type: ${aircraftType}`);
    }

    const allSeats: string[] = [];
    for (let row = 1; row <= config.rows; row++) {
      for (const seat of config.seats) {
        allSeats.push(`${row}${seat}`);
      }
    }

    // Generate 3 unique random seats
    const selectedSeats: string[] = [];
    while (selectedSeats.length < 3 && allSeats.length > 0) {
      const randomIndex = Math.floor(Math.random() * allSeats.length);
      selectedSeats.push(allSeats[randomIndex]);
      allSeats.splice(randomIndex, 1);
    }

    return selectedSeats;
  }

  async createVoucher(
    crewName: string,
    crewId: string,
    flightNumber: string,
    flightDate: string,
    aircraftType: string,
    seats: string[]
  ): Promise<VoucherRecord> {
    if (!this.db) await this.initDatabase();

    const createdAt = new Date().toISOString();

    this.db!.run(
      `INSERT INTO vouchers (crew_name, crew_id, flight_number, flight_date, aircraft_type, seat1, seat2, seat3, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [crewName, crewId, flightNumber, flightDate, aircraftType, seats[0], seats[1], seats[2], createdAt]
    );

    this.saveDatabase();

    return {
      crew_name: crewName,
      crew_id: crewId,
      flight_number: flightNumber,
      flight_date: flightDate,
      aircraft_type: aircraftType,
      seat1: seats[0],
      seat2: seats[1],
      seat3: seats[2],
      created_at: createdAt,
    };
  }
}
