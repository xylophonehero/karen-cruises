import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@shadcn/ui";
import axios from "axios";

const ScheduleManager = () => {
  const [cruises, setCruises] = useState([]);

  useEffect(() => {
    fetchCruises();
  }, []);

  const fetchCruises = async () => {
    const response = await axios.get("/api/schedules");
    setCruises(response.data.person.cruises);
  };

  const addCruise = async (newCruise) => {
    await axios.post("/api/schedules/add", newCruise);
    fetchCruises();
  };

  const removeCruise = async (shipName) => {
    await axios.post("/api/schedules/remove", { ship_name: shipName });
    fetchCruises();
  };

  return (
    <div>
      <h1>Cruise Schedule Manager</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Ship Name</TableCell>
            <TableCell>Date Joining</TableCell>
            <TableCell>Date Leaving</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cruises.map((cruise, index) => (
            <TableRow key={index}>
              <TableCell>{cruise.ship_name}</TableCell>
              <TableCell>{cruise.date_joining}</TableCell>
              <TableCell>{cruise.date_leaving}</TableCell>
              <TableCell>
                <Button onClick={() => removeCruise(cruise.ship_name)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Add form or modal to add new cruise */}
    </div>
  );
};

export default ScheduleManager;
