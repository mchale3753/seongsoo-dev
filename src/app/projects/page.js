import { redirect } from 'next/navigation';

// Projects list page deprecated — merged into index.
// Redirect anyone who lands on /projects/ to the index #projects anchor.
export default function Page() {
  redirect('/#projects');
}
