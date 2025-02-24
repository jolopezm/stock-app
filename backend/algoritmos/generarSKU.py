import hashlib, math

def generar_sku(nombre, marca, talla):
    identificador = nombre + marca
    hash_object = hashlib.sha256(identificador.encode())
    hash_digest = hash_object.hexdigest()
    
    sku = int(hash_digest[:6], 16)
    
    sku = str(sku)[:6].zfill(0)
    sku = 1000 * int(sku) + (10 * talla)
    
    return str(sku)