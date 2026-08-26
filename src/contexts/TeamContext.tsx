"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type TeamContextType = {
  activeTeam: string;
  setActiveTeam: (team: string) => void;
  teams: string[];
  addTeam: (team: string) => void;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [activeTeam, setActiveTeam] = useState("U-19");
  const [teams, setTeams] = useState(["Перша команда", "U-19", "U-17"]);

  const addTeam = (team: string) => {
    if (!teams.includes(team)) {
      setTeams([...teams, team]);
      setActiveTeam(team);
    }
  };

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam, teams, addTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
