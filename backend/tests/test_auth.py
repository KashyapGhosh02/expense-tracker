def test_register_and_login(client):
    register_res = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "Test@1234"},
    )
    assert register_res.status_code == 200

    login_res = client.post(
        "/auth/login",
        json={"username": "TESTUSER", "password": "Test@1234"},
    )
    assert login_res.status_code == 200
