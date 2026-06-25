export interface EncyclopediaSection {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  subsections: EncyclopediaSubsection[];
}

export interface EncyclopediaSubsection {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}
