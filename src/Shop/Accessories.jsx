import React from "react";
import products from "../Data/Product";

function Accessories({ addToCart }) {
    const AccessoriesProducts = products.filter((product) => product.category === "Accessories");

    return (
        <div className="min-h-screen py-16 px-6 lg:px-20 bg-gray-50">
            <h1 className="text-4xl font-serif mb-10 text-center">Accessories's Collection</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {AccessoriesProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded shadow p-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 object-cover rounded"
                        />
                        <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-500">${product.price}</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Accessories;
