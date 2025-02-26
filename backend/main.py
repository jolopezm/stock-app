from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal, engine
from datetime import datetime
from algoritmos.generarSKU import generar_sku
import logging


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
logger = logging.getLogger("uvicorn")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def migrate_entry_dates(db: Session):
    products = db.query(models.Product).all()
    for product in products:
        if isinstance(product.entry_date, str):
            product.entry_date = int(datetime.strptime(product.entry_date, "%d/%m/%Y").timestamp())
    db.commit()

# Run once
db = SessionLocal()
migrate_entry_dates(db)
db.close()
# ------------------ PRODUCT ENDPOINTS ------------------
#Crea productos
@app.post("/api/products")
def add_or_update_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    try:
        sku = generar_sku(product.name, product.brand, product.size)
        
        existing_product = db.query(models.Product).filter(models.Product.sku == sku).first()
        
        if existing_product:
            existing_product.quantity += product.quantity
            db.commit()
            db.refresh(existing_product)
            return existing_product
        else:
            db_product = models.Product(**product.dict())
            db_product.sku = sku
            db.add(db_product)
            db.commit()
            db.refresh(db_product)
            return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#Retorna todos los productos
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

@app.get("/api/products/{sku}", response_model=schemas.Product)
def get_product(sku: int, db: Session = Depends(get_db)):
    try:
        product = db.query(models.Product).filter(models.Product.sku == sku).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        entry_date = product.entry_date
        if isinstance(entry_date, str):
            entry_date = int(datetime.strptime(entry_date, "%d/%m/%Y").timestamp())
        elif isinstance(entry_date, datetime):
            entry_date = int(entry_date.timestamp())
        elif entry_date is None:
            entry_date = 0
        
        return {
            "sku": product.sku,
            "name": product.name,
            "brand": product.brand,
            "category": product.category or "",
            "gender": product.gender,
            "size": product.size,
            "color": product.color or "",
            "quantity": product.quantity,
            "promo_price": product.promo_price or 0.0,
            "discount_price": product.discount_price or 0.0,
            "normal_price": product.normal_price,
            "description": product.description or "",
            "entry_date": product.entry_date,
        }
    except Exception as e:
        logger.error(f"Error retrieving product: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

#Actualiza un producto
@app.put("/api/products/{sku}", response_model=schemas.Product)
def update_product(sku: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    try:
        product = db.query(models.Product).filter(models.Product.sku == sku).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Update fields from the request body
        update_data = product_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)

        db.commit()
        db.refresh(product)

        # Prepare response
        entry_date = product.entry_date
        if isinstance(entry_date, str):
            entry_date = int(datetime.strptime(entry_date, "%d/%m/%Y").timestamp())
        elif entry_date is None:
            entry_date = 0

        product_data = {
            "sku": product.sku,
            "name": product.name,
            "brand": product.brand,
            "category": product.category or "",
            "size": product.size,
            "color": product.color or "",
            "quantity": product.quantity,
            "promo_price": product.promo_price or 0.0,
            "discount_price": product.discount_price or 0.0,
            "normal_price": product.normal_price,
            "description": product.description or "",
            "entry_date": entry_date,
        }

        return product_data
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


#Elimina un producto
@app.delete("/api/products/{sku}")
def delete_product(sku: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.sku == sku).first()
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