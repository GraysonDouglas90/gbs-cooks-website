import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

const ADMIN_PASSWORD = 'gbscooks2024';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('brands');
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [msg, setMsg] = useState('');

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    if (authed) { fetchBrands(); fetchProducts(); }
  }, [authed]);

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*, product_images(*), product_documents(*), product_specs(*), product_features(*)').order('name');
    setProducts(data || []);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-2">GBS Admin Panel</h1>
          <p className="text-gray-400 mb-6">Enter your admin password</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && password === ADMIN_PASSWORD) setAuthed(true); }} placeholder="Password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-red-500" />
          <button onClick={() => { if (password === ADMIN_PASSWORD) setAuthed(true); else showMsg('Wrong password'); }} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">Log In</button>
          {msg && <p className="text-red-400 mt-3 text-center">{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold"><span className="text-red-600">GBS</span> Admin</h1>
          <a href="/#/" className="text-sm text-gray-400 hover:text-white">&larr; View Site</a>
        </div>
        <button onClick={() => setAuthed(false)} className="text-sm text-gray-400 hover:text-white">Log Out</button>
      </div>

      {msg && <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg z-50 shadow-lg">{msg}</div>}

      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex space-x-6">
          {['brands', 'products', 'images', 'import', 'blog'].map(t => (
            <button key={t} onClick={() => { setTab(t); setEditingProduct(null); setEditingBrand(null); }} className={`py-4 font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-red-600 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'brands' && <BrandsTab brands={brands} fetchBrands={fetchBrands} editingBrand={editingBrand} setEditingBrand={setEditingBrand} showMsg={showMsg} />}
        {tab === 'products' && <ProductsTab brands={brands} products={products} fetchProducts={fetchProducts} editingProduct={editingProduct} setEditingProduct={setEditingProduct} showMsg={showMsg} />}
        {tab === 'images' && <ImagesTab products={products} fetchProducts={fetchProducts} showMsg={showMsg} />}
        {tab === 'import' && <ImportTab brands={brands} fetchProducts={fetchProducts} showMsg={showMsg} />}
        {tab === 'blog' && <BlogTab showMsg={showMsg} />}
      </div>
    </div>
  );
}

function BrandsTab({ brands, fetchBrands, editingBrand, setEditingBrand, showMsg }) {
  const [form, setForm] = useState({ id: '', name: '', tagline: '', logo: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingBrand) setForm({ id: editingBrand.id, name: editingBrand.name, tagline: editingBrand.tagline || '', logo: editingBrand.logo || '' });
    else setForm({ id: '', name: '', tagline: '', logo: '' });
  }, [editingBrand]);

  const saveBrand = async () => {
    if (!form.id || !form.name) return showMsg('ID and Name are required');
    if (editingBrand) {
      await supabase.from('brands').update({ name: form.name, tagline: form.tagline, logo: form.logo }).eq('id', form.id);
      showMsg('Brand updated!');
    } else {
      await supabase.from('brands').insert([form]);
      showMsg('Brand added!');
    }
    setEditingBrand(null);
    setForm({ id: '', name: '', tagline: '', logo: '' });
    fetchBrands();
  };

  const deleteBrand = async (id) => {
    if (!confirm('Delete this brand? This will also delete all its products.')) return;
    await supabase.from('brands').delete().eq('id', id);
    showMsg('Brand deleted');
    fetchBrands();
  };

  const uploadBrandImage = async (e, brandId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `brands/${brandId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-assets').upload(fileName, file);
    if (error) { showMsg('Upload failed: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-assets').getPublicUrl(fileName);
    await supabase.from('brands').update({ image_url: publicUrl }).eq('id', brandId);
    showMsg('Brand image uploaded!');
    setUploading(false);
    fetchBrands();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Brand ID (lowercase, no spaces)</label>
            <input value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!editingBrand} placeholder="e.g. americanRange" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Display Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. American Range" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tagline</label>
            <input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} placeholder="e.g. Heavy Duty Cooking Equipment" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Logo Text (2-3 letters, fallback if no image)</label>
            <input value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} placeholder="e.g. AR" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={saveBrand} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">{editingBrand ? 'Update Brand' : 'Add Brand'}</button>
          {editingBrand && <button onClick={() => { setEditingBrand(null); setForm({ id: '', name: '', tagline: '', logo: '' }); }} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Cancel</button>}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">All Brands ({brands.length})</h3>
      <div className="space-y-3">
        {brands.map(b => (
          <div key={b.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="w-16 h-16 object-contain rounded-lg bg-white p-1" />
                ) : (
                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-lg font-bold text-red-500">{b.logo}</div>
                )}
                <div>
                  <div className="font-bold">{b.name}</div>
                  <div className="text-sm text-gray-400">{b.tagline}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingBrand(b)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Edit</button>
                <button onClick={() => deleteBrand(b.id)} className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50">Delete</button>
              </div>
            </div>
            {/* Brand Image Upload */}
            <div className="mt-3 pt-3 border-t border-gray-800">
              <label className="block text-xs text-gray-500 mb-2">Brand Image {b.image_url ? '(click to replace)' : '(upload an image for homepage display)'}</label>
              <label className="inline-block bg-gray-800 border border-dashed border-gray-600 rounded-lg px-4 py-2 text-sm cursor-pointer hover:border-red-600 transition-colors">
                <input type="file" accept="image/*" onChange={e => uploadBrandImage(e, b.id)} className="hidden" />
                {uploading ? 'Uploading...' : b.image_url ? 'Replace Image' : 'Upload Brand Image'}
              </label>
            </div>
          </div>
        ))}
        {brands.length === 0 && <p className="text-gray-500 text-center py-8">No brands yet. Add your first brand above.</p>}
      </div>
    </div>
  );
}

function ProductsTab({ brands, products, fetchProducts, editingProduct, setEditingProduct, showMsg }) {
  const [form, setForm] = useState({ brand_id: '', model: '', name: '', description: '', full_description: '', category: '', video_url: '' });
  const [specs, setSpecs] = useState([{ spec_name: '', spec_value: '' }]);
  const [features, setFeatures] = useState(['']);
  const [filterBrand, setFilterBrand] = useState('all');

  useEffect(() => {
    if (editingProduct) {
      setForm({ brand_id: editingProduct.brand_id || '', model: editingProduct.model || '', name: editingProduct.name || '', description: editingProduct.description || '', full_description: editingProduct.full_description || '', category: editingProduct.category || '', video_url: editingProduct.video_url || '' });
      setSpecs(editingProduct.product_specs?.length > 0 ? editingProduct.product_specs.map(s => ({ spec_name: s.spec_name, spec_value: s.spec_value })) : [{ spec_name: '', spec_value: '' }]);
      setFeatures(editingProduct.product_features?.length > 0 ? editingProduct.product_features.sort((a,b) => a.sort_order - b.sort_order).map(f => f.feature) : ['']);
    } else {
      setForm({ brand_id: '', model: '', name: '', description: '', full_description: '', category: '', video_url: '' });
      setSpecs([{ spec_name: '', spec_value: '' }]);
      setFeatures(['']);
    }
  }, [editingProduct]);

  const saveProduct = async () => {
    if (!form.brand_id || !form.model || !form.name) return showMsg('Brand, Model, and Name are required');
    let productId;
    if (editingProduct) {
      await supabase.from('products').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingProduct.id);
      productId = editingProduct.id;
      await supabase.from('product_specs').delete().eq('product_id', productId);
      await supabase.from('product_features').delete().eq('product_id', productId);
      showMsg('Product updated!');
    } else {
      const { data } = await supabase.from('products').insert([form]).select();
      productId = data[0].id;
      showMsg('Product added!');
    }
    const validSpecs = specs.filter(s => s.spec_name && s.spec_value);
    if (validSpecs.length > 0) await supabase.from('product_specs').insert(validSpecs.map(s => ({ product_id: productId, ...s })));
    const validFeatures = features.filter(f => f.trim());
    if (validFeatures.length > 0) await supabase.from('product_features').insert(validFeatures.map((f, i) => ({ product_id: productId, feature: f, sort_order: i })));
    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product and all its data?')) return;
    await supabase.from('product_specs').delete().eq('product_id', id);
    await supabase.from('product_features').delete().eq('product_id', id);
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('product_documents').delete().eq('product_id', id);
    await supabase.from('products').delete().eq('id', id);
    showMsg('Product deleted');
    fetchProducts();
  };

  const filtered = filterBrand === 'all' ? products : products.filter(p => p.brand_id === filterBrand);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product'}</h2>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm text-gray-400 mb-1">Brand *</label><select value={form.brand_id} onChange={e => setForm({...form, brand_id: e.target.value})} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"><option value="">Select brand...</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div><label className="block text-sm text-gray-400 mb-1">Model Number *</label><input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="e.g. Z14" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Product Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Z14 Self-Service Juicer" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Juicers" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div className="col-span-2"><label className="block text-sm text-gray-400 mb-1">Short Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief one-liner..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div className="col-span-2"><label className="block text-sm text-gray-400 mb-1">Full Description</label><textarea value={form.full_description} onChange={e => setForm({...form, full_description: e.target.value})} rows={4} placeholder="Detailed product description..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div className="col-span-2"><label className="block text-sm text-gray-400 mb-1">Video URL (YouTube embed)</label><input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} placeholder="https://www.youtube.com/embed/..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
        </div>
        <div className="mb-4"><label className="block text-sm text-gray-400 mb-2">Specifications</label>{specs.map((s, i) => (<div key={i} className="flex space-x-2 mb-2"><input value={s.spec_name} onChange={e => { const n = [...specs]; n[i].spec_name = e.target.value; setSpecs(n); }} placeholder="e.g. Dimensions" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" /><input value={s.spec_value} onChange={e => { const n = [...specs]; n[i].spec_value = e.target.value; setSpecs(n); }} placeholder='e.g. 17.9"W x 18.7"D' className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" /><button onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm">&times;</button></div>))}<button onClick={() => setSpecs([...specs, { spec_name: '', spec_value: '' }])} className="text-sm text-red-500 hover:underline">+ Add Specification</button></div>
        <div className="mb-4"><label className="block text-sm text-gray-400 mb-2">Features</label>{features.map((f, i) => (<div key={i} className="flex space-x-2 mb-2"><input value={f} onChange={e => { const n = [...features]; n[i] = e.target.value; setFeatures(n); }} placeholder="e.g. Self-service one-button operation" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" /><button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm">&times;</button></div>))}<button onClick={() => setFeatures([...features, ''])} className="text-sm text-red-500 hover:underline">+ Add Feature</button></div>
        <div className="flex space-x-3">
          <button onClick={saveProduct} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">{editingProduct ? 'Update Product' : 'Add Product'}</button>
          {editingProduct && <button onClick={() => setEditingProduct(null)} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Cancel</button>}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">All Products ({filtered.length})</h3>
        <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"><option value="all">All Brands</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
      </div>
      <div className="space-y-3">
        {filtered.map(p => {
          const b = brands.find(br => br.id === p.brand_id);
          return (
            <div key={p.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg font-bold text-red-500">{b?.logo}</div>
                <div><div className="font-bold">{p.name}</div><div className="text-sm text-gray-400">{b?.name} &bull; {p.model} &bull; {p.category}</div><div className="text-xs text-gray-500">{p.product_images?.length || 0} images &bull; {p.product_documents?.length || 0} documents</div></div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingProduct(p)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50">Delete</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No products yet.</p>}
      </div>
    </div>
  );
}

function ImagesTab({ products, fetchProducts, showMsg }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const [docName, setDocName] = useState('');

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProduct) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `images/${selectedProduct.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-assets').upload(fileName, file);
    if (error) { showMsg('Upload failed: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-assets').getPublicUrl(fileName);
    await supabase.from('product_images').insert([{ product_id: selectedProduct.id, image_url: publicUrl, alt_text: file.name, sort_order: selectedProduct.product_images?.length || 0 }]);
    showMsg('Image uploaded!');
    setUploading(false);
    fetchProducts();
  };

  const uploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProduct) return;
    setDocUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `documents/${selectedProduct.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-assets').upload(fileName, file);
    if (error) { showMsg('Upload failed: ' + error.message); setDocUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-assets').getPublicUrl(fileName);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    await supabase.from('product_documents').insert([{ product_id: selectedProduct.id, name: docName || file.name, file_url: publicUrl, file_type: ext.toUpperCase(), file_size: `${sizeMB} MB` }]);
    showMsg('Document uploaded!');
    setDocUploading(false);
    setDocName('');
    fetchProducts();
  };

  const deleteImage = async (imgId) => {
    await supabase.from('product_images').delete().eq('id', imgId);
    showMsg('Image deleted');
    fetchProducts();
  };

  const deleteDocument = async (docId) => {
    await supabase.from('product_documents').delete().eq('id', docId);
    showMsg('Document deleted');
    fetchProducts();
  };

  const currentProduct = products.find(p => p.id === selectedProduct?.id);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Images & Documents</h2>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <label className="block text-sm text-gray-400 mb-2">Select a product</label>
        <select value={selectedProduct?.id || ''} onChange={e => setSelectedProduct(products.find(p => p.id === e.target.value) || null)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"><option value="">Choose a product...</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.model})</option>)}</select>
      </div>

      {currentProduct && (
        <>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Product Images ({currentProduct.product_images?.length || 0}/3)</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(currentProduct.product_images || []).map(img => (
                <div key={img.id} className="relative bg-white rounded-xl overflow-hidden">
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-48 object-contain p-2" />
                  <div className="p-3 bg-gray-900"><p className="text-xs text-gray-400 truncate">{img.alt_text}</p><button onClick={() => deleteImage(img.id)} className="mt-2 text-xs text-red-400 hover:underline">Delete</button></div>
                </div>
              ))}
            </div>
            {(currentProduct.product_images?.length || 0) < 3 && (
              <label className="block bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-600">
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
                <p className="text-gray-400">{uploading ? 'Uploading...' : 'Click to upload an image'}</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP — max 5MB</p>
              </label>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Documents ({currentProduct.product_documents?.length || 0})</h3>
            <div className="space-y-3 mb-4">
              {(currentProduct.product_documents || []).map(doc => (
                <div key={doc.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div><div className="font-semibold">{doc.name}</div><div className="text-sm text-gray-400">{doc.file_type} &bull; {doc.file_size}</div></div>
                  <div className="flex space-x-2"><a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">View</a><button onClick={() => deleteDocument(doc.id)} className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50">Delete</button></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="Document name (e.g. Specification Sheet)" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              <label className="block bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-red-600">
                <input type="file" accept=".pdf,.doc,.docx" onChange={uploadDocument} className="hidden" />
                <p className="text-gray-400">{docUploading ? 'Uploading...' : 'Click to upload a document'}</p>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ImportTab({ brands, fetchProducts, showMsg }) {
  const [csvData, setCsvData] = useState('');
  const [parsed, setParsed] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState('products');
  const [results, setResults] = useState(null);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuotes = !inQuotes; }
        else if (line[i] === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
        else { current += line[i]; }
      }
      values.push(current.trim());
      const obj = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });
      return obj;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setCsvData(text);
      const rows = parseCSV(text);
      setParsed(rows);
      setResults(null);
    };
    reader.readAsText(file);
  };

  const handlePaste = (text) => {
    setCsvData(text);
    const rows = parseCSV(text);
    setParsed(rows);
    setResults(null);
  };

  const importProducts = async () => {
    if (parsed.length === 0) return showMsg('No data to import');
    setImporting(true);
    let success = 0;
    let errors = 0;
    const errorDetails = [];

    for (const row of parsed) {
      try {
        if (!row.brand_id || !row.model || !row.name) {
          errors++;
          errorDetails.push(`Skipped: missing brand_id, model, or name - ${row.model || 'unknown'}`);
          continue;
        }

        // Check if brand exists
        const brandExists = brands.find(b => b.id === row.brand_id);
        if (!brandExists) {
          errors++;
          errorDetails.push(`Skipped: brand "${row.brand_id}" not found - ${row.model}`);
          continue;
        }

        // Insert product
        const productData = {
          brand_id: row.brand_id,
          model: row.model,
          name: row.name,
          description: row.description || '',
          full_description: row.full_description || '',
          category: row.category || '',
          video_url: row.video_url || ''
        };

        const { data: product, error: prodError } = await supabase.from('products').insert([productData]).select();
        if (prodError) { errors++; errorDetails.push(`Error inserting ${row.model}: ${prodError.message}`); continue; }

        const productId = product[0].id;

        // Insert specs if columns exist (spec_1_name, spec_1_value, spec_2_name, spec_2_value, etc.)
        const specsToInsert = [];
        for (let i = 1; i <= 10; i++) {
          const sName = row[`spec_${i}_name`];
          const sValue = row[`spec_${i}_value`];
          if (sName && sValue) specsToInsert.push({ product_id: productId, spec_name: sName, spec_value: sValue });
        }
        if (specsToInsert.length > 0) await supabase.from('product_specs').insert(specsToInsert);

        // Insert features if columns exist (feature_1, feature_2, etc.)
        const featuresToInsert = [];
        for (let i = 1; i <= 10; i++) {
          const feat = row[`feature_${i}`];
          if (feat) featuresToInsert.push({ product_id: productId, feature: feat, sort_order: i - 1 });
        }
        if (featuresToInsert.length > 0) await supabase.from('product_features').insert(featuresToInsert);

        success++;
      } catch (err) {
        errors++;
        errorDetails.push(`Error: ${row.model || 'unknown'} - ${err.message}`);
      }
    }

    setResults({ success, errors, errorDetails });
    setImporting(false);
    fetchProducts();
    showMsg(`Imported ${success} products!`);
  };

  const importBrands = async () => {
    if (parsed.length === 0) return showMsg('No data to import');
    setImporting(true);
    let success = 0;
    let errors = 0;
    const errorDetails = [];

    for (const row of parsed) {
      try {
        if (!row.id || !row.name) { errors++; errorDetails.push(`Skipped: missing id or name`); continue; }
        const { error } = await supabase.from('brands').insert([{ id: row.id, name: row.name, tagline: row.tagline || '', logo: row.logo || '' }]);
        if (error) { errors++; errorDetails.push(`Error: ${row.id} - ${error.message}`); continue; }
        success++;
      } catch (err) { errors++; errorDetails.push(`Error: ${row.id || 'unknown'} - ${err.message}`); }
    }

    setResults({ success, errors, errorDetails });
    setImporting(false);
    showMsg(`Imported ${success} brands!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">CSV Import</h2>

      {/* Import Type */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <label className="block text-sm text-gray-400 mb-2">What are you importing?</label>
        <div className="flex space-x-3 mb-6">
          <button onClick={() => { setImportType('products'); setParsed([]); setCsvData(''); setResults(null); }} className={`px-5 py-2.5 rounded-full font-medium ${importType === 'products' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>Products</button>
          <button onClick={() => { setImportType('brands'); setParsed([]); setCsvData(''); setResults(null); }} className={`px-5 py-2.5 rounded-full font-medium ${importType === 'brands' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>Brands</button>
        </div>

        {/* Template */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2">CSV Format for {importType === 'products' ? 'Products' : 'Brands'}</h3>
          {importType === 'products' ? (
            <div>
              <p className="text-sm text-gray-400 mb-2">Required columns: <span className="text-red-400">brand_id, model, name</span></p>
              <p className="text-sm text-gray-400 mb-2">Optional columns: description, full_description, category, video_url</p>
              <p className="text-sm text-gray-400 mb-2">Optional specs: spec_1_name, spec_1_value, spec_2_name, spec_2_value (up to 10)</p>
              <p className="text-sm text-gray-400 mb-3">Optional features: feature_1, feature_2, feature_3 (up to 10)</p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto">
                brand_id,model,name,description,category,spec_1_name,spec_1_value,spec_2_name,spec_2_value,feature_1,feature_2<br/>
                zummo,Z14,Z14 Self-Service Juicer,Self-Service Commercial Juicer,Juicers,Dimensions,17.9"W x 18.7"D x 30.5"H,Production,22 fruits/minute,Self-service one-button operation,NSF certified
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-2">Required columns: <span className="text-red-400">id, name</span></p>
              <p className="text-sm text-gray-400 mb-3">Optional columns: tagline, logo</p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto">
                id,name,tagline,logo<br/>
                zummo,Zummo,Citrus Juicing Systems,ZM
              </div>
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="space-y-4">
          <label className="block bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-600 transition-colors">
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            <p className="text-gray-400 text-lg mb-1">Click to upload a CSV file</p>
            <p className="text-xs text-gray-500">.csv or .txt file</p>
          </label>

          <div className="text-center text-gray-500">— or paste CSV data below —</div>

          <textarea
            value={csvData}
            onChange={e => handlePaste(e.target.value)}
            rows={8}
            placeholder="Paste your CSV data here..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Preview */}
      {parsed.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Preview ({parsed.length} rows)</h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {Object.keys(parsed[0]).slice(0, 8).map(h => (
                    <th key={h} className="text-left py-2 px-3 text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    {Object.values(row).slice(0, 8).map((v, j) => (
                      <td key={j} className="py-2 px-3 text-gray-300 whitespace-nowrap max-w-48 truncate">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.length > 20 && <p className="text-sm text-gray-500 mt-2">...and {parsed.length - 20} more rows</p>}
          </div>

          <button
            onClick={importType === 'products' ? importProducts : importBrands}
            disabled={importing}
            className="mt-6 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {importing ? 'Importing...' : `Import ${parsed.length} ${importType}`}
          </button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{results.success}</div>
              <div className="text-sm text-green-400">Successful</div>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{results.errors}</div>
              <div className="text-sm text-red-400">Errors</div>
            </div>
          </div>
          {results.errorDetails.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-red-400 mb-2">Error Details:</h4>
              {results.errorDetails.map((e, i) => (
                <p key={i} className="text-sm text-gray-400 mb-1">{e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlogTab({ showMsg }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', published: false });

  useEffect(() => { fetchPosts(); }, []);
  const fetchPosts = async () => { const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }); setPosts(data || []); };

  useEffect(() => {
    if (editing) setForm({ title: editing.title || '', excerpt: editing.excerpt || '', content: editing.content || '', category: editing.category || '', published: editing.published || false });
    else setForm({ title: '', excerpt: '', content: '', category: '', published: false });
  }, [editing]);

  const savePost = async () => {
    if (!form.title) return showMsg('Title is required');
    if (editing) { await supabase.from('blog_posts').update({ ...form, published_at: form.published ? new Date().toISOString() : null }).eq('id', editing.id); showMsg('Post updated!'); }
    else { await supabase.from('blog_posts').insert([{ ...form, published_at: form.published ? new Date().toISOString() : null }]); showMsg('Post created!'); }
    setEditing(null); fetchPosts();
  };

  const deletePost = async (id) => { if (!confirm('Delete this post?')) return; await supabase.from('blog_posts').delete().eq('id', id); showMsg('Post deleted'); fetchPosts(); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-400 mb-1">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post title" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div><div><label className="block text-sm text-gray-400 mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Maintenance" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div></div>
          <div><label className="block text-sm text-gray-400 mb-1">Excerpt</label><input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Brief summary..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} placeholder="Full blog post..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" /></div>
          <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="rounded" /><span className="text-gray-300">Published</span></label>
          <div className="flex space-x-3"><button onClick={savePost} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">{editing ? 'Update Post' : 'Create Post'}</button>{editing && <button onClick={() => setEditing(null)} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Cancel</button>}</div>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">All Posts ({posts.length})</h3>
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
            <div><div className="flex items-center space-x-2"><div className="font-bold">{p.title}</div><span className={`px-2 py-0.5 rounded text-xs ${p.published ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{p.published ? 'Published' : 'Draft'}</span></div><div className="text-sm text-gray-400">{p.category} &bull; {new Date(p.created_at).toLocaleDateString()}</div></div>
            <div className="flex space-x-2"><button onClick={() => setEditing(p)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Edit</button><button onClick={() => deletePost(p.id)} className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50">Delete</button></div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-gray-500 text-center py-8">No blog posts yet.</p>}
      </div>
    </div>
  );
}
