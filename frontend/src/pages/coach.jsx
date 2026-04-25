import React, { useState } from "react";
import "../styles/coachModern.css";
import {
  Users, CalendarDays, Dumbbell,
  Plus, Search, Trash2, LayoutDashboard
} from "lucide-react";

const initialMembers = [
  { id: 1, name: "Ahmed Benali", activity: "Musculation", goal: "Mass", progress: 70 },
  { id: 2, name: "Sara El Amrani", activity: "Fitness", goal: "Weight loss", progress: 55 },
];

function Coach() {
  const [tab, setTab] = useState("dashboard");
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    activity: "",
    goal: ""
  });

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addMember = () => {
    if (!form.name) return;

    setMembers([
      ...members,
      { ...form, id: Date.now(), progress: 0 }
    ]);

    setForm({ name: "", activity: "", goal: "" });
    setOpenForm(false);
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Coach Panel</h2>

        <button onClick={() => setTab("dashboard")}>
          <LayoutDashboard size={18}/> Dashboard
        </button>

        <button onClick={() => setTab("members")}>
          <Users size={18}/> Members
        </button>

        <button onClick={() => setTab("sessions")}>
          <CalendarDays size={18}/> Sessions
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="topbar">
          <h3>Welcome Coach 👋</h3>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="grid">
            <div className="card">
              <Users />
              <h2>{members.length}</h2>
              <p>Members</p>
            </div>

            <div className="card">
              <Dumbbell />
              <h2>5</h2>
              <p>Activities</p>
            </div>

            <div className="card">
              <CalendarDays />
              <h2>12</h2>
              <p>Sessions</p>
            </div>
          </div>
        )}

        {/* MEMBERS */}
        {tab === "members" && (
          <>
            {/* TOP BAR */}
            <div className="bar">
              <div className="search">
                <Search size={16}/>
                <input
                  placeholder="Search member..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button onClick={() => setOpenForm(true)}>
                <Plus size={16}/> Add
              </button>
            </div>

            {/* LIST */}
            <div className="list">
              {filtered.map(m => (
                <div className="item" key={m.id}>
                  <div>
                    <h4>{m.name}</h4>
                    <p>{m.activity} • {m.goal}</p>

                    <div className="progress">
                      <div style={{ width: m.progress + "%" }}></div>
                    </div>
                  </div>

                  <button onClick={() => deleteMember(m.id)}>
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SESSIONS */}
        {tab === "sessions" && (
          <div className="empty">
            Sessions module coming soon...
          </div>
        )}

      </div>

      {/* MODAL */}
      {openForm && (
        <div className="modal">
          <div className="box">
            <h3>Add Member</h3>

            <input placeholder="Name"
              onChange={(e) => setForm({...form, name:e.target.value})}
            />

            <input placeholder="Activity"
              onChange={(e) => setForm({...form, activity:e.target.value})}
            />

            <input placeholder="Goal"
              onChange={(e) => setForm({...form, goal:e.target.value})}
            />

            <button onClick={addMember}>Save</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Coach;