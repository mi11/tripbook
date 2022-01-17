import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Table } from "antd";
import { ITrip } from "../interfaces/ITrip";
import { useNavigate } from "react-router-dom";

interface IDataSource extends ITrip {
  key: string;
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Arrival",
    dataIndex: "arrival",
    key: "arrival",
  },
  {
    title: "Departure",
    dataIndex: "departure",
    key: "departure",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Total Seats",
    dataIndex: "totalSeats",
    key: "totalSeats",
  },
  {
    title: "Available Seats",
    dataIndex: "availableSeats",
    key: "availableSeats",
  },
];

export const AllTrips: FC<{ authorized: boolean }> = ({ authorized }) => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);

  useEffect(() => {
    if (!authorized) {
      navigate("/");
    }

    axios
      .get<ITrip[]>("http://localhost:3050/api/trips")
      .then((res) => res.data)
      .then((data) => {
        const records = [];
        for (const trip of data) {
          records.push({
            key: trip.id + "",
            ...trip,
          });
        }

        setDataSource(records);
      });
  }, [navigate, authorized]);

  return (
    <Row>
      <Col offset={2} span={20}>
        <Table dataSource={dataSource} columns={columns} size="small" />
      </Col>
    </Row>
  );
};
