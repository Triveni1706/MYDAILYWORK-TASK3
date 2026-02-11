import { useState } from "react";
import axios from "../../api/axiosInstance";

import { useNavigate } from "react-router-dom";

const CreateTeamTest = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [msg, setMsg] = useState("");
  const [createdTeam, setCreatedTeam] = useState(null);


  const createTeam = async () => {
  if (!teamName.trim()) {
    setMsg("Team name required");
    return;
  }

  try {
    const res = await axios.post(
      "/teams",
      { teamName },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCreatedTeam(res.data);
    setMsg(" Team created successfully");

    setTimeout(() => {
      navigate("/manager/create-project", {
        state: { teamId: res.data._id, teamName: res.data.team_name },
      });
    }, 2000);
  } catch (err) {
    setMsg(" Failed to create team");
  }
};



  return (
    <div className="create-team-test-page">
      <div className="create-team-test-card">
        <h2>Create Team</h2>
        <p>Create a new team</p>

        <input
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        <button onClick={createTeam}>Create Team</button>

        {msg && <div className="create-team-test-msg">{msg}</div>}
        {createdTeam && (
          <div style={{ marginTop: "10px", color: "#34ffd2" }}>
            Created Team: <b>{createdTeam.team_name}</b>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateTeamTest;
