import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import "./App.css";

const SPELLS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRx56A4vCAtaQFiRV1sDnQ_YsjWiJJtVxe5GW0oU80X9pr1gwt-TaurLjoOxzMS_S0RWNulHz56jI_O/pub?gid=2010381338&single=true&output=csv";

function App() {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchSpells = async () => {
      const response = await axios.get(SPELLS_CSV_URL);
      const spellsData = parseCSV(response.data);
      setSpells(spellsData);
      setFilteredSpells(spellsData);
    };

    fetchSpells();
  }, []);

  useEffect(() => {
    let updatedSpells = spells.filter((spell) =>
      spell.Name.toLowerCase().includes(searchName.toLowerCase())
    );

    if (selectedLevels.length > 0) {
      updatedSpells = updatedSpells.filter((spell) =>
        selectedLevels.includes(parseInt(spell.Level, 10))
      );
    }

    if (sortBy) {
      updatedSpells.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
    }

    setFilteredSpells(updatedSpells);
  }, [searchName, selectedLevels, sortBy, spells]);

  const parseCSV = (csvData) => {
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true
    });
    return parsedData.data;
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSelectedLevelsChange = (e, level) => {
    const numLevel = parseInt(level, 10);

    if (e.target.checked) {
      setSelectedLevels([...selectedLevels, numLevel]);
    } else {
      setSelectedLevels(selectedLevels.filter((lvl) => lvl !== numLevel));
    }
  };
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">Hex Codex</header>
      <main>
        <aside className="App-aside">
          <label>
            Sort by:
            <select value={sortBy} onChange={handleSortByChange}>
              <option value="">- Select -</option>
              <option value="Name">Name</option>
              <option value="Level">Level</option>
              <option value="School">School</option>
              <option value="Casting Time">Casting Time</option>
              <option value="Duration">Duration</option>
              <option value="Range">Range</option>
              <option value="Area">Area</option>
              <option value="Attack">Attack</option>
              <option value="Save">Save</option>
              <option value="Damage/Effect">Damage/Effect</option>
              <option value="Ritual">Ritual</option>
              <option value="Concentration">Concentration</option>
              <option value="Components">Components</option>
              <option value="Material">Material</option>
            </select>
          </label>
          <div>
            Spell Level:
            {Array.from({ length: 10 }, (_, i) => i).map((level) => (
              <label key={level}>
                <input
                  type="checkbox"
                  value={level}
                  checked={selectedLevels.includes(level)}
                  onChange={(e) => handleSelectedLevelsChange(e, level)}
                />
                {level}
              </label>
            ))}
          </div>

          <label>
            Search Name:
            <input
              type="text"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </label>
        </aside>
        <section className="App-spell-grid">
          {filteredSpells.map((spell, index) => (
            <div className="App-spell-card" key={index}>
              <div
                className={`App-spell-card-row${
                  sortBy === "Name" ? " bold" : ""
                }`}
              >
                Name: {spell["Name"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Level" ? " bold" : ""
                }`}
              >
                Level: {spell["Level"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "School" ? " bold" : ""
                }`}
              >
                School: {spell["School"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Casting Time" ? " bold" : ""
                }`}
              >
                Casting Time: {spell["Casting Time"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Duration" ? " bold" : ""
                }`}
              >
                Duration: {spell["Duration"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Range" ? " bold" : ""
                }`}
              >
                Range: {spell["Range"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Area" ? " bold" : ""
                }`}
              >
                Area: {spell["Area"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Attack" ? " bold" : ""
                }`}
              >
                Attack: {spell["Attack"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Save" ? " bold" : ""
                }`}
              >
                Save: {spell["Save"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Damage/Effect" ? " bold" : ""
                }`}
              >
                Damage/Effect: {spell["Damage/Effect"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Ritual" ? " bold" : ""
                }`}
              >
                Ritual: {spell["Ritual"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Concentration" ? " bold" : ""
                }`}
              >
                Concentration: {spell["Concentration"]}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Components" ? " bold" : ""
                }`}
              >
                Components: {spell["Verbal"] === "Y" ? "Verbal, " : ""}
                {spell["Somatic"] === "Y" ? "Somatic, " : ""}
                {spell["Material"] === "Y" ? "Material" : ""}
              </div>
              <div
                className={`App-spell-card-row${
                  sortBy === "Material" ? " bold" : ""
                }`}
              >
                Material: {spell["Material"]}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
