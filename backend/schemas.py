from pydantic import BaseModel
from typing import Optional

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    quantity: int
    price: float

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None

class Product(BaseModel):
    id: int
    name: str
    quantity: int
    price: float

    class Config:
        orm_mode = True

# User Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

class User(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True