import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">

        <h2 className="text-2xl font-bold mb-6">
          DANH MỤC
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">

          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                border
                rounded-lg
                bg-white
                p-4
                cursor-pointer
                transition
                hover:shadow-lg
                hover:-translate-y-1
              "
            >
              <div className="flex justify-center mb-3">
                <img
                  src={`http://localhost:8000/storage/${cat.image}`}
                  alt={cat.name}
                  className="
                    w-20
                    h-20
                    object-cover
                    rounded-full
                  "
                />
              </div>

              <p
                className="
                  text-center
                  text-sm
                  font-medium
                  line-clamp-2
                "
              >
                {cat.name}
                
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}