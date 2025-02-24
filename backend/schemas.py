from pydantic import BaseModel
from typing import Optional

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    brand: str
    category: Optional[str] = None
    size: float
    color: Optional[str] = None
    quantity: int
    promo_price: Optional[float] = None
    discount_price: Optional[float] = None
    normal_price: float
    description: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    #brand: Optional[str] = None
    category: Optional[str] = None
    size: Optional[float] = None
    color: Optional[str] = None
    quantity: Optional[int] = None
    promo_price: Optional[float] = None
    discount_price: Optional[float] = None
    normal_price: Optional[float] = None
    description: Optional[str] = None

class Product(BaseModel):
    sku: int
    name: str
    brand: str
    category: str
    size: float
    color: str
    quantity: int
    promo_price: float
    discount_price: float
    normal_price: float
    description: str
    entry_date: int

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