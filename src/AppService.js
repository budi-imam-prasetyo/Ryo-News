import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-berita-indonesia.vercel.app/",
  headers: { "Content-Type": "application/json" },
});

export async function fetchKategori() {
    try{
        const response = await apiClient.get("");
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function fetchBerita(sumber, kategori) {
    try{

        const response = await apiClient.get(`${sumber}/${kategori}`);
        return response.data;
    }catch(err){
        console.log(err);
    }
}
