from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ PRODUCT ENDPOINTS ------------------

# Create a product
@app.post("/products")  # <-- Note: No trailing slash
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Get all products
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products  # Returns a list of products directly

# Get a single product
@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

# Update a product
@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only the fields provided in the request
    for key, value in product_data.dict(exclude_unset=True).items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

# Delete a product
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# ------------------ USER ENDPOINTS ------------------

# Create a user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Hash the password (use a library like passlib in a real app)
    db_user = models.User(
        username=user.username,
        password_hash=user.password,  # Replace with hashed password
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get all users
@app.get("/users/", response_model=list[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# Update a user
@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    for key, value in user_data.dict(exclude_unset=True).items():
        if key == "password":
            user.password_hash = value  # Hash this in a real app
        else:
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

# Delete a user
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}