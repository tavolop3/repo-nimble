const { useState } = React;

const BASE_URL = ""; // TODO
const UUID = "a2661e9a-b067-45aa-ba51-99461dd6b7cc";
const CANDIDATE_ID = "74336191005";
const positions = [
  { id: "4416372005", title: "Fullstack Developer" },
  { id: "9100000001", title: "Head Chef" },
  { id: "9100000002", title: "Veterinarian" },
  { id: "9100000003", title: "Civil Engineer" },
  { id: "9100000004", title: "Interior Designer" },
  { id: "9100000005", title: "Flight Attendant" },
  { id: "9100000006", title: "Marine Biologist" },
  { id: "9100000007", title: "Landscape Architect" },
  { id: "9100000008", title: "Pastry Chef" },
  { id: "9100000009", title: "Physical Therapist" }
];

const JobItem = ({ id, title }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/api/candidate/apply-to-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: UUID,
            jobId: id,
            candidateId: CANDIDATE_ID,
            repoUrl: repoUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la postulación");
      }

      alert(`Postulación enviada para: ${title}`);
      setRepoUrl(""); // limpia el input
    } catch (error) {
      alert("Hubo un error al enviar la postulación");
      console.error(error);
    }
  };

  return (
    <section>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="URL de GitHub"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

const App = () => (
  <>
    <h1>Listado de Posiciones</h1>
    {positions.map((p) => (
      <JobItem key={p.id} id={p.id} title={p.title} />
    ))}
  </>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
