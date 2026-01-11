def test_register_and_login(client):
    register_res = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "testpass"},
    )
    assert register_res.status_code == 200

    login_res = client.post(
        "/auth/login",
        json={"username": "testuser", "password": "testpass"},
    )
    assert login_res.status_code == 200
