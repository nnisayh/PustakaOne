export interface Institution {
  id: number;
  name: string;
  city: string;
  icon: string;
  recent: boolean;
  domain: string;
}

export const institutions: Institution[] = [
  {
    id: 1,
    name: "Telkom University",
    city: "Bandung, Indonesia",
    icon: "/logo-telkom.png",
    recent: true,
    domain: "@student.telkomuniversity.ac.id"
  },
  {
    id: 2,
    name: "Universitas Diponegoro",
    city: "Semarang, Indonesia",
    icon: "/logo-undip.jpg",
    recent: false,
    domain: "@student.undip.ac.id"
  },
  {
    id: 3,
    name: "Universitas Indonesia",
    city: "Depok, Indonesia",
    icon: "school",
    recent: false,
    domain: "@ui.ac.id"
  },
];
