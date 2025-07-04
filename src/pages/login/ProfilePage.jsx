import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Container,
    Col,
    Card,
    Form,
    Spinner
} from "react-bootstrap";

export default function ProfilePage() {
    const { getUserData } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await getUserData();

                setProfile(userData);
            } catch (error) {
                console.error('Error loading profile:', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [getUserData]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    // fallback en caso de no tener datos
    if (!profile) {
        return (
            <Container className="d-flex justify-content-center align-items-center py-5">
                <Card className="shadow-sm p-4 text-center">
                    <div>No se pudieron cargar los datos del perfil.</div>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center py-5">
            <Col xs={12} sm={10} md={8} lg={6}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Mi Perfil</Card.Title>

                        <Form>
                            <Form.Group className="mb-3" controlId="inputNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={profile.name || ""}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="inputEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={profile.email || ""}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="inputRol">
                                <Form.Check
                                    type="checkbox"
                                    id="default-checkbox"
                                    label="Verificado"
                                    defaultChecked={profile.isVerified}
                                    disabled
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}
