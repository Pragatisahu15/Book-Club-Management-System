import React from "react";
import { FaSearch } from "react-icons/fa"; // import search icon

function ClubSearch({
  searchName,
  setSearchName,
  searchCategory,
  setSearchCategory,
  searchOrganizer,
  setSearchOrganizer,
}) {
  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Club Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Organizer"
              value={searchOrganizer}
              onChange={(e) => setSearchOrganizer(e.target.value)}
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubSearch;
