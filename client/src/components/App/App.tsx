import React, { FC, useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, Col, Layout, PageHeader, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { SignIn } from "../SignIn";
import { SignUp } from "../SignUp";
import axios from "axios";
import { IUser } from "../../interfaces/IUser";
import { Home } from "../Home";
import { Reservation } from "../Reservation";
import { Reservations } from "../Reservations";
import { Users } from "../Users";
import { AllTrips } from "../AllTrips";

export const App: FC = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);

  const login = (user: IUser) => {
    if (user.id) {
      setAuthorized(true);
    }

    if (user.admin) {
      setAdmin(true);
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:3050/api/users/signout");
    setAuthorized(false);
    setAdmin(false);
    navigate("/");
  };

  useEffect(() => {
    axios
      .get<IUser>("http://localhost:3050/api/users/whoami")
      .then((res) => res.data)
      .then((user) => {
        if (user.id) {
          setAuthorized(true);
        }

        if (user.admin) {
          setAdmin(true);
        }
      })
      .catch((err) => {
        setAuthorized(false);
        setAdmin(false);
      });
  }, []);

  const getButtons = () => {
    const buttons = [
      <Button key="home">
        <Link to="/">Home</Link>
      </Button>,
    ];
    if (admin) {
      buttons.push(
        <Button key="reservations">
          <Link to="/reservations">All Reservations</Link>
        </Button>,
        <Button key="users">
          <Link to="/users">All Users</Link>
        </Button>,
        <Button key="trips">
          <Link to="/trips">All Trips</Link>
        </Button>
      );
    }

    if (authorized) {
      buttons.push(
        <Button key="logout" type="primary">
          <Link to="/logout" onClick={logout}>
            Logout
          </Link>
        </Button>
      );
    } else {
      buttons.push(
        <Button key="signin">
          <Link to="/signin">Sign In</Link>
        </Button>,
        <Button key="signup" type="primary">
          <Link to="/signup">Sign Up</Link>
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <PageHeader ghost={false} title="TripBook" extra={getButtons()} />
      <Content style={{ paddingTop: "24px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/reservations/:tripId/:seats"
            element={<Reservation />}
          />

          <Route
            path="/reservations"
            element={<Reservations authorized={authorized} />}
          />
          <Route path="/trips" element={<AllTrips authorized={authorized} />} />
          <Route path="/users" element={<Users authorized={authorized} />} />

          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/signin"
            element={<SignIn onSignIn={(user) => login(user)} />}
          />
        </Routes>
      </Content>
    </Layout>
  );
};
