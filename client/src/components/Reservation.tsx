import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import axios, { AxiosError } from "axios";
import { IUser } from "../interfaces/IUser";

export const Reservation: FC = () => {
  const { tripId, seats } = useParams();
  const [reservationId, setReservationId] = useState<number>();
  const [firstNames, setFirstNames] = useState<string[]>([]);
  const [lastNames, setLastNames] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >();
  const navigate = useNavigate();

  useEffect(() => {
    if (tripId === undefined || seats === undefined) {
      navigate("/");
    }

    axios
      .post<IUser>(`http://localhost:3050/api/reservations`, {
        tripId: parseInt(tripId as string),
        requiredSeats: parseInt(seats as string),
      })
      .then((res) => res.data)
      .then((data) => setReservationId(data.id))
      .catch((err) => {
        navigate("/");
      });
  }, [seats, tripId, navigate]);

  const onFinish = async (values: any) => {
    if (!reservationId) {
      navigate("/");
    }

    try {
      const users = [];
      const parsedSeats = seats ? parseInt(seats) : 1;
      for (let i = 0; i < parsedSeats; i++) {
        users.push({
          firstName: firstNames[i],
          lastName: lastNames[i],
          email: emails[i],
        });
      }

      await axios.patch<IUser>(
        `http://localhost:3050/api/reservations/${reservationId}`,
        {
          status: "completed",
          users,
        }
      );

      navigate("/");
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

  const getFields = () => {
    const fields = [];
    const parsedSeats = seats ? parseInt(seats) : 1;
    for (let i = 0; i < parsedSeats; i++) {
      fields.push(
        <Form.Item
          key={`firstName_${i}`}
          label="First Name"
          name={`firstName_${i}`}
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input
            value={firstNames[i]}
            onChange={(val) => {
              const newFirstNames = [...firstNames];
              newFirstNames[i] = val.target.value;
              setFirstNames(newFirstNames);
            }}
          />
        </Form.Item>,

        <Form.Item
          key={`lastName_${i}`}
          label="Last Name"
          name={`lastName_${i}`}
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input
            value={lastNames[i]}
            onChange={(val) => {
              const newLastNames = [...lastNames];
              newLastNames[i] = val.target.value;
              setLastNames(newLastNames);
            }}
          />
        </Form.Item>,

        <Form.Item
          key={`email_${i}`}
          label="Email"
          name={`email_${i}`}
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            value={emails[i]}
            onChange={(val) => {
              const newEmails = [...emails];
              newEmails[i] = val.target.value;
              setEmails(newEmails);
            }}
          />
        </Form.Item>
      );

      if (i < parsedSeats - 1) {
        fields.push(
          <div key={`separator_${i}`} style={{ paddingTop: "24px" }} />
        );
      }
    }

    return fields;
  };

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col offset={8} span={8}>
            <h2>Reservation</h2>
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
          name="reservation"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {getFields()}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
