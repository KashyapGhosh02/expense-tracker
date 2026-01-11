def test_create_and_get_expense(client):
    client.post(
        "/auth/register",
        json={"username": "expuser", "password": "exp123"},
    )

    client.post(
        "/auth/login",
        json={"username": "expuser", "password": "exp123"},
    )

    create_res = client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 200,
            "category": "Food",
            "date": "2025-01-01",
        },
    )

    assert create_res.status_code == 200

    list_res = client.get("/expenses")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1
