import React, { createContext, useContext, useEffect, useState } from "react";
import { Project } from "../lib/types";
import { SERVER } from "@/lib/axios";
import { useAuth } from "./auth-provider";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  projects: Project[];
  loading: boolean;
  switchProject: (projectId: string) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
  activeProject: null,
  setActiveProject: () => {},
  projects: [],
  loading: true,
  switchProject: () => {},
});

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getItem, setItem } = useAsyncStorage("activeProjectId");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await SERVER.get<Project[]>(
          `/projects/my-projects/${user?._id}`
        );
        setProjects(data);
        const activeProjectId = await getItem();
        const projectWithActiveId = data.find(
          (project) => project._id === activeProjectId
        );
        if (projectWithActiveId && projectWithActiveId._id) {
          console.log("Found: Setting active project");
          setActiveProject(projectWithActiveId);
        } else {
          console.log("No active project found, setting first project");
          setActiveProject(data[0]);
          setItem(data[0]._id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const switchProject = (projectId: string) => {
    const project = projects.find((project) => project._id === projectId);
    if (project) {
      setActiveProject(project);
      setItem(projectId);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        setActiveProject,
        projects,
        loading,
        switchProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const value = useContext(ProjectContext);
  if (!value) {
    throw new Error("useProject must be used within an ProjectProvider");
  }
  return value;
};
