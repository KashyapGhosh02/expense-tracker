import pytest

def registration_and_login(client,username,password):
    client.post(
        "/auth/register",
        json={"username":"admin_username","password":"Admin@1234"}
    )
    client.post(
        "/auth/login",
        json={"username":"admin_username","password":"Admin@1234"}
    )
    
    def test_non_admin_cannot_access_admin_routes(client):
        registration_and_login(client,"normaluser","Test@1234")
        
        response=client.get("/admin/users")
        assert response.status_code==403
        
    def test_non_admin_can_access_admin_routes(client):
        
        # registration
        registration_and_login(client,"admin_username","Admin@1234")
        
        # admin access in the db
        from models import User
        admin =db_session.query(User).filter_by(username="admin_username").first()
        admin.is_admin=True
        db_session.commit()
        
        client.post(
            "auth/login",
            json={"username":"admin_username","password":"Admin@1234"}
        )
        
        # request to admin route
        response_client=client.get("/admin/user")
        assert response_client.status==200
        assert isinstance(response_client.json(),list)
        
        # similarly test for expenses route
        response_expenses=client.get("/admin/expenses")
        assert response_expenses.status==200
        assert isinstance(response_expenses.json(),list)
        
        
    
    