"use client";
import { useState, useEffect } from "react";
import likeIcon from "./images/icons/like.png";
import deslikeIcon from "./images/icons/deslike.png";
import loadingIcon from "./images/icons/loading.png";
import closeIcon from "./images/icons/close.png";

const API_URL = "https://api.thecatapi.com/v1/";
const API_KEY = "DEMO-API-KEY";

interface CatImage {
  id: string;
  url: string;
}

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voteHistory, setVoteHistory] = useState<{ imageUrl: string; liked: boolean }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCatImage = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}images/search`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar imagem");

      const data = await response.json();
      setCurrentImage(data[0]);
    } catch (err) {
      setError("Erro ao buscar imagem de gato. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const vote = async (value: number) => {
    if (!currentImage) return;

    try {
      await fetch(`${API_URL}votes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          image_id: currentImage.id,
          value,
        }),
      });

      setVoteHistory([
        { imageUrl: currentImage.url, liked: value > 0 },
        ...voteHistory,
      ]);

      fetchCatImage();
    } catch (err) {
      setError("Erro ao registrar voto. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchCatImage();
  }, []);

  return (
    <main className="container">
      <div className="textSection">
        <h2 className="title">O que acha do Gatin?</h2>

        {error && <p className="error">{error}</p>}

        <div className="buttons">
          <button onClick={() => vote(1)} className="button">
            <img src={likeIcon.src} className="iconButtom" />
            Gostei
          </button>
          <button onClick={() => vote(-1)} className="button">
            <img src={deslikeIcon.src} className="iconButtom" />
            Não Gostei
          </button>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="buttonHistorico">
          Ver Histórico
        </button>
      </div>

      <div className="imageSection">
        {loading ? (
          <img src={loadingIcon.src} className="loadingIcon" />
        ) : (
          currentImage && <img src={currentImage.url} className="catImage" />
        )}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Histórico de Votos</h3>
            <div className="voteHistory">
              {voteHistory.length > 0 ? (
                voteHistory.map((vote, index) => (
                  <div key={index} className={`voteItem ${vote.liked ? "liked" : "disliked"}`}>
                    <img src={vote.imageUrl} alt="Gato votado" className="historyImage" />
                  </div>
                ))
              ) : (
                <p>Nenhum voto registrado ainda.</p>
              )}
            </div>
            <button onClick={() => setIsModalOpen(false)} className="closeButton">
              <img src={closeIcon.src} className="closeIconButton"/>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
