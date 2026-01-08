import React from "react";
export default function ProductCard({ product, onDelete, onEdit }){
  return (
    <div className="card">
      {product.image && <img src={product.image} alt={product.name} className="product-image" />}
      <h3>{product.name}</h3>
      <p>SKU: {product.sku}</p>
      <p>Price: ₹{product.price}</p>
      <p>Qty: {product.quantity}</p>
      <div className="card-actions">
        <button onClick={()=> onEdit({ name: product.name })}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
