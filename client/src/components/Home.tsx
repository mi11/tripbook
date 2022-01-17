import React, { useState } from "react";
import { Search } from "./Search";
import { ITrip } from "../interfaces/ITrip";
import { Trips } from "./Trips";

export const Home = () => {
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [requiredSeats, setRequiredSeats] = useState<number>(1);

  if (trips.length) {
    return <Trips trips={trips} seats={requiredSeats} />;
  } else {
    return (
      <Search
        onSearchResult={(trips) => setTrips(trips)}
        onRequiredSeatsSet={(seats: number) => setRequiredSeats(seats)}
      />
    );
  }
};
