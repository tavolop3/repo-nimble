// Escribo los comentarios en inglés para facilitar la lectura del código
const { useState, useEffect } = React;

const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const EMAIL = "tavo.lop33@gmail.com";

// UI main component
const JobItem = ({ job, candidate }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/candidate/apply-to-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: candidate.uuid,
            jobId: job.id,
            candidateId: candidate.candidateId,
            repoUrl: repoUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Error en la postulación");
      }

      // Not ideal but for simplicity
      alert("Postulación enviada correctamente");
      setRepoUrl("");
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // individual render of input for each job item
  return (
    <section>
      <h3>{job.title}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="URL de GitHub"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
};

// app logic
const App = () => {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // step2: get candidate data
        const candidateRes = await fetch(
          `${BASE_URL}/api/candidate/get-by-email?email=${EMAIL}`
        );
        const candidateData = await candidateRes.json();
        if (!candidateRes.ok) {
          throw new Error(candidateData?.message || "No pudimos obtener la data del candidato, reintentá por favor");
        }
        setCandidate(candidateData);

        // step 3: get available job list through api
        const jobsRes = await fetch(
          `${BASE_URL}/api/jobs/get-list`
        );
        const jobsData = await jobsRes.json();
        if (!jobsRes.ok) {
          throw new Error(jobsData?.message || "No pudimos obtener las posiciones disponibles, reintentá por favor");
        }
        setJobs(jobsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // show necessary indicators
  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // check if candidate is null
  if (!candidate) return <p>No se pudo cargar la información del candidato.</p>;
  // main render of job positions and inputs
  return (
    <>
      <h1>Listado de Posiciones</h1>
      {jobs.map((job) => (
        <JobItem
          key={job.id}
          job={job}
          candidate={candidate}
        />
      ))}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
