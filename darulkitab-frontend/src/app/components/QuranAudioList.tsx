import React, { useEffect, useState } from "react";
import api from "../api/axios";

/* ================================
   TYPES (match backend response)
================================ */

interface QuranAudio {
  id: number;
  filename: string;
  filepath: string;
  surah_no: number;
  ayah_start: number | null;
  ayah_end: number | null;
  reciter: string | null;
  duration_seconds: number | null;
}

/* ================================
   COMPONENT
================================ */

export default function QuranAudioList() {
  const [audios, setAudios] = useState<QuranAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const res = await api.get("/quran/audio-list.php");
        const audiodata = res.data;
        console.log(audiodata);
        setAudios(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load Quran audio list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading audio...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Qur’an Audio</h4>

      <div className="list-group">
        {audios.map((audio) => (
          <div
            key={audio.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-semibold">
                Surah {audio.surah_no}
                {audio.ayah_start !== null && audio.ayah_end !== null && (
                  <span className="text-muted">
                    {" "}
                    (Ayah {audio.ayah_start}–{audio.ayah_end})
                  </span>
                )}
              </div>

              {audio.reciter && (
                <div className="text-muted small">
                  Reciter: {audio.reciter}
                </div>
              )}
            </div>

            {/* ▶ PLAY BUTTON */}
            <audio controls preload="none">
              <source
                src={`${api.defaults.baseURL}quran/stream.php?id=${audio.id}`}
                type="audio/mpeg"
              />
              Your browser does not support audio playback.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
