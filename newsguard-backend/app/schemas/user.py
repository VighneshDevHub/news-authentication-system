from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    username: Optional[str] = None
    role: Optional[str] = "user"
    preferences: Optional[dict] = {}

class UserCreate(UserBase):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    username: str

class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=8, max_length=72)
    role: Optional[str] = None
    preferences: Optional[dict] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
