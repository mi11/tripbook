import React, { FC } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { IReservation } from "../interfaces/IReservation";
import { Col, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";

interface IDataSource {
  key: string;
  id: number;
  requiredSeats: number;
  status: string;
  tripId: number;
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Required Seats",
    dataIndex: "requiredSeats",
    key: "requiredSeats",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Trip ID",
    dataIndex: "tripId",
    key: "tripId",
  },
];

export const Reservations: FC<{ authorized: boolean }> = ({ authorized }) => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);

  useEffect(() => {
    if (!authorized) {
      navigate("/");
    }

    axios
      .get<IReservation[]>("http://localhost:3050/api/reservations")
      .then((res) => res.data)
      .then((data) => {
        const records = [];
        for (const reservation of data) {
          records.push({
            key: reservation.id + "",
            id: reservation.id,
            requiredSeats: reservation.requiredSeats,
            status: reservation.status,
            tripId: reservation.tripId,
          });
        }

        setDataSource(records);
      });
  }, []);

  return (
    <Row>
      <Col offset={2} span={20}>
        <Table dataSource={dataSource} columns={columns} size="small" />
      </Col>
    </Row>
  );
};
