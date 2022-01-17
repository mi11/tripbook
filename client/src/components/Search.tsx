import React, { FC, useState } from "react";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
} from "antd";
import moment from "moment";
import axios, { AxiosError } from "axios";
import { ITrip } from "../interfaces/ITrip";

interface ISearchProps {
  onSearchResult: (trips: ITrip[]) => void;
  onRequiredSeatsSet: (seats: number) => void;
}

export const Search: FC<ISearchProps> = ({
  onSearchResult,
  onRequiredSeatsSet,
}) => {
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [departure, setDeparture] = useState(moment());
  const [seats, setSeats] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >();

  const onFinish = async () => {
    try {
      const tzOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      const localISOTime = departure
        .subtract(tzOffset)
        .toISOString()
        .slice(0, -1);

      const res = await axios.post<ITrip[]>(
        "http://localhost:3050/api/trips/find",
        {
          from,
          to,
          departure: localISOTime,
          availableSeats: seats,
        }
      );
      onSearchResult && onSearchResult(res.data);
    } catch (err) {
      const serverError = err as AxiosError<{ message: string }>;
      if (serverError && serverError.response) {
        setMessage(serverError.response.data.message);
      } else {
        setMessage("something went wrong!");
      }

      setMessageType("error");
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col offset={8} span={8}>
            <h2>Search a Trip</h2>
          </Col>
        </Row>

        {message ? (
          <Row style={{ marginBottom: "24px" }}>
            <Col offset={8} span={8}>
              <Alert message={message} type={messageType} />
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Form
          name="search"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="From"
            name="from"
            rules={[
              { required: true, message: "Please input your starting point!" },
            ]}
          >
            <Input value={from} onChange={(val) => setFrom(val.target.value)} />
          </Form.Item>

          <Form.Item
            label="To"
            name="to"
            rules={[
              { required: true, message: "Please input your destination!" },
            ]}
          >
            <Input value={to} onChange={(val) => setTo(val.target.value)} />
          </Form.Item>

          <Form.Item
            label="Departure"
            name="departure"
            rules={[
              { required: true, message: "Please input a departure date!" },
            ]}
          >
            <DatePicker
              onChange={(date, dateStr) => setDeparture(moment(dateStr))}
              value={departure}
            />
          </Form.Item>

          <Form.Item
            label="Seats"
            name="seats"
            rules={[
              { required: true, message: "Please input number of seats!" },
            ]}
          >
            <InputNumber
              onChange={(v) => {
                setSeats(v as number);
                onRequiredSeatsSet(v as number);
              }}
              value={seats}
              min={1}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
