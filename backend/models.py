from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

# Product model
class Product(Base):
    __tablename__ = "products"
    sku = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String)
    category = Column(String, nullable=True)
    gender = Column(String)
    size = Column(Float)
    color = Column(String, nullable=True)
    quantity = Column(Integer)
    promo_price = Column(Float, nullable=True)
    discount_price = Column(Float, nullable=True)
    normal_price = Column(Float)
    description = Column(String, nullable=True)
    entry_date = Column(DateTime, default=datetime.now)

# User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user")