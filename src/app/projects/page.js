import PageShell from '@/components/PageShell';
import ProjectModal from '@/components/ProjectModal';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const page = content.projects;
export const metadata = buildMetadata(page.meta);

export default function Page() {
  return (
    <>
      <PageShell active="projects" html={page.main} footerLinks={FooterLinks.projects} />
      <ProjectModal details={content.projectDetails} />
    </>
  );
}
