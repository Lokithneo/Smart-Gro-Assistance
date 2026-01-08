 import React, { useState } from "react";

export default function ProductForm({ onSubmit }){
  const [form, setForm] = useState({ name:"", sku:"", price:0, quantity:0, description:"", image:"" });
  const change = e => setForm({...form, [e.target.name]: e.target.value});
  return (
    <form className="form" onSubmit={e => { e.preventDefault(); onSubmit(form); setForm({ name:"", sku:"", price:0, quantity:0, description:"", image:"" }); }}>
      <input name="name" placeholder="Name" value={form.name} onChange={change} required />
      <input name="sku" placeholder="SKU" value={form.sku} onChange={change} required />
      <input name="price" placeholder="Price" type="number" value={form.price} onChange={change} required />
      <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={change} required />
      <input name="image" placeholder="Image URL" value={form.image} onChange={change} />
      <button type="submit">Create</button>
    </form>
  );
}
