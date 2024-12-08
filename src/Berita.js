import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fetchKategori, fetchBerita } from "./AppService";

function BrutalistBerita() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [kategori, setKategori] = useState([]);
  const [berita, setBerita] = useState([]);
  const [sumber, setSumber] = useState("antara");
  const [selectedKategori, setSelectedKategori] = useState("terbaru");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = berita.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(berita.length / postsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 350);
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchKategori();
        const unwantedSources = ["cnbc", "merdeka", "suara", "tempo"];

        const filterNews = data.endpoints.filter((endpoint) => {
          return !unwantedSources.includes(endpoint.name);
        });

        setKategori(filterNews);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil kategori");
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBerita(sumber, selectedKategori);
        const filteredPosts = data.data.posts.filter((post) => {
          const unwantedSources = ["cnbc", "merdeka", "suara", "tempo"];
          return !unwantedSources.includes(post.name);
        });
        setBerita(filteredPosts);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil berita");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sumber, selectedKategori]);

  if (error) return <p className="p-4 text-center bg-red-200 border-4 border-black">Error: {error}</p>;

  return (
    <div className="min-h-screen font-mono text-black bg-white">
      <div className="p-8 text-white bg-black border-b-4 border-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Icon icon="material-symbols:news" className="w-16 h-16 mr-4" />
            <h1 className="p-2 text-6xl font-bold tracking-tighter uppercase">Ryo News</h1>
          </div>
          <p className="max-w-2xl p-4 mx-auto mb-6 text-2xl">Berita terkini dari sumber terpercaya. Informasi cepat, tanpa basa-basi.</p>
          <a href="#tabs" className="block max-w-sm px-8 py-4 mx-auto text-2xl font-bold text-black transition-all bg-white border-4 border-black hover:bg-yellow-200">
            Baca Berita Sekarang
          </a>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto" id="tabs">
        <div className="mb-6">
          <div className="flex mb-4 space-x-2 overflow-x-auto xl:grid xl:grid-cols-8">
            {kategori.map((item) => (
              <button
                key={item.name}
                className={`
                  px-5 py-2.5
                  border-4 border-black 
                  text-xl font-bold uppercase
                  ${sumber === item.name ? "bg-yellow-300" : "bg-white"}
                  hover:bg-yellow-200
                  transition-all
                `}
                onClick={() => {
                  setSumber(item.name);
                  setSelectedKategori("terbaru");
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {kategori
              .find((item) => item.name === sumber)
              ?.paths.map((path) => (
                <button
                  key={path.name}
                  className={`
                    px-4 py-2.5 
                    border-4 border-black 
                    text-lg font-bold uppercase
                    ${selectedKategori === path.name ? "bg-yellow-300" : "bg-white"}
                    hover:bg-yellow-200
                    transition-all
                  `}
                  onClick={() => setSelectedKategori(path.name)}
                >
                  {path.name}
                </button>
              ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-black animate-spin"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((item, index) => (
              <div key={index} className="flex flex-col p-4 transition-all bg-white border-4 border-black hover:bg-yellow-50">
                <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-64 mb-4 border-4 border-black" loading="lazy" />
                <div className="flex flex-col flex-1">
                  <h2 className="pb-2 mb-2 text-2xl font-bold uppercase border-b-4 border-black">{item.title}</h2>
                  <p className="flex-grow mb-4 text-lg">{item.description || "Tidak ada deskripsi"}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 mt-auto font-bold text-center text-white uppercase transition-all bg-black border-4 border-white hover:bg-yellow-300 hover:text-black"
                  >
                    Baca Selengkapnya
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-6 space-x-2 overflow-x-auto">
          {[...Array(totalPages).keys()].map((num) => (
            <button key={num} onClick={() => handlePageChange(num + 1)} className={`px-4 py-2 font-bold border-4 border-black ${currentPage === num + 1 ? "bg-yellow-300" : "bg-white"} hover:bg-yellow-200`}>
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrutalistBerita;
