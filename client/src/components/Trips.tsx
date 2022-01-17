import { Button, Card, Col, Row } from "antd";
import React, { FC } from "react";
import { ITrip } from "../interfaces/ITrip";
import moment from "moment";
import { Link } from "react-router-dom";

interface ITripsProps {
  trips: ITrip[];
  seats: number;
}

export const Trips: FC<ITripsProps> = ({ trips, seats }) => {
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col offset={2} span={22}>
            <h2>Trips</h2>
          </Col>
        </Row>

        <Row>
          <Col offset={2} span={22}>
            {trips.map((t) => (
              <Card
                key={t.id}
                size="small"
                title={`${t.from} - ${t.to}`}
                extra={
                  <Button type="primary" key={t.id}>
                    <Link to={`/reservations/${t.id}/${seats}`}>Book</Link>
                  </Button>
                }
                style={{ width: 300 }}
              >
                <p>Departure: {moment(t.departure).format("lll ")}</p>
                <p>Arrival: {moment(t.arrival).format("lll ")}</p>
                <p>Price: ${t.price / 100}</p>
              </Card>
            ))}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
