import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  const landingPage = (await cookieStore).get('landingPage')?.value;

  if (landingPage) {
    if (landingPage.toLowerCase().includes('blog')) {
      redirect('/blogs');
    } else if (landingPage.toLowerCase().includes('chat')) {
      redirect('/chat');
    }
  }
  
  redirect('/blogs');
}