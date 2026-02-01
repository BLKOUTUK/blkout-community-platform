import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Download, Package, Info } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  slug: string;
  type: 'digital' | 'physical' | 'journal' | 'ticket' | 'marketplace';
  price_gbp: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: string;
  liberation_score: string;
  profit_breakdown: {
    creator: number;
    platform: number;
    community: number;
    production: number;
  };
  thumbnail_url?: string;
  image_urls?: any;
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{product: Product; quantity: number}[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) =>
    sum + (parseFloat(item.product.price_gbp) * item.quantity), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">BLKOUT Shop</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black mb-4 uppercase">BLKOUT Shop</h1>
          <p className="text-xl text-white/80">Liberation-funded products for Black queer community empowerment</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-yellow-500" />
              <span className="text-white">{cart.length} items in cart</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">£{cartTotal.toFixed(2)}</div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                <Package className="w-16 h-16 text-white/30" />
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="text-xs text-yellow-500 uppercase tracking-wider mb-2">
                  {product.category}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>

                {/* Short Description */}
                <p className="text-gray-400 text-sm mb-4">{product.short_description}</p>

                {/* Liberation Score */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-400">
                    Liberation Score: {(parseFloat(product.liberation_score) * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    £{parseFloat(product.price_gbp).toFixed(2)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Type Badge */}
                <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                  {product.type === 'digital' && <Download className="w-3 h-3" />}
                  {product.type === 'physical' && <Package className="w-3 h-3" />}
                  <span className="capitalize">{product.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Product Detail */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="h-96 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                    <Package className="w-32 h-32 text-white/30" />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="text-xs text-yellow-500 uppercase tracking-wider mb-2">
                      {selectedProduct.category}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">{selectedProduct.name}</h2>
                    <p className="text-gray-300 mb-6">{selectedProduct.description}</p>

                    {/* Liberation Score */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-white">Liberation Score</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {(parseFloat(selectedProduct.liberation_score) * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Measures alignment with cooperative ownership and community values
                      </p>
                    </div>

                    {/* Profit Breakdown */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-3 text-white">Where Your Money Goes</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Creator Share</span>
                          <span className="text-white font-semibold">{selectedProduct.profit_breakdown.creator}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform Operations</span>
                          <span className="text-white font-semibold">{selectedProduct.profit_breakdown.platform}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Community Fund</span>
                          <span className="text-white font-semibold">{selectedProduct.profit_breakdown.community}%</span>
                        </div>
                        {selectedProduct.profit_breakdown.production > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Production Costs</span>
                            <span className="text-white font-semibold">{selectedProduct.profit_breakdown.production}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-4xl font-bold text-yellow-500">
                        £{parseFloat(selectedProduct.price_gbp).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-yellow-500 text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart - £{parseFloat(selectedProduct.price_gbp).toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Sidebar (if items) */}
        {cart.length > 0 && (
          <div className="fixed bottom-8 right-8 bg-gray-900 border border-yellow-500 rounded-lg p-6 shadow-2xl max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-yellow-500" />
              Your Cart
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.product.name}</div>
                    <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-yellow-500 font-semibold">
                    £{(parseFloat(item.product.price_gbp) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-yellow-500">£{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
