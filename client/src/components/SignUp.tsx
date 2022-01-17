import React, { FC, useState } from "react";
import { Button, Form, Input, Row, Col, Alert } from "antd";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { IUser } from "../interfaces/IUser";

interface ISignUpProps {
  onSignUp?: () => void;
}

export const SignUp: FC<ISignUpProps> = ({ onSignUp }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await axios.post<IUser>(`http://localhost:3050/api/users/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      setMessage("Success");
      setMessageType("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      onSignUp && onSignUp();

      navigate("/signin");
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
            <h2>Sign Up</h2>
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
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input
              value={firstName}
              onChange={(val) => setFirstName(val.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input
              value={email}
              onChange={(val) => setLastName(val.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={email}
              onChange={(val) => setEmail(val.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(val) => setPassword(val.target.value)}
            />
          </Form.Item>

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
