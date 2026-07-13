import { useState } from 'react';
import { checkVouchers, generateVouchers, GenerateRequest } from './api';

const AIRCRAFT_OPTIONS = [
  { value: '', label: 'Select Aircraft' },
  { value: 'ATR', label: 'ATR' },
  { value: 'Airbus 320', label: 'Airbus 320' },
  { value: 'Boeing 737 Max', label: 'Boeing 737 Max' },
];

function App() {
  const [crewName, setCrewName] = useState('');
  const [crewId, setCrewId] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  
  const [seats, setSeats] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDateForApi = (dateString: string): string => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleGenerateVouchers = async () => {
    setError(null);
    setSeats(null);

    if (!crewName || !crewId || !flightNumber || !flightDate || !aircraftType) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const apiDate = formatDateForApi(flightDate);
      
      const exists = await checkVouchers(flightNumber, apiDate);
      
      if (exists) {
        setError(`Vouchers have already been generated for flight ${flightNumber} on ${flightDate}`);
        setLoading(false);
        return;
      }

      const generateRequest: GenerateRequest = {
        name: crewName,
        id: crewId,
        flightNumber,
        date: apiDate,
        aircraft: aircraftType,
      };

      const generatedSeats = await generateVouchers(generateRequest);
      setSeats(generatedSeats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Voucher Seat Assignment</h1>
      
      <div className="form-group">
        <label htmlFor="crewName">Crew Name</label>
        <input
          type="text"
          id="crewName"
          value={crewName}
          onChange={(e) => setCrewName(e.target.value)}
          placeholder="Enter crew name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="crewId">Crew ID</label>
        <input
          type="text"
          id="crewId"
          value={crewId}
          onChange={(e) => setCrewId(e.target.value)}
          placeholder="Enter crew ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="flightNumber">Flight Number</label>
        <input
          type="text"
          id="flightNumber"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="e.g., GA102"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="flightDate">Flight Date</label>
        <input
          type="date"
          id="flightDate"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="aircraftType">Aircraft Type</label>
        <select
          id="aircraftType"
          value={aircraftType}
          onChange={(e) => setAircraftType(e.target.value)}
          required
        >
          {AIRCRAFT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerateVouchers}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Vouchers'}
      </button>

      {seats && (
        <div className="result">
          <h2>Generated Seats</h2>
          <div className="seats">
            {seats.map((seat, index) => (
              <span key={index} className="seat">{seat}</span>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
