export interface ComponentProps {
  name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  ref?: React.Ref<any>;
}
